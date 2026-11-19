from django.urls import path
from . import views

urlpatterns = [
    path('plans/', views.list_plans, name='list_plans'),
    path('subscribe/', views.subscribe_plan, name='subscribe_plan'),
    path('current/', views.current_subscription, name='current_subscription'),
]
