from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    GOAL_CHOICES = [
        ('weight_loss', 'Weight Loss & Toning'),
        ('hypertrophy', 'Muscle Building & Hypertrophy'),
        ('strength', 'Maximum Strength & Power'),
        ('endurance', 'Cardio & Stamina'),
        ('mobility', 'Flexibility & Athleticism'),
        ('general', 'General Health & Longevity'),
    ]

    LEVEL_CHOICES = [
        ('beginner', 'Beginner (< 1 year)'),
        ('intermediate', 'Intermediate (1 - 3 years)'),
        ('advanced', 'Advanced (3+ years)'),
        ('athlete', 'Competitive Athlete'),
    ]

    DIET_CHOICES = [
        ('standard', 'Standard Balanced'),
        ('high_protein', 'High Protein Athletic'),
        ('keto', 'Ketogenic (Low Carb)'),
        ('vegetarian', 'Vegetarian'),
        ('vegan', 'Plant-Based Vegan'),
        ('paleo', 'Paleo'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True, default='')
    avatar = models.CharField(max_length=255, blank=True, default='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80')
    fitness_goal = models.CharField(max_length=50, choices=GOAL_CHOICES, default='hypertrophy')
    fitness_level = models.CharField(max_length=50, choices=LEVEL_CHOICES, default='intermediate')
    dietary_preference = models.CharField(max_length=50, choices=DIET_CHOICES, default='high_protein')
    
    age = models.IntegerField(null=True, blank=True, default=26)
    gender = models.CharField(max_length=20, blank=True, default='male')
    height_cm = models.FloatField(null=True, blank=True, default=178)
    weight_kg = models.FloatField(null=True, blank=True, default=76)
    target_weight_kg = models.FloatField(null=True, blank=True, default=80)
    
    injuries_limitations = models.TextField(blank=True, default='')
    gemini_api_key = models.CharField(max_length=255, blank=True, default='')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile for {self.user.username}"

@receiver(post_save, sender=User)
def create_or_save_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    else:
        if hasattr(instance, 'profile'):
            instance.profile.save()
