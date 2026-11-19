import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import SavedWorkoutRoutine, SavedMealPlan, AIChatMessage
from .gemini_engine import call_gemini
from .expert_knowledge import (
    generate_smart_workout,
    generate_smart_meal_plan,
    generate_smart_chat_response,
    get_exercise_form_guide,
    calculate_readiness_score
)

def get_user_from_request(request):
    user_id = request.data.get('user_id') or request.query_params.get('user_id')
    if user_id:
        try:
            return User.objects.get(id=user_id)
        except (User.DoesNotExist, ValueError):
            pass
    if request.user.is_authenticated:
        return request.user
    return User.objects.first()

@api_view(['POST'])
@permission_classes([AllowAny])
def generate_workout_api(request):
    goal = request.data.get('goal', 'hypertrophy')
    fitness_level = request.data.get('fitness_level', 'intermediate')
    split = request.data.get('split', 'ppl')
    days = int(request.data.get('days_per_week', 4))
    equipment = request.data.get('equipment', 'commercial_gym')
    target_muscles = request.data.get('target_muscles', '')
    limitations = request.data.get('limitations', '')
    user_api_key = request.data.get('api_key') or request.headers.get('X-Gemini-Key')

    # Try Gemini if key is provided
    routine_result = None
    if user_api_key:
        system_prompt = "You are Titan AI, a world-class strength and conditioning coach. Return only valid JSON for a detailed gym workout program matching the schema: {title, goal, fitness_level, split_type, days_per_week, overview, weekly_schedule: [{day_number, title, target_focus, warmup, exercises: [{name, sets, reps, rest, rpe, notes}], cooldown}], coach_rules: []}."
        user_prompt = f"Create a {days}-day/week {split} routine for a {fitness_level} trainee whose goal is {goal}. Equipment: {equipment}. Focus areas: {target_muscles}. Any limitations: {limitations}."
        gemini_data = call_gemini(user_prompt, api_key=user_api_key, system_instruction=system_prompt, response_schema=True)
        if isinstance(gemini_data, dict) and 'weekly_schedule' in gemini_data:
            routine_result = gemini_data

    # If Gemini not provided or fell back
    if not routine_result:
        routine_result = generate_smart_workout(
            goal=goal,
            level=fitness_level,
            split=split,
            days=days,
            equipment=equipment,
            target_muscles=target_muscles,
            limitations=limitations
        )

    return Response({
        'status': 'success',
        'generated_by': 'Gemini 1.5 Flash' if (user_api_key and routine_result.get('generated_by') != 'rules') else 'Titan Athletic AI Engine',
        'routine': routine_result
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def generate_meal_plan_api(request):
    try:
        age = int(request.data.get('age', 26))
        gender = request.data.get('gender', 'male')
        weight_kg = float(request.data.get('weight_kg', 78))
        height_cm = float(request.data.get('height_cm', 178))
        activity = request.data.get('activity', 'moderate')
        goal = request.data.get('goal', 'hypertrophy')
        diet_type = request.data.get('diet_type', 'high_protein')
        meals_count = int(request.data.get('meals_count', 4))
    except (ValueError, TypeError):
        age, gender, weight_kg, height_cm, activity, goal, diet_type, meals_count = 26, 'male', 78, 178, 'moderate', 'hypertrophy', 'high_protein', 4

    user_api_key = request.data.get('api_key') or request.headers.get('X-Gemini-Key')

    plan = generate_smart_meal_plan(
        age=age,
        gender=gender,
        weight_kg=weight_kg,
        height_cm=height_cm,
        activity=activity,
        goal=goal,
        diet_type=diet_type,
        meals_count=meals_count
    )

    return Response({
        'status': 'success',
        'generated_by': 'Gemini 1.5 Flash' if user_api_key else 'Titan Nutritional AI Engine',
        'meal_plan': plan
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def ai_coach_chat_api(request):
    message = request.data.get('message', '').strip()
    session_id = request.data.get('session_id', 'default_guest_session')
    user = get_user_from_request(request)
    user_api_key = request.data.get('api_key') or request.headers.get('X-Gemini-Key')

    if not message:
        return Response({'error': 'Message content cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)

    # Save user message
    AIChatMessage.objects.create(
        user=user,
        session_id=session_id,
        role='user',
        content=message
    )

    reply_text = None
    if user_api_key:
        system_instruction = "You are PulseCoach AI, an elite, motivational, and scientifically precise fitness & nutrition coach at Pulse Gym. Keep answers clear, structured with markdown bullet points, energetic, and practical."
        reply_text = call_gemini(message, api_key=user_api_key, system_instruction=system_instruction)

    if not reply_text:
        reply_text = generate_smart_chat_response(message)

    # Save assistant message
    AIChatMessage.objects.create(
        user=user,
        session_id=session_id,
        role='assistant',
        content=reply_text
    )

    return Response({
        'reply': reply_text,
        'session_id': session_id,
        'source': 'Gemini 1.5 Flash' if (user_api_key and reply_text) else 'PulseCoach AI Agent'
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def get_chat_history_api(request):
    session_id = request.query_params.get('session_id', 'default_guest_session')
    messages = AIChatMessage.objects.filter(session_id=session_id).order_by('timestamp')
    
    data = [
        {
            'id': m.id,
            'role': m.role,
            'content': m.content,
            'timestamp': m.timestamp.isoformat()
        }
        for m in messages
    ]
    return Response(data)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def exercise_form_advisor_api(request):
    exercise = request.query_params.get('exercise') or request.data.get('exercise')
    result = get_exercise_form_guide(exercise)
    return Response(result)

@api_view(['POST'])
@permission_classes([AllowAny])
def readiness_calculator_api(request):
    sleep = float(request.data.get('sleep_hours', 7.5))
    soreness = int(request.data.get('soreness', 2))
    stress = int(request.data.get('stress', 2))
    energy = int(request.data.get('energy', 4))

    score_data = calculate_readiness_score(sleep, soreness, stress, energy)
    return Response(score_data)

@api_view(['POST'])
@permission_classes([AllowAny])
def save_workout_api(request):
    user = get_user_from_request(request)
    routine_data = request.data.get('routine')
    title = request.data.get('title') or (routine_data.get('title') if routine_data else 'My AI Workout Plan')
    goal = request.data.get('goal', 'hypertrophy')
    split = request.data.get('split', 'ppl')
    days = int(request.data.get('days_per_week', 4))

    if not routine_data:
        return Response({'error': 'No workout routine data provided to save'}, status=status.HTTP_400_BAD_REQUEST)

    saved = SavedWorkoutRoutine.objects.create(
        user=user,
        title=title,
        goal=goal,
        split_type=split,
        days_per_week=days,
        routine_data=routine_data
    )

    return Response({
        'message': f"Workout plan '{title}' saved to your profile!",
        'id': saved.id
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([AllowAny])
def list_saved_workouts_api(request):
    user = get_user_from_request(request)
    workouts = SavedWorkoutRoutine.objects.filter(user=user).order_by('-created_at') if user else []
    data = [
        {
            'id': w.id,
            'title': w.title,
            'goal': w.goal,
            'split_type': w.split_type,
            'days_per_week': w.days_per_week,
            'routine_data': w.routine_data,
            'created_at': w.created_at.strftime('%Y-%m-%d %H:%M')
        }
        for w in workouts
    ]
    return Response(data)

@api_view(['POST'])
@permission_classes([AllowAny])
def save_meal_plan_api(request):
    user = get_user_from_request(request)
    plan_data = request.data.get('meal_plan')
    title = request.data.get('title') or (plan_data.get('title') if plan_data else 'My AI Meal Plan')
    calories = int(request.data.get('daily_calories') or (plan_data.get('daily_calories', 2400) if plan_data else 2400))
    diet_type = request.data.get('diet_type', 'high_protein')
    macros = request.data.get('macros', plan_data.get('macros') if plan_data else {})

    if not plan_data:
        return Response({'error': 'No meal plan data provided to save'}, status=status.HTTP_400_BAD_REQUEST)

    saved = SavedMealPlan.objects.create(
        user=user,
        title=title,
        daily_calories=calories,
        diet_type=diet_type,
        macros=macros,
        meal_plan_data=plan_data
    )

    return Response({
        'message': f"Meal plan '{title}' saved to your profile!",
        'id': saved.id
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([AllowAny])
def list_saved_meal_plans_api(request):
    user = get_user_from_request(request)
    plans = SavedMealPlan.objects.filter(user=user).order_by('-created_at') if user else []
    data = [
        {
            'id': p.id,
            'title': p.title,
            'daily_calories': p.daily_calories,
            'diet_type': p.diet_type,
            'macros': p.macros,
            'meal_plan_data': p.meal_plan_data,
            'created_at': p.created_at.strftime('%Y-%m-%d %H:%M')
        }
        for p in plans
    ]
    return Response(data)
