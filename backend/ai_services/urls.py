from django.urls import path
from . import views

urlpatterns = [
    path('generate-workout/', views.generate_workout_api, name='generate_workout'),
    path('generate-meal-plan/', views.generate_meal_plan_api, name='generate_meal_plan'),
    path('chat/', views.ai_coach_chat_api, name='ai_coach_chat'),
    path('chat-history/', views.get_chat_history_api, name='get_chat_history'),
    path('form-advisor/', views.exercise_form_advisor_api, name='form_advisor'),
    path('readiness/', views.readiness_calculator_api, name='readiness_calculator'),
    path('save-workout/', views.save_workout_api, name='save_workout'),
    path('saved-workouts/', views.list_saved_workouts_api, name='list_saved_workouts'),
    path('save-meal-plan/', views.save_meal_plan_api, name='save_meal_plan'),
    path('saved-meal-plans/', views.list_saved_meal_plans_api, name='list_saved_meal_plans'),
]
