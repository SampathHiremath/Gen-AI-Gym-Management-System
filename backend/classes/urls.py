from django.urls import path
from . import views

urlpatterns = [
    path('trainers/', views.list_trainers, name='list_trainers'),
    path('', views.list_classes, name='list_classes'),
    path('schedules/', views.list_schedules, name='list_schedules'),
    path('book/', views.book_class, name='book_class'),
    path('my-bookings/', views.user_bookings, name='user_bookings'),
    path('cancel-booking/<int:booking_id>/', views.cancel_booking, name='cancel_booking'),
]
