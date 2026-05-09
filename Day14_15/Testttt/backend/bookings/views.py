from decimal import Decimal
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Sum

from .models import Booking, Payment, Revenue
from .serializers import BookingSerializer, PaymentSerializer, RevenueSerializer


class BookingListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/bookings/       - Danh sách booking của user hiện tại
    POST /api/bookings/       - Tạo booking mới
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Booking.objects.all()
        return Booking.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/bookings/<id>/ - Chi tiết booking
    PATCH  /api/bookings/<id>/ - Cập nhật booking (chỉ admin)
    DELETE /api/bookings/<id>/ - Xoá booking (chỉ admin)
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Booking.objects.all()
        return Booking.objects.filter(user=user)


class BookingCancelView(APIView):
    """
    POST /api/bookings/<id>/cancel/ - Huỷ booking
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        booking = get_object_or_404(Booking, pk=pk)
        if booking.user != request.user and request.user.role != 'ADMIN':
            return Response({'detail': 'Không có quyền huỷ booking này.'}, status=status.HTTP_403_FORBIDDEN)
        if booking.status == 'CANCELLED':
            return Response({'detail': 'Booking đã được huỷ trước đó.'}, status=status.HTTP_400_BAD_REQUEST)
        booking.status = 'CANCELLED'
        booking.save()
        return Response({'detail': 'Huỷ booking thành công.', 'booking_id': booking.booking_id})


class PaymentListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/bookings/payments/       - Danh sách thanh toán
    POST /api/bookings/payments/       - Tạo thanh toán
    """
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Payment.objects.all()
        return Payment.objects.filter(booking__user=user)


class PaymentDetailView(generics.RetrieveAPIView):
    """
    GET /api/bookings/payments/<id>/ - Chi tiết thanh toán
    """
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Payment.objects.all()
        return Payment.objects.filter(booking__user=user)


class PaymentConfirmView(APIView):
    """
    POST /api/bookings/payments/<id>/confirm/ - Giả lập thanh toán thành công
    Tự động tính và lưu doanh thu: Admin 20%, Creator 80%
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        payment = get_object_or_404(Payment, pk=pk)

        if payment.booking.user != request.user and request.user.role != 'ADMIN':
            return Response({'detail': 'Từ chối truy cập.'}, status=status.HTTP_403_FORBIDDEN)

        # Cập nhật trạng thái payment
        payment.status = 'SUCCESS'
        payment.transaction_code = f"MOCK-TXN-{payment.payment_id}-SUCCESS"
        payment.save()

        # Cập nhật trạng thái booking
        booking = payment.booking
        booking.status = 'CONFIRMED'
        booking.save()

        # Tính và lưu doanh thu phân chia (80% Creator / 20% Admin)
        total = payment.amount
        creator_share = (total * Decimal('0.8')).quantize(Decimal('0.01'))
        admin_share = (total * Decimal('0.2')).quantize(Decimal('0.01'))
        creator = booking.tour.creator

        # Kiểm tra nếu đã có Revenue cho payment này (tránh tạo trùng)
        if not Revenue.objects.filter(payment=payment).exists():
            Revenue.objects.create(
                payment=payment,
                booking=booking,
                creator=creator,
                total_amount=total,
                creator_share=creator_share,
                admin_share=admin_share
            )

        return Response({
            'detail': 'Thanh toán (giả lập) thành công!',
            'booking_status': booking.status,
            'payment_status': payment.status,
            'revenue': {
                'total': str(total),
                'creator_share_80pct': str(creator_share),
                'admin_share_20pct': str(admin_share),
                'creator': creator.username,
            }
        })


class AdminRevenueView(APIView):
    """
    GET /api/bookings/revenue/admin/ - Tổng doanh thu admin (20%)
    Chỉ Admin mới được xem
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'ADMIN':
            return Response({'detail': 'Chỉ Admin mới có quyền truy cập.'}, status=status.HTTP_403_FORBIDDEN)

        revenues = Revenue.objects.all().select_related('booking__tour', 'creator')
        serializer = RevenueSerializer(revenues, many=True)

        totals = revenues.aggregate(
            total_revenue=Sum('total_amount'),
            total_admin_share=Sum('admin_share'),
            total_creator_share=Sum('creator_share'),
        )

        return Response({
            'summary': {
                'total_revenue': totals['total_revenue'] or 0,
                'admin_share_20pct': totals['total_admin_share'] or 0,
                'creator_share_80pct': totals['total_creator_share'] or 0,
            },
            'records': serializer.data
        })


class CreatorRevenueView(APIView):
    """
    GET /api/bookings/revenue/creator/ - Doanh thu của creator đang đăng nhập (80%)
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role not in ('CREATOR', 'ADMIN'):
            return Response({'detail': 'Chỉ Creator mới có quyền truy cập.'}, status=status.HTTP_403_FORBIDDEN)

        revenues = Revenue.objects.filter(creator=request.user).select_related('booking__tour')
        serializer = RevenueSerializer(revenues, many=True)

        totals = revenues.aggregate(
            total_revenue=Sum('total_amount'),
            total_creator_share=Sum('creator_share'),
        )

        return Response({
            'summary': {
                'total_revenue': totals['total_revenue'] or 0,
                'creator_share_80pct': totals['total_creator_share'] or 0,
            },
            'records': serializer.data
        })
