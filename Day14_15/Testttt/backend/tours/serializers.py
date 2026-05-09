from rest_framework import serializers
from .models import Location, Tour, TourImage, Review

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Review
        fields = ['review_id', 'username', 'rating', 'comment', 'created_at']

class TourImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourImage
        fields = ['image_id', 'image_url']

class TourSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    images = TourImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    
    class Meta:
        model = Tour
        fields = '__all__'

class TourCreateSerializer(serializers.ModelSerializer):
    location_id = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(), source='location', write_only=True
    )
    
    class Meta:
        model = Tour
        fields = ['title', 'description', 'location_id', 'price', 'start_date', 'end_date', 'max_people']
        
    def create(self, validated_data):
        # Mặc định status là PENDING và available_slots = max_people
        validated_data['status'] = 'PENDING'
        validated_data['available_slots'] = validated_data['max_people']
        return super().create(validated_data)
