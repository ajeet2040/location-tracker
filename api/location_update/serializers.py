from rest_framework import serializers
from location_update.models import StaffLocation


class StaffLocationSerializer(serializers.ModelSerializer):

    class Meta:
        model = StaffLocation
        fields = ['id', 'timestamp', 'location_name', 'email_id', 'geoname_id', 'latitiude', 'longitiude']

