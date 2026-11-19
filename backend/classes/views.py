from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime
from .models import Trainer, GymClass, ClassSchedule, ClassBooking
from .serializers import TrainerSerializer, GymClassSerializer, ClassScheduleSerializer, ClassBookingSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def list_trainers(request):
    trainers = Trainer.objects.all()
    serializer = TrainerSerializer(trainers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def list_classes(request):
    category = request.query_params.get('category')
    classes = GymClass.objects.all()
    if category and category != 'all':
        classes = classes.filter(category=category)
    serializer = GymClassSerializer(classes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def list_schedules(request):
    day = request.query_params.get('day')
    category = request.query_params.get('category')
    schedules = ClassSchedule.objects.select_related('gym_class', 'gym_class__trainer').all()
    
    if day and day != 'all':
        schedules = schedules.filter(day_of_week=day)
    if category and category != 'all':
        schedules = schedules.filter(gym_class__category=category)
        
    serializer = ClassScheduleSerializer(schedules, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def book_class(request):
    user_id = request.data.get('user_id')
    schedule_id = request.data.get('schedule_id')
    date_str = request.data.get('booking_date')

    user = None
    if user_id:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            pass
    if not user:
        user = User.objects.first()

    if not user:
        return Response({'error': 'User not found. Please log in or use Demo Mode.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        schedule = ClassSchedule.objects.get(id=schedule_id)
    except ClassSchedule.DoesNotExist:
        return Response({'error': 'Class schedule not found'}, status=status.HTTP_404_NOT_FOUND)

    booking_date = timezone.now().date()
    if date_str:
        try:
            booking_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            pass

    # Check capacity
    existing_count = ClassBooking.objects.filter(
        schedule=schedule, booking_date=booking_date, status='confirmed'
    ).count()

    if existing_count >= schedule.gym_class.capacity:
        return Response({'error': 'This class session is fully booked!'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if already booked
    existing = ClassBooking.objects.filter(
        user=user, schedule=schedule, booking_date=booking_date
    ).first()

    if existing:
        if existing.status == 'confirmed':
            return Response({'message': 'You have already reserved a spot in this class!'}, status=status.HTTP_200_OK)
        else:
            existing.status = 'confirmed'
            existing.save()
            return Response({'message': 'Spot re-confirmed!', 'booking': ClassBookingSerializer(existing).data})

    booking = ClassBooking.objects.create(
        user=user,
        schedule=schedule,
        booking_date=booking_date,
        status='confirmed'
    )

    return Response({
        'message': f"Spot confirmed for {schedule.gym_class.title} on {schedule.day_of_week}!",
        'booking': ClassBookingSerializer(booking).data
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([AllowAny])
def user_bookings(request):
    user_id = request.query_params.get('user_id')
    user = None
    if user_id:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            pass
    if not user:
        user = User.objects.first()

    if not user:
        return Response([])

    bookings = ClassBooking.objects.filter(user=user, status='confirmed').select_related(
        'schedule', 'schedule__gym_class', 'schedule__gym_class__trainer'
    ).order_by('-booking_date')
    
    serializer = ClassBookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def cancel_booking(request, booking_id):
    try:
        booking = ClassBooking.objects.get(id=booking_id)
        booking.status = 'cancelled'
        booking.save()
        return Response({'message': 'Booking cancelled successfully'})
    except ClassBooking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
