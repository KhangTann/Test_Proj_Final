from django.contrib import admin
from .models import Location, Tour, TourImage

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    # Dùng location_id thay cho id
    list_display = ('location_id', 'name', 'address')
    search_fields = ('name', 'address')

@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    # Dùng tour_id thay cho id
    list_display = ('tour_id', 'title', 'price', 'status', 'available_slots', 'start_date')
    list_filter = ('status', 'location') # Bộ lọc bên phải
    search_fields = ('title', 'description')

@admin.register(TourImage)
class TourImageAdmin(admin.ModelAdmin):
    # Dùng image_id thay cho id
    list_display = ('image_id', 'tour', 'image')