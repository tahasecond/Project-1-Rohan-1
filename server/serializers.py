from rest_framework import serializers
from .models import User

#Serializers turn Models (databases) into JSON format
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('firstname', 'lastname', 'email', 'password')
