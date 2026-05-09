from decimal import Decimal
from django.db import models
from users.models import User
from tours.models import Tour

class Booking(models.Model):
    booking_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, db_column='tour_id')
    number_of_people = models.IntegerField()
    contact_email = models.CharField(max_length=150, null=True, blank=True)
    contact_phone = models.CharField(max_length=20, null=True, blank=True)
    status = models.CharField(max_length=20, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Bookings'
        managed = True

class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, db_column='booking_id')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=50, null=True, blank=True)
    status = models.CharField(max_length=20, default='PENDING')
    transaction_code = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Payments'
        managed = True


class Revenue(models.Model):
    revenue_id    = models.AutoField(primary_key=True)
    payment       = models.ForeignKey(Payment, on_delete=models.CASCADE, db_column='payment_id')
    booking       = models.ForeignKey(Booking, on_delete=models.CASCADE, db_column='booking_id')
    creator       = models.ForeignKey(User, on_delete=models.CASCADE, db_column='creator_id')
    total_amount  = models.DecimalField(max_digits=12, decimal_places=2)
    creator_share = models.DecimalField(max_digits=12, decimal_places=2)  # 80%
    admin_share   = models.DecimalField(max_digits=12, decimal_places=2)  # 20%
    created_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Revenue'
        managed = True
