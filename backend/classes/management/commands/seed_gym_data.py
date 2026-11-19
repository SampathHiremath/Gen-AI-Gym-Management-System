from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from memberships.models import MembershipPlan
from classes.models import Trainer, GymClass, ClassSchedule
import datetime

class Command(BaseCommand):
    help = 'Seeds initial gym data including membership plans, trainers, classes, and schedules'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding Pulse AI Gym database...")

        # 1. Seed Membership Plans
        plans_data = [
            {
                'name': 'Bronze Starter',
                'slug': 'bronze-starter',
                'tier': 'starter',
                'tagline': 'Essential gym floor access and cardio arena',
                'description': 'Ideal for beginners seeking uncompromised access to world-class strength and cardio equipment.',
                'price_monthly': 29.99,
                'price_annual': 299.00,
                'is_popular': False,
                'order': 1,
                'features': [
                    'Unlimited standard gym floor & cardio floor access',
                    'Locker room & Finnish dry sauna access',
                    '1 complimentary fitness assessment session',
                    'Pulse Gym Mobile App access'
                ],
                'ai_features': [
                    'Basic AI Workout Routine generation (2/month)'
                ]
            },
            {
                'name': 'Silver Performance',
                'slug': 'silver-performance',
                'tier': 'pro',
                'tagline': 'Our most popular all-inclusive athletic program',
                'description': 'Engineered for dedicated fitness enthusiasts wanting unlimited group classes and advanced Gen AI workouts.',
                'price_monthly': 59.99,
                'price_annual': 599.00,
                'is_popular': True,
                'badge_text': 'MOST POPULAR',
                'order': 2,
                'features': [
                    'All Bronze Starter features included',
                    'Unlimited Group Classes (HIIT, Yoga, Boxing, Spin)',
                    'Cold plunge pool & hydromassage loungers',
                    'Complimentary guest pass (2 per month)'
                ],
                'ai_features': [
                    'Unlimited Gen AI Workout Routine generation',
                    'AI Nutrition & Macro Meal Matrix',
                    '24/7 PulseCoach AI conversational assistant'
                ]
            },
            {
                'name': 'Gold Championship',
                'slug': 'gold-championship',
                'tier': 'elite',
                'tagline': 'High performance conditioning and recovery lounge',
                'description': 'Designed for athletes aiming for maximum physical transformation, private trainer sessions, and cryotherapy.',
                'price_monthly': 99.99,
                'price_annual': 999.00,
                'is_popular': False,
                'order': 3,
                'features': [
                    'All Silver Performance features included',
                    '2 Monthly 1-on-1 Personal Training sessions',
                    'Full Recovery Suite: Cryotherapy chamber & Red light therapy',
                    'Reserved priority booking for high-demand classes',
                    'In-body 570 body composition scans monthly'
                ],
                'ai_features': [
                    'Unlimited AI Workout Routines with auto-periodization',
                    'AI Biomechanical Movement & Form Diagnostics',
                    'Daily AI CNS Strain & Readiness Score Tracker'
                ]
            },
            {
                'name': 'Titan GenAI VIP Pass',
                'slug': 'titan-genai-vip',
                'tier': 'ai_vip',
                'tagline': 'The ultimate synergy of human coaching and cutting-edge Gen AI',
                'description': 'The premier gym membership on the planet. Real-time sensor-guided biomechanics, hyper-personalized AI nutrition, and unlimited recovery.',
                'price_monthly': 149.99,
                'price_annual': 1499.00,
                'is_popular': False,
                'badge_text': 'AI POWERED VIP',
                'order': 4,
                'features': [
                    'All Gold Championship features included',
                    'Weekly 1-on-1 session with Head Master Trainer',
                    'VIP Private Locker & laundry apparel service',
                    'Custom tailored supplement packs delivered monthly',
                    'Full 24/7 biometric sensor analytics'
                ],
                'ai_features': [
                    'Direct Google Gemini 1.5 Pro dedicated instance',
                    'Real-time AI form video cue analysis',
                    'Autonomous weekly progressive overload re-calibration'
                ]
            }
        ]

        for p in plans_data:
            plan, created = MembershipPlan.objects.update_or_create(
                slug=p['slug'],
                defaults=p
            )
            self.stdout.write(f"  Plan: {plan.name} ({'Created' if created else 'Updated'})")

        # 2. Seed Trainers
        trainers_data = [
            {
                'name': 'Marcus "Vanguard" Vance',
                'title': 'Head Strength & Biomechanics Coach',
                'bio': 'Former collegiate powerlifting champion with 12+ years of experience transforming athletes. Marcus specializes in barbell mechanics, progressive overload, and neuromuscular efficiency.',
                'specialties': ['Barbell Powerlifting', 'Hypertrophy Protocols', 'Olympic Weightlifting', 'Injury Rehabilitation'],
                'experience_years': 12,
                'rating': 4.9,
                'reviews_count': 184,
                'image_url': 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80',
                'instagram': '@marcus_vanguard',
                'is_featured': True
            },
            {
                'name': 'Elena Rostova',
                'title': 'Director of High-Intensity Conditioning & HIIT',
                'bio': 'Master instructor certified in exercise physiology and metabolic conditioning. Elena designs cardiac endurance circuits that maximize VO2 max and accelerate calorie burn.',
                'specialties': ['Metabolic HIIT', 'Athletic Conditioning', 'VO2 Max Optimization', 'Kettlebell Flow'],
                'experience_years': 8,
                'rating': 5.0,
                'reviews_count': 230,
                'image_url': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
                'instagram': '@elena_rostova_fit',
                'is_featured': True
            },
            {
                'name': 'Jayden Thorne',
                'title': 'Head Combat & Functional Fitness Specialist',
                'bio': 'Pro amateur kickboxer and CrossFit Level 3 coach. Jayden brings explosive agility, boxing technique, and mental fortitude to every high-energy workout.',
                'specialties': ['Boxing & Kickboxing', 'CrossFit & Functional Fitness', 'Plyometrics', 'Core Stability'],
                'experience_years': 9,
                'rating': 4.9,
                'reviews_count': 156,
                'image_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                'instagram': '@jayden_thorne',
                'is_featured': True
            },
            {
                'name': 'Maya Lin',
                'title': 'Lead Mobility, Yoga & Breathwork Guide',
                'bio': 'Yoga Alliance RYT-500 certified instructor specializing in spinal decompression, athletic recovery, myofascial release, and nervous system regulation.',
                'specialties': ['Vinyasa Power Yoga', 'Myofascial Mobility', 'Breathwork & CNS Reset', 'Postural Restoration'],
                'experience_years': 7,
                'rating': 4.8,
                'reviews_count': 142,
                'image_url': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
                'instagram': '@maya_mobility',
                'is_featured': True
            }
        ]

        created_trainers = {}
        for t in trainers_data:
            trainer, _ = Trainer.objects.update_or_create(
                name=t['name'],
                defaults=t
            )
            created_trainers[trainer.name] = trainer
            self.stdout.write(f"  Trainer: {trainer.name}")

        # 3. Seed Gym Classes
        marcus = created_trainers['Marcus "Vanguard" Vance']
        elena = created_trainers['Elena Rostova']
        jayden = created_trainers['Jayden Thorne']
        maya = created_trainers['Maya Lin']

        classes_data = [
            {
                'title': 'Titan Strength & Barbell Mastery',
                'slug': 'titan-strength-barbell',
                'category': 'strength',
                'trainer': marcus,
                'description': 'Master the big compound lifts (Squat, Bench, Deadlift, Overhead Press) under elite coaching guidance with laser focus on biomechanics and heavy progressive sets.',
                'duration_minutes': 60,
                'intensity': 'High',
                'calories_burn_est': '400 - 550 kcal',
                'capacity': 16,
                'image_url': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
            },
            {
                'title': 'HIIT Hyperdrive 360',
                'slug': 'hiit-hyperdrive-360',
                'category': 'hiit',
                'trainer': elena,
                'description': 'A high-octane metabolic workout combining assault bikes, kettlebells, rowers, and plyometrics designed to burn fat and spike EPOC caloric afterburn for up to 36 hours.',
                'duration_minutes': 45,
                'intensity': 'Extreme',
                'calories_burn_est': '600 - 850 kcal',
                'capacity': 24,
                'image_url': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
            },
            {
                'title': 'Vinyasa Flow & Athletic Recovery',
                'slug': 'vinyasa-flow-recovery',
                'category': 'yoga',
                'trainer': maya,
                'description': 'Dynamic fluid sequence designed specifically for lifting athletes. Unlocks tight hips, decompresses lumbar spine, and enhances joint longevity and mental clarity.',
                'duration_minutes': 50,
                'intensity': 'Beginner',
                'calories_burn_est': '200 - 300 kcal',
                'capacity': 20,
                'image_url': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
            },
            {
                'title': 'Combat Boxing Conditioning',
                'slug': 'combat-boxing-conditioning',
                'category': 'boxing',
                'trainer': jayden,
                'description': 'High-energy authentic heavy bag combinations, slip rope footwork drills, speed ball rounds, and core conditioning in our dedicated fight pit arena.',
                'duration_minutes': 55,
                'intensity': 'High',
                'calories_burn_est': '550 - 750 kcal',
                'capacity': 18,
                'image_url': 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80'
            },
            {
                'title': 'CrossFit MetCon & Barbell Cycling',
                'slug': 'crossfit-metcon-barbell',
                'category': 'crossfit',
                'trainer': jayden,
                'description': 'Functional fitness workouts of the day (WOD). Combines gymnastics, barbell cycling, and cardiovascular threshold tests against the clock.',
                'duration_minutes': 60,
                'intensity': 'Extreme',
                'calories_burn_est': '500 - 800 kcal',
                'capacity': 16,
                'image_url': 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80'
            },
            {
                'title': 'Pulse Cycle: Neon Sprint Arena',
                'slug': 'pulse-cycle-sprint',
                'category': 'cycling',
                'trainer': elena,
                'description': 'Immersive studio cycling synced to pounding bass and reactive neon lighting. Hill climbs, sprint surges, and heart-rate zone intervals.',
                'duration_minutes': 45,
                'intensity': 'High',
                'calories_burn_est': '450 - 700 kcal',
                'capacity': 25,
                'image_url': 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=800&q=80'
            }
        ]

        created_classes = {}
        for c in classes_data:
            gclass, _ = GymClass.objects.update_or_create(
                slug=c['slug'],
                defaults=c
            )
            created_classes[gclass.slug] = gclass
            self.stdout.write(f"  Class: {gclass.title}")

        # 4. Seed Schedules
        schedules_to_create = [
            # Monday
            {'class': 'titan-strength-barbell', 'day': 'Monday', 'start': datetime.time(7, 0), 'end': datetime.time(8, 0), 'room': 'Iron Arena A'},
            {'class': 'hiit-hyperdrive-360', 'day': 'Monday', 'start': datetime.time(9, 30), 'end': datetime.time(10, 15), 'room': 'Pulse Studio 1'},
            {'class': 'vinyasa-flow-recovery', 'day': 'Monday', 'start': datetime.time(18, 0), 'end': datetime.time(18, 50), 'room': 'Zen Sanctuary'},
            # Tuesday
            {'class': 'combat-boxing-conditioning', 'day': 'Tuesday', 'start': datetime.time(7, 30), 'end': datetime.time(8, 25), 'room': 'Combat Pit'},
            {'class': 'pulse-cycle-sprint', 'day': 'Tuesday', 'start': datetime.time(12, 0), 'end': datetime.time(12, 45), 'room': 'Cycle Arena'},
            {'class': 'crossfit-metcon-barbell', 'day': 'Tuesday', 'start': datetime.time(17, 30), 'end': datetime.time(18, 30), 'room': 'Functional Rig'},
            # Wednesday
            {'class': 'titan-strength-barbell', 'day': 'Wednesday', 'start': datetime.time(7, 0), 'end': datetime.time(8, 0), 'room': 'Iron Arena A'},
            {'class': 'hiit-hyperdrive-360', 'day': 'Wednesday', 'start': datetime.time(12, 0), 'end': datetime.time(12, 45), 'room': 'Pulse Studio 1'},
            {'class': 'vinyasa-flow-recovery', 'day': 'Wednesday', 'start': datetime.time(19, 0), 'end': datetime.time(19, 50), 'room': 'Zen Sanctuary'},
            # Thursday
            {'class': 'combat-boxing-conditioning', 'day': 'Thursday', 'start': datetime.time(8, 0), 'end': datetime.time(8, 55), 'room': 'Combat Pit'},
            {'class': 'pulse-cycle-sprint', 'day': 'Thursday', 'start': datetime.time(17, 30), 'end': datetime.time(18, 15), 'room': 'Cycle Arena'},
            # Friday
            {'class': 'titan-strength-barbell', 'day': 'Friday', 'start': datetime.time(7, 0), 'end': datetime.time(8, 0), 'room': 'Iron Arena A'},
            {'class': 'hiit-hyperdrive-360', 'day': 'Friday', 'start': datetime.time(17, 0), 'end': datetime.time(17, 45), 'room': 'Pulse Studio 1'},
            # Saturday
            {'class': 'crossfit-metcon-barbell', 'day': 'Saturday', 'start': datetime.time(9, 0), 'end': datetime.time(10, 0), 'room': 'Functional Rig'},
            {'class': 'vinyasa-flow-recovery', 'day': 'Saturday', 'start': datetime.time(10, 30), 'end': datetime.time(11, 20), 'room': 'Zen Sanctuary'},
            # Sunday
            {'class': 'vinyasa-flow-recovery', 'day': 'Sunday', 'start': datetime.time(10, 0), 'end': datetime.time(10, 50), 'room': 'Zen Sanctuary'},
            {'class': 'pulse-cycle-sprint', 'day': 'Sunday', 'start': datetime.time(11, 15), 'end': datetime.time(12, 0), 'room': 'Cycle Arena'},
        ]

        ClassSchedule.objects.all().delete()
        for s in schedules_to_create:
            gclass = created_classes[s['class']]
            ClassSchedule.objects.create(
                gym_class=gclass,
                day_of_week=s['day'],
                start_time=s['start'],
                end_time=s['end'],
                room=s['room']
            )
        self.stdout.write(f"  Created {len(schedules_to_create)} class schedules across the week.")

        # 5. Create Demo User
        demo_user, u_created = User.objects.get_or_create(
            username='alex_iron',
            defaults={
                'email': 'alex.mercer@pulsefit.ai',
                'first_name': 'Alex',
                'last_name': 'Mercer'
            }
        )
        if u_created:
            demo_user.set_password('demo_pulse_2026')
            demo_user.save()
            profile = demo_user.profile
            profile.fitness_goal = 'hypertrophy'
            profile.fitness_level = 'intermediate'
            profile.age = 28
            profile.gender = 'male'
            profile.height_cm = 182
            profile.weight_kg = 82
            profile.target_weight_kg = 85
            profile.dietary_preference = 'high_protein'
            profile.save()
            self.stdout.write("  Created Demo Member 'alex_iron'")

        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))
