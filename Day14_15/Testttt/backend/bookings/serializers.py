from rest_framework import serializers
from .models import Booking, Payment, Revenue
from tours.serializers import TourSerializer

class BookingSerializer(serializers.ModelSerializer):
    tour_detail = TourSerializer(source='tour', read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'
        extra_kwargs = {
            'user': {'read_only': True},
            'status': {'read_only': True}
        }

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class RevenueSerializer(serializers.ModelSerializer):
    creator_username = serializers.CharField(source='creator.username', read_only=True)
    tour_title = serializers.CharField(source='booking.tour.title', read_only=True)
    booking_id = serializers.IntegerField(source='booking.booking_id', read_only=True)

    class Meta:
        model = Revenue
        fields = '__all__'
