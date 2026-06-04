from django.urls import path

from rest_framework_simplejwt.views import (TokenRefreshView)

from .views import (RegisterAPIView,LoginAPIView,ProfileAPIView,ChangePasswordAPIView)

urlpatterns = [

    path("register/",RegisterAPIView.as_view(),name="register"),
    path("login/",LoginAPIView.as_view(),name="login"),
    path("refresh/",TokenRefreshView.as_view(),name="refresh"),
    path("profile/",ProfileAPIView.as_view(),name="profile"),
    path("change-password/",ChangePasswordAPIView.as_view(),name="change-password"),
]