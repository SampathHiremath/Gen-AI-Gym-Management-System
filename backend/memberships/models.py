from django.db import models
from django.contrib.auth.models import User

class MembershipPlan(models.Model):
    TIER_CHOICES = [
        ('starter', 'Bronze Starter'),
        ('pro', 'Silver Performance'),
        ('elite', 'Gold Championship'),
        ('ai_vip', 'Titan GenAI VIP Pass'),
    ]

    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    tier = models.CharField(max_length=50, choices=TIER_CHOICES, default='pro')
    tagline = models.CharField(max_length=200, default='Unlock your physical potential')
    description = models.TextField(blank=True, default='')
    price_monthly = models.DecimalField(max_digits=8, decimal_places=2, default=29.99)
    price_annual = models.DecimalField(max_digits=8, decimal_places=2, default=299.99)
    features = models.JSONField(default=list)  # list of feature strings
    ai_features = models.JSONField(default=list)  # list of AI capabilities included
    is_popular = models.BooleanField(default=False)
    badge_text = models.CharField(max_length=50, blank=True, default='')
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'price_monthly']

    def __str__(self):
        return f"{self.name} (${self.price_monthly}/mo)"

class UserSubscription(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
    ]
    BILLING_CHOICES = [
        ('monthly', 'Monthly'),
        ('annual', 'Annual'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(MembershipPlan, on_delete=models.CASCADE, related_name='subscriptions')
    billing_cycle = models.CharField(max_length=20, choices=BILLING_CHOICES, default='monthly')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.plan.name} ({self.status})"
