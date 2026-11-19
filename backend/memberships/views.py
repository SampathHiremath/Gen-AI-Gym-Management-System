from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from datetime import timedelta
from django.utils import timezone
from .models import MembershipPlan, UserSubscription
from .serializers import MembershipPlanSerializer, UserSubscriptionSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def list_plans(request):
    plans = MembershipPlan.objects.all()
    serializer = MembershipPlanSerializer(plans, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def subscribe_plan(request):
    user_id = request.data.get('user_id')
    plan_id = request.data.get('plan_id')
    billing_cycle = request.data.get('billing_cycle', 'monthly')

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
        plan = MembershipPlan.objects.get(id=plan_id)
    except MembershipPlan.DoesNotExist:
        return Response({'error': 'Invalid membership plan selected'}, status=status.HTTP_404_NOT_FOUND)

    # Calculate end date
    days = 365 if billing_cycle == 'annual' else 30
    end_date = timezone.now().date() + timedelta(days=days)

    # Cancel previous active subscriptions if any
    UserSubscription.objects.filter(user=user, status='active').update(status='cancelled')

    sub = UserSubscription.objects.create(
        user=user,
        plan=plan,
        billing_cycle=billing_cycle,
        status='active',
        end_date=end_date
    )

    return Response({
        'message': f'Successfully enrolled in {plan.name}!',
        'subscription': UserSubscriptionSerializer(sub).data
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([AllowAny])
def current_subscription(request):
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
        return Response({'subscription': None})

    active_sub = UserSubscription.objects.filter(user=user, status='active').first()
    if active_sub:
        return Response({'subscription': UserSubscriptionSerializer(active_sub).data})
    return Response({'subscription': None})
