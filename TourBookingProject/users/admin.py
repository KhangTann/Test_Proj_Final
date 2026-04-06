from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # Hiển thị các cột trong danh sách quản lý
    list_display = ('user_id', 'username', 'email', 'role', 'is_staff', 'is_active')
    list_display_links = ('user_id', 'username')
    
    # Sửa lỗi E012: Chỉ thêm 'role' vào fieldsets. 
    # 'is_active' đã có sẵn trong nhóm 'Permissions' của UserAdmin mặc định.
    fieldsets = UserAdmin.fieldsets + (
        ('Thông tin bổ sung', {'fields': ('role',)}),
    )
    
    # Tương tự cho giao diện thêm người dùng mới
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Thông tin bổ sung', {'fields': ('role',)}),
    )

    ordering = ('-user_id',)