from django.urls import path
from .views import (
    BookingListCreateView,
    BookingDetailView,
    BookingCancelView,
    PaymentListCreateView,
    PaymentDetailView,
    PaymentConfirmView,
    AdminRevenueView,
    CreatorRevenueView,
)

urlpatterns = [
    path('', BookingListCreateView.as_view(), name='booking-list-create'),
    path('<int:pk>/', BookingDetailView.as_view(), name='booking-detail'),
    path('<int:pk>/cancel/', BookingCancelView.as_view(), name='booking-cancel'),
    path('payments/', PaymentListCreateView.as_view(), name='payment-list-create'),
    path('payments/<int:pk>/', PaymentDetailView.as_view(), name='payment-detail'),
    path('payments/<int:pk>/confirm/', PaymentConfirmView.as_view(), name='payment-confirm'),
    path('revenue/admin/', AdminRevenueView.as_view(), name='revenue-admin'),
    path('revenue/creator/', CreatorRevenueView.as_view(), name='revenue-creator'),
]
