from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    ROLE_CHOICES = (("OWNER", "Owner"),("ADMIN", "Admin"),("ANALYST", "Analyst"),("VIEWER", "Viewer"),)
    
    organization = models.ForeignKey("organizations.Organization",on_delete=models.CASCADE,related_name="users",null=True,blank=True)
    role = models.CharField(max_length=20,choices=ROLE_CHOICES,default="VIEWER")
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.email