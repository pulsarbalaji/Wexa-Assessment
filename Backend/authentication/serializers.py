from rest_framework import serializers

class RegisterSerializer(serializers.Serializer):

    company_name = serializers.CharField()
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)