from django.db import models

from organizations.models import ( Organization )


class Alert(models.Model):

    STATUS_CHOICES = ( ("ACTIVE", "Active"), ("TRIGGERED", "Triggered"), ("RESOLVED", "Resolved"), ("MUTED", "Muted"),)

    organization = ( models.ForeignKey( Organization, on_delete= models.CASCADE, related_name="alerts" ))
    name = (models.CharField( max_length=255 ))
    event_name = (models.CharField(max_length=255))
    threshold = (models.IntegerField())
    time_window = (models.IntegerField(help_text="Minutes"))
    status = (models.CharField(max_length=50,choices=STATUS_CHOICES,default="ACTIVE"))
    email = (models.EmailField(blank=True,null=True))
    created_at = (models.DateTimeField(auto_now_add=True))

    def __str__(self):
        return self.name
    
class AlertHistory(models.Model):

    alert = (models.ForeignKey(Alert,on_delete=models.CASCADE,related_name="history"))
    triggered_value = (models.IntegerField())
    created_at = (models.DateTimeField(auto_now_add=True))

    def __str__(self):
        return (self.alert.name)