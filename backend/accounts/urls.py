from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('demo-login/', views.demo_login, name='demo_login'),
    path('profile/', views.user_profile, name='user_profile'),
]
