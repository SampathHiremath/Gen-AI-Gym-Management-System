from django.db import models
from django.contrib.auth.models import User

class SavedWorkoutRoutine(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_workouts', null=True, blank=True)
    title = models.CharField(max_length=150)
    goal = models.CharField(max_length=50)
    split_type = models.CharField(max_length=50)
    days_per_week = models.IntegerField(default=4)
    fitness_level = models.CharField(max_length=50, default='intermediate')
    equipment = models.CharField(max_length=100, default='commercial_gym')
    routine_data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.days_per_week} days/wk)"

class SavedMealPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_meal_plans', null=True, blank=True)
    title = models.CharField(max_length=150)
    daily_calories = models.IntegerField()
    diet_type = models.CharField(max_length=50)
    macros = models.JSONField(default=dict)
    meal_plan_data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.daily_calories} kcal)"

class AIChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_chats', null=True, blank=True)
    session_id = models.CharField(max_length=100, db_index=True)
    role = models.CharField(max_length=20)  # 'user' or 'assistant'
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"[{self.role}] {self.content[:30]}..."
