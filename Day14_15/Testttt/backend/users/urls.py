from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UserRegistrationView, UserProfileView, ForgotPasswordView, ResetPasswordView,
    AdminUserListView, UserToggleActiveView
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserProfileView.as_view(), name='user_profile'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
    path('admin/list/', AdminUserListView.as_view(), name='admin_user_list'),
    path('admin/<int:pk>/toggle-active/', UserToggleActiveView.as_view(), name='admin_user_toggle_active'),
]
