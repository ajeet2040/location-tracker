from django.urls import path
from location_update import views


urlpatterns = [
    path('staff_location/', views.StaffLocationViewSet.as_view(), name='staff_location'),
]
