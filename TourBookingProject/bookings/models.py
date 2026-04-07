from django.db import models, transaction
from django.conf import settings
from tours.models import Tour

class Booking(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Chờ xử lý'),
        ('CONFIRMED', 'Đã xác nhận'),
        ('CANCELED', 'Đã hủy'),
    ]
    
    # Khai báo khóa chính khớp với SQL
    booking_id = models.AutoField(primary_key=True, db_column='booking_id')
    
    # Ánh xạ user_id và tour_id
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        db_column='user_id'
    )
    tour = models.ForeignKey(
        Tour, 
        on_delete=models.CASCADE, 
        db_column='tour_id'
    )
    
    number_of_people = models.IntegerField(db_column='number_of_people')
    contact_email = models.EmailField(db_column='contact_email')
    contact_phone = models.CharField(max_length=20, db_column='contact_phone')
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='PENDING', 
        db_column='status'
    )
    created_at = models.DateTimeField(auto_now_add=True, db_column='created_at')

    class Meta:
        db_table = 'Bookings'

    def save(self, *args, **kwargs):
        # Lưu ý: Vì trong file SQL của bạn ĐÃ CÓ TRIGGER trg_UpdateSlots_AfterBooking,
        # nên nếu bạn dùng logic python này nữa thì slot sẽ bị trừ 2 LẦN.
        # Khuyên dùng: Hoặc xóa trigger trong SQL, hoặc xóa logic trừ slot trong hàm save() này.
        
        if not self.pk:
            # Logic kiểm tra slot trước khi lưu
            if self.tour.available_slots < self.number_of_people:
                raise ValueError("Không còn đủ chỗ trống cho số người này.")
                
        super().save(*args, **kwargs)