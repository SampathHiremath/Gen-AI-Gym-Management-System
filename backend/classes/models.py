from django.db import models
from django.contrib.auth.models import User

class Trainer(models.Model):
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=100, default='Elite Performance Coach')
    bio = models.TextField()
    specialties = models.JSONField(default=list)
    experience_years = models.IntegerField(default=5)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.9)
    reviews_count = models.IntegerField(default=120)
    image_url = models.CharField(max_length=500, default='https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80')
    instagram = models.CharField(max_length=100, blank=True, default='@pulsefit_coach')
    is_featured = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.title}"

class GymClass(models.Model):
    CATEGORY_CHOICES = [
        ('strength', 'Strength & Hypertrophy'),
        ('hiit', 'High Intensity Interval Training (HIIT)'),
        ('yoga', 'Yoga, Mobility & Breathwork'),
        ('boxing', 'Combat & Boxing Conditioning'),
        ('crossfit', 'CrossFit & Functional Fitness'),
        ('cycling', 'Pulse Cycle & Endurance'),
    ]

    INTENSITY_CHOICES = [
        ('Beginner', 'Beginner Friendly'),
        ('Intermediate', 'Moderate / Intermediate'),
        ('High', 'High Intensity'),
        ('Extreme', 'Extreme / Advanced'),
    ]

    title = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='strength')
    trainer = models.ForeignKey(Trainer, on_delete=models.SET_NULL, null=True, related_name='classes')
    description = models.TextField()
    duration_minutes = models.IntegerField(default=50)
    intensity = models.CharField(max_length=30, choices=INTENSITY_CHOICES, default='High')
    calories_burn_est = models.CharField(max_length=50, default='450 - 650 kcal')
    capacity = models.IntegerField(default=20)
    image_url = models.CharField(max_length=500, default='https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80')

    def __str__(self):
        return f"{self.title} ({self.category})"

class ClassSchedule(models.Model):
    DAY_CHOICES = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    ]

    gym_class = models.ForeignKey(GymClass, on_delete=models.CASCADE, related_name='schedules')
    day_of_week = models.CharField(max_length=20, choices=DAY_CHOICES, default='Monday')
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.CharField(max_length=50, default='Main Arena')

    class Meta:
        ordering = ['day_of_week', 'start_time']

    def __str__(self):
        return f"{self.gym_class.title} on {self.day_of_week} at {self.start_time.strftime('%I:%M %p')}"

class ClassBooking(models.Model):
    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('attended', 'Attended'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='class_bookings')
    schedule = models.ForeignKey(ClassSchedule, on_delete=models.CASCADE, related_name='bookings')
    booking_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    booked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'schedule', 'booking_date')

    def __str__(self):
        return f"{self.user.username} - {self.schedule.gym_class.title} ({self.booking_date})"
