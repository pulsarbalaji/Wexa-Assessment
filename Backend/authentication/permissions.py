from rest_framework.permissions import (BasePermission)

class IsOwner(BasePermission):

    def has_permission(self,request, view ):

        return (request.user.role == "OWNER")


class IsAdminOrOwner(BasePermission):
    def has_permission(self,request,view):

        return request.user.role in ["OWNER","ADMIN"]


class IsAnalystOrAbove(BasePermission):

    def has_permission(self,request, view ):

        return request.user.role in ["OWNER","ADMIN","ANALYST"]