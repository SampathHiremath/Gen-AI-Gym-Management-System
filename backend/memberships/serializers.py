from rest_framework import serializers
from .models import MembershipPlan, UserSubscription

class MembershipPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipPlan
        fields = '__all__'

class UserSubscriptionSerializer(serializers.ModelSerializer):
    plan = MembershipPlanSerializer(read_only=True)
    plan_id = serializers.PrimaryKeyRelatedField(
        queryset=MembershipPlan.objects.all(), source='plan', write_only=True
    )

    class Meta:
        model = UserSubscription
        fields = ['id', 'user', 'plan', 'plan_id', 'billing_cycle', 'status', 'start_date', 'end_date', 'created_at']
        read_only_fields = ['id', 'user', 'start_date', 'created_at']
