from django.db import models
from django.conf import settings

class Location(models.Model):
    # Khai báo khóa chính khớp với SQL
    location_id = models.AutoField(primary_key=True, db_column='location_id')
    name = models.CharField(max_length=255, db_column='name', null=True, blank=True)
    address = models.CharField(max_length=255, db_column='address', null=True, blank=True)
    latitude = models.FloatField(db_column='latitude', null=True, blank=True)
    longitude = models.FloatField(db_column='longitude', null=True, blank=True)

    class Meta:
        db_table = 'Locations'

    def __str__(self):
        return self.name or f"Location {self.location_id}"

class Tour(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Chờ duyệt'),
        ('APPROVED', 'Đã duyệt'),
        ('REJECTED', 'Từ chối'),
    ]
    # Khai báo khóa chính khớp với SQL
    tour_id = models.AutoField(primary_key=True, db_column='tour_id')
    
    # Ánh xạ creator_id và location_id
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        db_column='creator_id',
        null=True, blank=True
    )
    location = models.ForeignKey(
        Location, 
        on_delete=models.CASCADE, 
        db_column='location_id',
        null=True, blank=True
    )
    
    title = models.CharField(max_length=255, db_column='title')
    description = models.TextField(db_column='description', null=True, blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, db_column='price', null=True, blank=True)
    start_date = models.DateTimeField(db_column='start_date', null=True, blank=True)
    end_date = models.DateTimeField(db_column='end_date', null=True, blank=True)
    max_people = models.IntegerField(db_column='max_people', null=True, blank=True)
    available_slots = models.IntegerField(db_column='available_slots', null=True, blank=True)
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='PENDING', 
        db_column='status'
    )
    created_at = models.DateTimeField(auto_now_add=True, db_column='created_at')

    class Meta:
        db_table = 'Tours'

    def __str__(self):
        return self.title

class TourImage(models.Model):
    image_id = models.AutoField(primary_key=True, db_column='image_id')
    tour = models.ForeignKey(
        Tour, 
        related_name='images', 
        on_delete=models.CASCADE, 
        db_column='tour_id'
    )
    # Lưu ý: SQL của bạn dùng image_url (NVARCHAR), Django dùng ImageField. 
    # Để khớp hoàn toàn, ta dùng db_column='image_url'
    image = models.ImageField(upload_to='tours/', db_column='image_url', max_length=500)

    class Meta:
        db_table = 'TourImages'