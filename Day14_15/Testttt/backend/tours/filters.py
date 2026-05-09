import django_filters
from .models import Tour

class TourFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte')
    location_id = django_filters.NumberFilter(field_name="location_id")
    start_date = django_filters.DateFilter(field_name="start_date", lookup_expr='gte')
    title = django_filters.CharFilter(field_name="title", lookup_expr='icontains')
    people = django_filters.NumberFilter(field_name="max_people", lookup_expr='gte')
    slots = django_filters.NumberFilter(field_name="available_slots", lookup_expr='gte')

    class Meta:
        model = Tour
        fields = ['min_price', 'max_price', 'location_id', 'start_date', 'title', 'people', 'slots']
