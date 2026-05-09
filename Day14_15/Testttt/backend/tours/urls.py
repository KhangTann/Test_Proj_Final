from django.urls import path
from .views import (
    TourListView, TourDetailView, LocationListView, 
    AdminTourListView, TourStatusUpdateView,
    TourCreateView, CreatorTourListView,
    ReviewCreateView, TourUpdateView
)

urlpatterns = [
    path('locations/', LocationListView.as_view(), name='location-list'),
    path('admin/list/', AdminTourListView.as_view(), name='admin-tour-list'),
    path('admin/<int:pk>/status/', TourStatusUpdateView.as_view(), name='admin-tour-status'),
    path('create/', TourCreateView.as_view(), name='tour-create'),
    path('my-tours/', CreatorTourListView.as_view(), name='creator-tour-list'),
    path('<int:pk>/update/', TourUpdateView.as_view(), name='tour-update'),
    path('<int:pk>/reviews/', ReviewCreateView.as_view(), name='review-create'),
    path('', TourListView.as_view(), name='tour-list'),
    path('<int:pk>/', TourDetailView.as_view(), name='tour-detail'),
]
