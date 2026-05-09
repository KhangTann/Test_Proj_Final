from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum

from users.models import User
from tours.models import Tour
from bookings.models import Booking, Payment, Revenue
from users.permissions import IsAdminRole

class AdminDashboardStatsView(APIView):
    """
    GET /api/admin/stats/ - Lấy thống kê tổng quan cho Dashboard Admin
    """
    permission_classes = [IsAdminRole]

    def get(self, request):
        total_users = User.objects.count()
        total_tours = Tour.objects.count()
        pending_tours = Tour.objects.filter(status='PENDING').count()
        total_bookings = Booking.objects.count()

        # Tổng doanh thu từ các thanh toán thành công
        total_revenue = Payment.objects.filter(status='SUCCESS').aggregate(total=Sum('amount'))['total'] or 0

        # Phân chia doanh thu từ bảng Revenue
        rev_agg = Revenue.objects.aggregate(
            admin_revenue=Sum('admin_share'),
            creator_revenue=Sum('creator_share'),
        )
        admin_revenue = rev_agg['admin_revenue'] or 0
        creator_revenue = rev_agg['creator_revenue'] or 0

        return Response({
            "total_users": total_users,
            "total_tours": total_tours,
            "pending_tours": pending_tours,
            "total_revenue": total_revenue,       # Tổng tất cả giao dịch
            "admin_revenue": admin_revenue,        # 20% phí nền tảng
            "creator_revenue": creator_revenue,    # 80% dành cho Creator
            "total_bookings": total_bookings
        })
