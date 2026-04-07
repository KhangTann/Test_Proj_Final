from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    # 1. Hiển thị các cột chính trong danh sách (Dùng booking_id thay cho id)
    list_display = (
        'booking_id', 
        'user', 
        'tour', 
        'number_of_people', 
        'status', 
        'created_at'
    )
    
    # 2. Cho phép click vào ID để xem chi tiết
    list_display_links = ('booking_id',)
    
    # 3. Cho phép sửa nhanh trạng thái đơn hàng ngay tại danh sách (rất tiện)
    list_editable = ('status',)
    
    # 4. Bộ lọc thông minh ở cột bên phải
    list_filter = ('status', 'created_at', 'tour')
    
    # 5. Ô tìm kiếm (hỗ trợ tìm theo email khách, số điện thoại hoặc tên user)
    search_fields = ('contact_email', 'contact_phone', 'user__username', 'tour__title')
    
    # 6. Chỉ cho xem, không cho sửa ngày tạo (vì SQL tự sinh GETDATE())
    readonly_fields = ('created_at',)
    
    # 7. Số lượng bản ghi trên một trang
    list_per_page = 20

    # Tùy chỉnh hiển thị tên trong Admin (Optional)
    def save_model(self, request, obj, form, change):
        # Bạn có thể thêm logic kiểm tra trước khi lưu ở đây nếu cần
        super().save_model(request, obj, form, change)