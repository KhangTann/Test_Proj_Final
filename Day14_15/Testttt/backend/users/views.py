import random
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserRegistrationSerializer, UserProfileSerializer
from .models import User, OTPRecord
from .permissions import IsAdminRole

class AdminUserListView(ListAPIView):
    """
    GET /api/users/admin/list/ - Admin xem danh sách tất cả user
    """
    permission_classes = [IsAdminRole]
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserProfileSerializer

class UserToggleActiveView(APIView):
    """
    PATCH /api/users/admin/<id>/toggle-active/ - Admin khóa/mở khóa user
    """
    permission_classes = [IsAdminRole]

    def patch(self, request, pk):
        user = User.objects.get(pk=pk)
        if user == request.user:
            return Response({"error": "Bạn không thể tự khóa chính mình"}, status=status.HTTP_400_BAD_REQUEST)
        
        user.is_active = not user.is_active
        user.save()
        status_str = "kích hoạt" if user.is_active else "khóa"
        return Response({"message": f"Đã {status_str} tài khoản {user.username}", "is_active": user.is_active})

class UserRegistrationView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({"message": "Đăng ký thành công!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Vui lòng cung cấp email"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Email không tồn tại trong hệ thống"}, status=status.HTTP_404_NOT_FOUND)
        
        # Generate OTP
        otp_code = str(random.randint(100000, 999999))
        OTPRecord.objects.create(user=user, otp=otp_code)
        
        # In OTP ra console
        print(f"====== OTP FOR {email} ======")
        print(f"OTP CODE: {otp_code}")
        print(f"=============================")
        
        return Response({"message": "Mã OTP đã được tạo (Xem ở Terminal)"})

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')
        
        if not all([email, otp, new_password]):
            return Response({"error": "Vui lòng cung cấp email, OTP và mật khẩu mới"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = User.objects.get(email=email)
            otp_record = OTPRecord.objects.filter(user=user, otp=otp, is_used=False).order_by('-created_at').first()
            
            if not otp_record or not otp_record.is_valid():
                return Response({"error": "Mã OTP không hợp lệ hoặc đã hết hạn"}, status=status.HTTP_400_BAD_REQUEST)
                
            # Đổi mật khẩu
            user.set_password(new_password)
            user.save()
            
            # Đánh dấu OTP đã sử dụng
            otp_record.is_used = True
            otp_record.save()
            
            return Response({"message": "Đặt lại mật khẩu thành công!"})
            
        except User.DoesNotExist:
            return Response({"error": "Email không hợp lệ"}, status=status.HTTP_400_BAD_REQUEST)
