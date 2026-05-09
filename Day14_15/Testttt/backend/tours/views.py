from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from .models import Tour, Location, Review
from .serializers import TourSerializer, LocationSerializer, TourCreateSerializer, ReviewSerializer
from .filters import TourFilter
from users.permissions import IsAdminRole, IsCreatorRole

class ReviewCreateView(APIView):
    """
    POST /api/tours/<id>/reviews/ - User để lại đánh giá
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        tour = Tour.objects.get(pk=pk)
        
        # Kiểm tra xem user đã đặt tour này chưa (Tùy chọn)
        # booking_exists = Booking.objects.filter(user=request.user, tour=tour).exists()
        
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, tour=tour)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TourCreateView(APIView):
    """
    POST /api/tours/create/ - Creator tạo tour mới
    """
    permission_classes = [IsCreatorRole]

    def post(self, request):
        serializer = TourCreateSerializer(data=request.data)
        if serializer.is_valid():
            # Tự động gán creator là user đang đăng nhập
            serializer.save(creator=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreatorTourListView(ListAPIView):
    """
    GET /api/tours/my-tours/ - Creator xem danh sách tour của chính mình
    """
    permission_classes = [IsCreatorRole]
    serializer_class = TourSerializer

    def get_queryset(self):
        return Tour.objects.filter(creator=self.request.user).order_by('-created_at')

class AdminTourListView(ListAPIView):
    """
    GET /api/tours/admin/list/ - Admin xem tất cả các tour (kể cả pending)
    """
    permission_classes = [IsAdminRole]
    queryset = Tour.objects.all().order_by('-created_at')
    serializer_class = TourSerializer

class TourStatusUpdateView(APIView):
    """
    PATCH /api/tours/admin/<id>/status/ - Admin duyệt hoặc từ chối tour
    """
    permission_classes = [IsAdminRole]

    def patch(self, request, pk):
        tour = Tour.objects.get(pk=pk)
        new_status = request.data.get('status')
        if new_status not in ['APPROVED', 'REJECTED', 'PENDING']:
            return Response({"error": "Trạng thái không hợp lệ"}, status=status.HTTP_400_BAD_REQUEST)
        
        tour.status = new_status
        tour.save()
        return Response({"message": f"Đã cập nhật trạng thái tour thành {new_status}", "status": tour.status})

class LocationListView(ListAPIView):
    permission_classes = [AllowAny]
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class TourListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = TourSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = TourFilter
    search_fields = ['title', 'location__name'] # Cho phép tìm theo tên tour và tên điểm đến
    
    def get_queryset(self):
        return Tour.objects.filter(status='APPROVED').order_by('-created_at')

class TourDetailView(RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = TourSerializer
    lookup_field = 'pk'
    
    def get_queryset(self):
        return Tour.objects.filter(status='APPROVED')

class TourUpdateView(generics.UpdateAPIView):
    """
    PATCH /api/tours/<id>/update/ - Creator cập nhật thông tin tour
    """
    queryset = Tour.objects.all()
    serializer_class = TourCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Tour.objects.all()
        return Tour.objects.filter(creator=user)

    def perform_update(self, serializer):
        # Trở về trạng thái PENDING để Admin duyệt lại nếu cần
        serializer.save(status='PENDING')
