from rest_framework import serializers
from .models import Trainer, GymClass, ClassSchedule, ClassBooking

class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = '__all__'

class GymClassSerializer(serializers.ModelSerializer):
    trainer = TrainerSerializer(read_only=True)

    class Meta:
        model = GymClass
        fields = '__all__'

class ClassScheduleSerializer(serializers.ModelSerializer):
    gym_class = GymClassSerializer(read_only=True)
    available_spots = serializers.SerializerMethodField()

    class Meta:
        model = ClassSchedule
        fields = ['id', 'gym_class', 'day_of_week', 'start_time', 'end_time', 'room', 'available_spots']

    def get_available_spots(self, obj):
        from django.utils import timezone
        today = timezone.now().date()
        bookings_count = obj.bookings.filter(status='confirmed', booking_date=today).count()
        return max(0, obj.gym_class.capacity - bookings_count)

class ClassBookingSerializer(serializers.ModelSerializer):
    schedule = ClassScheduleSerializer(read_only=True)
    schedule_id = serializers.PrimaryKeyRelatedField(
        queryset=ClassSchedule.objects.all(), source='schedule', write_only=True
    )

    class Meta:
        model = ClassBooking
        fields = ['id', 'user', 'schedule', 'schedule_id', 'booking_date', 'status', 'booked_at']
        read_only_fields = ['id', 'user', 'booked_at']
