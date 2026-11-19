from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from .serializers import UserSerializer, RegisterSerializer, UserProfileSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user_data = UserSerializer(user).data
        return Response({
            'message': 'Account registered successfully',
            'user': user_data,
            'token': f"session_token_{user.id}"
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data,
            'token': f"session_token_{user.id}"
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def demo_login(request):
    """Provides instant 1-click access to a preloaded demo gym member account."""
    demo_username = 'alex_iron'
    user, created = User.objects.get_or_create(
        username=demo_username,
        defaults={
            'email': 'alex.mercer@pulsefit.ai',
            'first_name': 'Alex',
            'last_name': 'Mercer'
        }
    )
    if created:
        user.set_password('demo_pulse_2026')
        user.save()
        profile = user.profile
        profile.fitness_goal = 'hypertrophy'
        profile.fitness_level = 'intermediate'
        profile.age = 28
        profile.gender = 'male'
        profile.height_cm = 182
        profile.weight_kg = 82
        profile.target_weight_kg = 85
        profile.dietary_preference = 'high_protein'
        profile.avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        profile.save()
    
    return Response({
        'message': 'Logged in as Demo Member',
        'user': UserSerializer(user).data,
        'token': f"session_token_{user.id}"
    })

@api_view(['GET', 'PUT'])
@permission_classes([AllowAny])
def user_profile(request):
    # Support user id from query or fallback to demo/first user
    user_id = request.query_params.get('user_id') or request.data.get('user_id')
    user = None
    if user_id:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            pass
            
    if not user:
        if request.user.is_authenticated:
            user = request.user
        else:
            user = User.objects.first()

    if not user:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(UserSerializer(user).data)
    
    elif request.method == 'PUT':
        profile = user.profile
        user_data = request.data.get('user', {})
        if 'first_name' in user_data:
            user.first_name = user_data['first_name']
        if 'last_name' in user_data:
            user.last_name = user_data['last_name']
        if 'email' in user_data:
            user.email = user_data['email']
        user.save()

        profile_data = request.data.get('profile', request.data)
        serializer = UserProfileSerializer(profile, data=profile_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profile updated successfully',
                'user': UserSerializer(user).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
