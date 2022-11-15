from django.db import models
from django.db.models import Index


class StaffLocation(models.Model):
    """This model represents the Todo Table"""
    timestamp = models.DateTimeField(auto_now_add=True)
    location_name = models.CharField(max_length=100, blank=False, null=False)
    email_id = models.EmailField(blank=False, null=False)
    geoname_id = models.BigIntegerField(blank=False, null=False)
    latitiude = models.FloatField(blank=False, null=False)
    longitiude = models.FloatField(blank=False, null=False)

    class Meta:
        ordering = ['timestamp']
        Index(fields=['timestamp', 'email_id'])

    def __str__(self):
        return self.email_id + " " + self.location_name

