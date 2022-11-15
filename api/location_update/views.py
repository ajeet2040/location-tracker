from django.shortcuts import render
from rest_framework import generics
from location_update.models import StaffLocation
from location_update.serializers import StaffLocationSerializer


class StaffLocationViewSet(generics.ListCreateAPIView):
    """
    This view set automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = StaffLocation.objects.all()
    serializer_class = StaffLocationSerializer
