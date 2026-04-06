from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Khóa chính khớp với SQL
    user_id = models.AutoField(primary_key=True, db_column='user_id')
    
    # Ánh xạ các trường cơ bản
    username = models.CharField(max_length=100, unique=True, db_column='username')
    email = models.EmailField(max_length=150, unique=True, db_column='email')
    password = models.CharField(max_length=255, db_column='password_hash')
    
    # Các trường mở rộng trong SQL của bạn
    role = models.CharField(max_length=20, db_column='role', default='USER')
    is_active = models.BooleanField(default=True, db_column='is_active')
    
    # --- CÁC CỘT HỆ THỐNG CẦN THIẾT CHO DJANGO ADMIN ---
    # Phải khớp với các cột bạn thêm bằng lệnh ALTER TABLE trong SSMS
    last_login = models.DateTimeField(null=True, blank=True, db_column='last_login')
    is_superuser = models.BooleanField(default=False, db_column='is_superuser')
    is_staff = models.BooleanField(default=True, db_column='is_staff') # staff mới vào được admin
    date_joined = models.DateTimeField(auto_now_add=True, db_column='date_joined')
    first_name = models.CharField(max_length=150, blank=True, db_column='first_name')
    last_name = models.CharField(max_length=150, blank=True, db_column='last_name')

    class Meta:
        db_table = 'Users'

    def __str__(self):
        return self.username