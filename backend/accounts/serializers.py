from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'phone', 'avatar', 'fitness_goal', 'fitness_level', 
            'dietary_preference', 'age', 'gender', 'height_cm', 
            'weight_kg', 'target_weight_kg', 'injuries_limitations', 
            'gemini_api_key', 'created_at', 'updated_at'
        ]

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    email = serializers.EmailField(required=True)
    fitness_goal = serializers.CharField(required=False, default='hypertrophy')
    fitness_level = serializers.CharField(required=False, default='intermediate')

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'fitness_goal', 'fitness_level']

    def create(self, validated_data):
        fitness_goal = validated_data.pop('fitness_goal', 'hypertrophy')
        fitness_level = validated_data.pop('fitness_level', 'intermediate')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        # Update auto-created profile
        profile = user.profile
        profile.fitness_goal = fitness_goal
        profile.fitness_level = fitness_level
        profile.save()
        
        return user
