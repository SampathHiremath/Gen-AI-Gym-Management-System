import math

EXERCISE_DATABASE = {
    "squat": {
        "name": "Barbell Back Squat",
        "category": "Legs / Lower Body Compound",
        "primary_muscles": ["Quadriceps", "Gluteus Maximus"],
        "secondary_muscles": ["Hamstrings", "Core", "Erector Spinae", "Calves"],
        "difficulty": "Intermediate",
        "setup_cues": [
            "Place bar across mid-traps (high bar) or rear delts (low bar). Grip firmly slightly wider than shoulder width.",
            "Unrack with both feet underneath you, take two controlled steps back.",
            "Set feet shoulder-width apart, toes flared slightly out at 15-30 degrees."
        ],
        "execution_cues": [
            "Inhale deeply into your belly, brace your core 360 degrees (Valsalva maneuver).",
            "Break simultaneously at hips and knees, sitting down between your thighs.",
            "Drive knees outward in line with your toes; keep chest proud and spine neutral.",
            "Descend until hip crease is parallel to or slightly below knee joint.",
            "Drive through mid-foot and stand up aggressively, exhaling at the top."
        ],
        "common_mistakes": [
            "Knees caving inward (valgus collapse) - focus on driving knees out over pinky toes.",
            "Heels lifting off the ground - indicates tight ankles or poor weight distribution.",
            "Rounding the lower back ('butt wink') under load at the bottom."
        ],
        "warmup_recommendation": "Perform 2 sets of bodyweight squats, 10 Cossack squats, and 2 ankle mobility wall stretches before ramping weight."
    },
    "deadlift": {
        "name": "Conventional Barbell Deadlift",
        "category": "Posterior Chain / Full Body",
        "primary_muscles": ["Hamstrings", "Glutes", "Erector Spinae"],
        "secondary_muscles": ["Lats", "Forearms / Grip", "Traps", "Quadriceps"],
        "difficulty": "Intermediate / Advanced",
        "setup_cues": [
            "Stand with feet hip-width apart, bar cutting directly over mid-foot (1 inch from shins).",
            "Hinge at the hips and grip the barbell just outside your shins without moving the bar.",
            "Bring shins forward to touch the bar without pushing it away."
        ],
        "execution_cues": [
            "Pull chest tall, pull slack out of the barbell until you hear a click.",
            "Engage lats by thinking of squeezing oranges in your armpits.",
            "Push the floor away through your heels and mid-foot.",
            "Keep bar dragging closely along shins and thighs up to full standing lockout.",
            "Hinge back down with control; do not bounce between reps."
        ],
        "common_mistakes": [
            "Bar starting too far in front of shins, placing unnecessary torque on lower back.",
            "Hyperextending the lumbar spine at lockout instead of squeezing glutes.",
            "Rounding the upper or lower back when breaking weight off the floor."
        ],
        "warmup_recommendation": "Single-leg glute bridges, bird-dogs, and 2 sets of light Romanian Deadlifts."
    },
    "bench_press": {
        "name": "Barbell Flat Bench Press",
        "category": "Upper Body Horizontal Push",
        "primary_muscles": ["Pectoralis Major", "Anterior Deltoids"],
        "secondary_muscles": ["Triceps Brachii", "Serratus Anterior"],
        "difficulty": "Intermediate",
        "setup_cues": [
            "Lie on bench with eyes directly underneath the racked bar.",
            "Plant feet firmly into the floor under your knees or slightly tucked back.",
            "Retract and depress shoulder blades into the bench to form a stable base."
        ],
        "execution_cues": [
            "Grip the bar slightly wider than shoulder width with thumbs wrapped securely.",
            "Unrack and hold bar over chest with locked elbows.",
            "Lower bar with control toward lower-mid sternum at a 45 to 60-degree elbow tuck.",
            "Briefly touch chest without bouncing, then drive barbell upward and slightly backward toward your eyes."
        ],
        "common_mistakes": [
            "Flaring elbows out at 90 degrees, which irritates the shoulder rotator cuffs.",
            "Lifting glutes or hips off the bench during heavy presses.",
            "Bouncing the barbell off the ribcage."
        ],
        "warmup_recommendation": "Band pull-aparts, light rotator cuff external rotations, and empty bar tempo presses."
    },
    "overhead_press": {
        "name": "Standing Overhead Press (OHP)",
        "category": "Upper Body Vertical Push",
        "primary_muscles": ["Anterior and Lateral Deltoids"],
        "secondary_muscles": ["Triceps", "Upper Chest", "Core & Glutes (stabilizers)"],
        "difficulty": "Intermediate",
        "setup_cues": [
            "Set bar at collarbone height. Grip just outside shoulder width with vertical forearms.",
            "Rest bar across clavicles and front delts, elbows slightly in front of bar."
        ],
        "execution_cues": [
            "Squeeze glutes and abs tightly to eliminate lower back arching.",
            "Tilt head slightly back to clear bar path, then press straight vertically.",
            "Once bar passes forehead, push head forward ('through the window') and lock out overhead.",
            "Shrug traps gently upward at peak lockout for shoulder subacromial clearance."
        ],
        "common_mistakes": [
            "Leaning back excessively to turn it into an incline bench press.",
            "Flaring elbows wide on the unrack instead of maintaining forward forearm angle."
        ],
        "warmup_recommendation": "Halos with light plate, push-ups, and band overhead dislocates."
    },
    "pull_up": {
        "name": "Strict Pull-Up",
        "category": "Upper Body Vertical Pull",
        "primary_muscles": ["Latissimus Dorsi", "Teres Major"],
        "secondary_muscles": ["Biceps Brachii", "Rhomboids", "Mid/Lower Traps", "Brachialis"],
        "difficulty": "Intermediate",
        "setup_cues": [
            "Grip bar with overhand (pronated) grip slightly wider than shoulder width.",
            "Hang with full arm extension in a dead hang."
        ],
        "execution_cues": [
            "Depress shoulder blades down away from ears ('active hang').",
            "Drive elbows down and back toward your hip pockets.",
            "Pull until chin clears the bar cleanly with chest pointing toward the bar.",
            "Lower with controlled 2-second eccentric tempo back to active hang."
        ],
        "common_mistakes": [
            "Kipping or swinging legs to generate momentum.",
            "Not completing full range of motion (half reps at bottom or top)."
        ],
        "warmup_recommendation": "Scapular pull-ups, dead hangs for 30 seconds, and lat stretch on upright pole."
    },
    "barbell_row": {
        "name": "Bent-Over Barbell Row",
        "category": "Upper Body Horizontal Pull",
        "primary_muscles": ["Rhomboids", "Middle Trapezius", "Latissimus Dorsi"],
        "secondary_muscles": ["Biceps", "Posterior Deltoids", "Erector Spinae"],
        "difficulty": "Intermediate",
        "setup_cues": [
            "Stand with barbell over mid-foot, hinge hips back until torso is at 45 to 60 degrees.",
            "Keep slight bend in knees, spine completely flat, neck in neutral alignment."
        ],
        "execution_cues": [
            "Grip bar overhand or underhand just outside knees.",
            "Pull bar towards lower ribcage/belly button by driving elbows up and back.",
            "Squeeze shoulder blades together at the top for 1 second, then lower under control."
        ],
        "common_mistakes": [
            "Using momentum or jerking torso upright to heave the weight up.",
            "Rounding lower back due to lack of hamstring flexibility or excessive load."
        ],
        "warmup_recommendation": "Cat-cows, bird-dogs, and light dumbbell chest-supported rows."
    }
}

def get_exercise_form_guide(exercise_key=None):
    if exercise_key and exercise_key.lower() in EXERCISE_DATABASE:
        return EXERCISE_DATABASE[exercise_key.lower()]
    # Return list of all available guides
    return list(EXERCISE_DATABASE.values())

def generate_smart_workout(goal='hypertrophy', level='intermediate', split='ppl', days=4, equipment='commercial_gym', target_muscles=None, limitations=None):
    """
    Expert sports science algorithmic workout builder.
    """
    goal_titles = {
        'hypertrophy': 'Maximum Muscle Hypertrophy & Density',
        'strength': 'Raw Strength & Power Development',
        'weight_loss': 'Metabolic Conditioning & Fat Shred',
        'endurance': 'High-Stamina Aerobic & Muscular Endurance',
        'general': 'Functional Longevity & Athletic Fitness'
    }

    rep_schemes = {
        'strength': {'sets': 4, 'reps': '4 - 6', 'rest': '120 - 180s', 'rpe': 8.5},
        'hypertrophy': {'sets': 3, 'reps': '8 - 12', 'rest': '60 - 90s', 'rpe': 8.0},
        'weight_loss': {'sets': 3, 'reps': '12 - 15', 'rest': '45 - 60s', 'rpe': 7.5},
        'endurance': {'sets': 3, 'reps': '15 - 20', 'rest': '30 - 45s', 'rpe': 7.0},
        'general': {'sets': 3, 'reps': '10 - 12', 'rest': '60s', 'rpe': 7.5}
    }
    
    scheme = rep_schemes.get(goal, rep_schemes['hypertrophy'])

    # Determine days routine layout based on split and days count
    days_data = []

    if days == 3 or split == 'full_body':
        days_data = [
            {
                "day_number": 1,
                "title": "Full Body Alpha (Squat & Press Focus)",
                "target_focus": "Quads, Chest, Upper Back, Core",
                "warmup": "5 mins row machine, world's greatest stretch, 20 glute bridges, shoulder dislocates",
                "exercises": [
                    {"name": "Barbell Back Squat", "sets": scheme['sets'], "reps": scheme['reps'], "rest": scheme['rest'], "rpe": scheme['rpe'], "notes": "Drive through mid-foot; hit parallel depth."},
                    {"name": "Barbell Flat Bench Press", "sets": scheme['sets'], "reps": scheme['reps'], "rest": scheme['rest'], "rpe": scheme['rpe'], "notes": "Retract scapulae; tuck elbows 45 deg."},
                    {"name": "Chest Supported T-Bar Row", "sets": 3, "reps": "10-12", "rest": "60s", "rpe": 8, "notes": "Squeeze lats at contraction."},
                    {"name": "Dumbbell Romanian Deadlift", "sets": 3, "reps": "10-12", "rest": "60s", "rpe": 7.5, "notes": "Hinge hips back feeling hamstring stretch."},
                    {"name": "Hanging Leg Raises", "sets": 3, "reps": "12-15", "rest": "45s", "rpe": 8, "notes": "Control the swing; flex lower abs."}
                ],
                "cooldown": "5 mins slow bike, quad stretch, pigeon pose."
            },
            {
                "day_number": 2,
                "title": "Full Body Beta (Hinge & Pull Focus)",
                "target_focus": "Hamstrings, Glutes, Lats, Shoulders",
                "warmup": "5 mins incline treadmill, inchworms, band pull-aparts, hip openers",
                "exercises": [
                    {"name": "Conventional Barbell Deadlift", "sets": scheme['sets'], "reps": scheme['reps'], "rest": "120s", "rpe": scheme['rpe'], "notes": "Brace core; drag bar along shins."},
                    {"name": "Standing Overhead Press", "sets": scheme['sets'], "reps": scheme['reps'], "rest": scheme['rest'], "rpe": scheme['rpe'], "notes": "Glutes clenched; push head through at lockout."},
                    {"name": "Lat Pulldown (Neutral Grip)", "sets": 3, "reps": "10-12", "rest": "60s", "rpe": 8, "notes": "Lead with elbows; avoid excessive torso lean."},
                    {"name": "Bulgarian Split Squats", "sets": 3, "reps": "8-10 / leg", "rest": "75s", "rpe": 8, "notes": "Drop rear knee straight down."},
                    {"name": "Cable Triceps Rope Pushdown", "sets": 3, "reps": "12-15", "rest": "45s", "rpe": 8.5, "notes": "Spread rope at bottom for peak triceps head contraction."}
                ],
                "cooldown": "5 mins static stretching, cobra pose, hamstring flossing."
            },
            {
                "day_number": 3,
                "title": "Full Body Gamma (Hypertrophy & Pump)",
                "target_focus": "Total Body Symmetry & Arms",
                "warmup": "5 mins jump rope, cat-cow, thoracic rotations, ankle rocks",
                "exercises": [
                    {"name": "Leg Press (Foot Placed High)", "sets": 3, "reps": "12-15", "rest": "60s", "rpe": 8, "notes": "Deep range of motion without lower back rounding."},
                    {"name": "Incline Dumbbell Bench Press", "sets": 3, "reps": "8-10", "rest": "75s", "rpe": 8, "notes": "30 degree incline for clavicular upper chest emphasis."},
                    {"name": "Seated Cable Row", "sets": 3, "reps": "10-12", "rest": "60s", "rpe": 8, "notes": "Pause 1 sec with elbows behind torso."},
                    {"name": "Dumbbell Lateral Raises", "sets": 4, "reps": "12-15", "rest": "45s", "rpe": 9, "notes": "Slight forward torso lean; pour the water motion."},
                    {"name": "Incline Dumbbell Biceps Curls", "sets": 3, "reps": "10-12", "rest": "45s", "rpe": 8.5, "notes": "Full stretch at bottom of each rep."}
                ],
                "cooldown": "Couch stretch, child's pose, foam rolling calves and quads."
            }
        ]
    elif days == 4 or split in ['upper_lower', 'upper-lower']:
        days_data = [
            {
                "day_number": 1,
                "title": "Upper Body Power & Hypertrophy",
                "target_focus": "Chest, Back, Delts, Arms",
                "warmup": "Band dislocates, face pulls, pushups, dynamic arm swings",
                "exercises": [
                    {"name": "Barbell Bench Press", "sets": scheme['sets'], "reps": scheme['reps'], "rest": scheme['rest'], "rpe": scheme['rpe'], "notes": "Arch slightly; plant heels into turf."},
                    {"name": "Bent-Over Barbell Row", "sets": scheme['sets'], "reps": scheme['reps'], "rest": scheme['rest'], "rpe": scheme['rpe'], "notes": "Pull to lower sternum; lock spine angle."},
                    {"name": "Dumbbell Incline Press", "sets": 3, "reps": "8-10", "rest": "60s", "rpe": 8, "notes": "Controlled 3-second descent."},
                    {"name": "Weighted / Bodyweight Pull-ups", "sets": 3, "reps": "6-10", "rest": "75s", "rpe": 8, "notes": "Full extension to chin over bar."},
                    {"name": "Overhead Cable Triceps Extensions", "sets": 3, "reps": "12-15", "rest": "45s", "rpe": 8.5, "notes": "Stretch the long head of the triceps."},
                    {"name": "Incline Hammer Curls", "sets": 3, "reps": "10-12", "rest": "45s", "rpe": 8.5, "notes": "Builds brachialis and forearm thickness."}
                ],
                "cooldown": "Doorway pectoral stretch, lat hanging stretch, foam rolling lats."
            },
            {
                "day_number": 2,
                "title": "Lower Body Quad & Core Dominance",
                "target_focus": "Quadriceps, Glutes, Calves, Abs",
                "warmup": "Leg swings, bodyweight deep squats, glute bridge marches, ankle pulses",
                "exercises": [
                    {"name": "Barbell Back Squat", "sets": scheme['sets'], "reps": scheme['reps'], "rest": scheme['rest'], "rpe": scheme['rpe'], "notes": "Explode out of the hole with torso upright."},
                    {"name": "Walking Dumbbell Lunges", "sets": 3, "reps": "10 steps / leg", "rest": "60s", "rpe": 8, "notes": "Keep stride length balanced."},
                    {"name": "Leg Extension", "sets": 3, "reps": "12-15", "rest": "45s", "rpe": 9, "notes": "Hold 1 second contraction at lockout."},
                    {"name": "Standing Calf Raises", "sets": 4, "reps": "15-20", "rest": "45s", "rpe": 8.5, "notes": "Full heel drop beneath step platform."},
                    {"name": "Cable Woodchoppers", "sets": 3, "reps": "12 / side", "rest": "45s", "rpe": 7.5, "notes": "Rotate through thoracic spine and hips."}
                ],
                "cooldown": "Quad foam roll, butterfly groin stretch, downward dog."
            },
            {
                "day_number": 3,
                "title": "Upper Body Density & Accessories",
                "target_focus": "Lats, Upper Chest, Rear Delts, Arms",
                "warmup": "Rowing machine, band pull-aparts, arm circles, prone Y-T-W drills",
                "exercises": [
                    {"name": "Standing Overhead Press", "sets": scheme['sets'], "reps": scheme['reps'], "rest": scheme['rest'], "rpe": scheme['rpe'], "notes": "Tight glutes; vertical bar path."},
                    {"name": "Close-Grip Lat Pulldown", "sets": 3, "reps": "10-12", "rest": "60s", "rpe": 8, "notes": "Drive elbows straight down to ribcage."},
                    {"name": "Flat Dumbbell Flyes / Cable Crossover", "sets": 3, "reps": "12-15", "rest": "45s", "rpe": 8, "notes": "Maintain slight bend in elbows; feel deep chest stretch."},
                    {"name": "Cable Face Pulls", "sets": 4, "reps": "15-20", "rest": "45s", "rpe": 8, "notes": "Pull rope toward eyes with external shoulder rotation."},
                    {"name": "EZ Bar Biceps Curls", "sets": 3, "reps": "10-12", "rest": "45s", "rpe": 8, "notes": "Keep elbows glued to sides."},
                    {"name": "Dips (Bodyweight or Weighted)", "sets": 3, "reps": "8-12", "rest": "60s", "rpe": 8, "notes": "Slight forward lean for chest and triceps loading."}
                ],
                "cooldown": "Shoulder cross-body stretch, wrist flexor stretch, child's pose."
            },
            {
                "day_number": 4,
                "title": "Lower Body Posterior Chain & Power",
                "target_focus": "Hamstrings, Glutes, Lower Back",
                "warmup": "Inchworms, glute activation bands, Cossack squats",
                "exercises": [
                    {"name": "Barbell Romanian Deadlift", "sets": scheme['sets'], "reps": scheme['reps'], "rest": scheme['rest'], "rpe": scheme['rpe'], "notes": "Hips back, soft knees, stop when hamstrings reach full stretch."},
                    {"name": "Barbell Hip Thrust", "sets": 3, "reps": "10-12", "rest": "75s", "rpe": 8.5, "notes": "Tuck chin; pause 2 seconds at top lockout."},
                    {"name": "Lying Hamstring Leg Curls", "sets": 3, "reps": "12-15", "rest": "45s", "rpe": 9, "notes": "Control the descent, do not jerk hips off bench."},
                    {"name": "Seated Calf Raises", "sets": 3, "reps": "15-20", "rest": "45s", "rpe": 8.5, "notes": "Emphasizes the soleus muscle."},
                    {"name": "Ab Wheel Rollouts", "sets": 3, "reps": "8-12", "rest": "45s", "rpe": 8, "notes": "Prevent lower back from sagging."}
                ],
                "cooldown": "Hamstring towel stretch, figure four glute stretch, cat-cow."
            }
        ]
    else:
        # PPL or 5-day / 6-day Routine
        days_data = [
            {
                "day_number": 1,
                "title": "Push Day: Chest, Shoulders & Triceps",
                "target_focus": "Pectorals, Anterior Delts, Lateral Delts, Triceps",
                "warmup": "Band dislocates, light pushups, rotator cuff warmup",
                "exercises": [
                    {"name": "Barbell Flat Bench Press", "sets": scheme['sets'], "reps": scheme['reps'], "rest": scheme['rest'], "rpe": scheme['rpe'], "notes": "Pillars of upper body pressing power."},
                    {"name": "Incline Dumbbell Press", "sets": 3, "reps": "8-10", "rest": "75s", "rpe": 8, "notes": "Upper pec shelf builder."},
                    {"name": "Standing Dumbbell Lateral Raises", "sets": 4, "reps": "12-15", "rest": "45s", "rpe": 8.5, "notes": "V-taper shoulder width."},
                    {"name": "Cable High-to-Low Flyes", "sets": 3, "reps": "12-15", "rest": "45s", "rpe": 8, "notes": "Constant tension on lower chest fibers."},
                    {"name": "Skull Crushers (EZ Bar)", "sets": 3, "reps": "10-12", "rest": "60s", "rpe": 8, "notes": "Lower toward crown of head."},
                    {"name": "Rope Cable Triceps Pushdown", "sets": 3, "reps": "12-15", "rest": "45s", "rpe": 8.5, "notes": "Burnout set on last round."}
                ],
                "cooldown": "Chest doorway stretch, triceps overhead pull, shoulder rolls."
            },
            {
                "day_number": 2,
                "title": "Pull Day: Back, Rear Delts & Biceps",
                "target_focus": "Lats, Rhomboids, Traps, Biceps, Brachialis",
                "warmup": "Lat stretches, scapular pull-ups, band pull-aparts",
                "exercises": [
                    {"name": "Barbell Bent-Over Row", "sets": scheme['sets'], "reps": scheme['reps'], "rest": scheme['rest'], "rpe": scheme['rpe'], "notes": "Thickness across mid-back."},
                    {"name": "Wide-Grip Lat Pulldown", "sets": 3, "reps": "8-12", "rest": "60s", "rpe": 8, "notes": "Pull to collarbone, flare lats."},
                    {"name": "Single-Arm Dumbbell Row", "sets": 3, "reps": "10 / arm", "rest": "60s", "rpe": 8, "notes": "Stretch at bottom, pull to hip."},
                    {"name": "Face Pulls with External Rotation", "sets": 4, "reps": "15-20", "rest": "45s", "rpe": 8, "notes": "Shoulder bulletproofing."},
                    {"name": "Barbell Biceps Curl", "sets": 3, "reps": "10-12", "rest": "45s", "rpe": 8, "notes": "Strict form without hip swing."},
                    {"name": "Dumbbell Hammer Curls", "sets": 3, "reps": "10-12", "rest": "45s", "rpe": 8.5, "notes": "Brachialis and forearm development."}
                ],
                "cooldown": "Lat hanging stretch, child's pose, bicep wall stretch."
            },
            {
                "day_number": 3,
                "title": "Legs Day: Quads, Hamstrings & Calves",
                "target_focus": "Quadriceps, Hamstrings, Glutes, Calves, Core",
                "warmup": "Leg swings, bodyweight squats, deep lunges, glute bridges",
                "exercises": [
                    {"name": "Barbell Back Squat", "sets": scheme['sets'], "reps": scheme['reps'], "rest": scheme['rest'], "rpe": scheme['rpe'], "notes": "Deep squat depth; brace core."},
                    {"name": "Romanian Deadlift (Dumbbell or Barbell)", "sets": 3, "reps": "8-10", "rest": "75s", "rpe": 8, "notes": "Hinge hips backward."},
                    {"name": "Leg Press", "sets": 3, "reps": "10-12", "rest": "60s", "rpe": 8, "notes": "Continuous tension, no lockouts."},
                    {"name": "Lying Leg Curls", "sets": 3, "reps": "12-15", "rest": "45s", "rpe": 8.5, "notes": "Isolate knee flexion."},
                    {"name": "Standing Calf Raises", "sets": 4, "reps": "15-20", "rest": "45s", "rpe": 8.5, "notes": "Pause at top and bottom."},
                    {"name": "Hanging Knee/Leg Raises", "sets": 3, "reps": "15", "rest": "45s", "rpe": 8, "notes": "Pelvis tucked upward."}
                ],
                "cooldown": "Pigeon pose, couch stretch for quads, calf wall stretch."
            }
        ]

    # Return structured AI routine object
    return {
        "title": f"Titan {goal_titles.get(goal, 'Elite')} {days}-Day Protocol",
        "goal": goal,
        "fitness_level": level,
        "split_type": split,
        "days_per_week": days,
        "equipment": equipment,
        "overview": f"A science-backed periodized program engineered for {level} athletes targeting {goal}. Focuses on progressive overload, optimal neuromuscular recruitment, and structured recovery intervals.",
        "weekly_schedule": days_data,
        "coach_rules": [
            "Apply progressive overload: Add 1 rep or 1-2.5kg each week once you hit the top of your rep bracket.",
            "Maintain strict RPE (Rate of Perceived Exertion) - always leave 1 to 2 reps in reserve on working sets.",
            "Hydrate with 500ml water and electrolytes 30 mins before training.",
            "Prioritize 7-8 hours of quality sleep for muscular repair and central nervous system recovery."
        ]
    }

def generate_smart_meal_plan(age=27, gender='male', weight_kg=78, height_cm=180, activity='moderate', goal='hypertrophy', diet_type='high_protein', meals_count=4):
    """
    Expert nutritionist calorie and macro calculation using Mifflin-St Jeor formula.
    """
    # Mifflin-St Jeor BMR
    if gender.lower() == 'female':
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
    else:
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5

    activity_multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'very_active': 1.725,
        'athlete': 1.9
    }
    multiplier = activity_multipliers.get(activity, 1.55)
    tdee = int(bmr * multiplier)

    # Goal adjustment
    if goal == 'weight_loss':
        target_calories = tdee - 450
        protein_g = int(weight_kg * 2.2)  # Higher protein to spare lean mass
        fat_g = int(weight_kg * 0.8)
    elif goal == 'hypertrophy' or goal == 'strength':
        target_calories = tdee + 350
        protein_g = int(weight_kg * 2.0)
        fat_g = int(weight_kg * 0.9)
    else:
        target_calories = tdee
        protein_g = int(weight_kg * 1.8)
        fat_g = int(weight_kg * 0.85)

    # Calculate carbs from remaining calories
    protein_cals = protein_g * 4
    fat_cals = fat_g * 9
    carbs_cals = max(0, target_calories - (protein_cals + fat_cals))
    carbs_g = int(carbs_cals / 4)

    # Adjust for keto if requested
    if diet_type == 'keto':
        carbs_g = 35
        carbs_cals = carbs_g * 4
        fat_cals = target_calories - (protein_cals + carbs_cals)
        fat_g = int(fat_cals / 9)

    # Meal templates based on diet type
    if diet_type == 'vegan':
        sample_meals = [
            {
                "meal_name": "Power Plant Protein Oats",
                "timing": "Breakfast (8:00 AM)",
                "calories": int(target_calories * 0.25),
                "protein": int(protein_g * 0.25),
                "carbs": int(carbs_g * 0.3),
                "fat": int(fat_g * 0.2),
                "foods": ["Rolled oats (80g)", "Plant-based pea/hemp protein powder (30g)", "Chia seeds (15g)", "Almond milk (250ml)", "Blueberries (50g)"],
                "recipe_tip": "Simmer oats in almond milk, remove from heat, whisk in protein powder and top with chia and berries."
            },
            {
                "meal_name": "Crispy Tofu & Quinoa Buddha Bowl",
                "timing": "Lunch (12:30 PM)",
                "calories": int(target_calories * 0.32),
                "protein": int(protein_g * 0.30),
                "carbs": int(carbs_g * 0.35),
                "fat": int(fat_g * 0.3),
                "foods": ["Firm organic tofu (200g, air fried)", "Cooked tricolor quinoa (150g)", "Steamed broccoli & edamame (100g)", "Tahini-lemon dressing (20g)"],
                "recipe_tip": "Press tofu, toss with nutritional yeast and soy sauce, air fry at 200°C for 14 minutes until golden."
            },
            {
                "meal_name": "Pre-Workout Fuel & Energy Shake",
                "timing": "Snack (4:00 PM)",
                "calories": int(target_calories * 0.15),
                "protein": int(protein_g * 0.15),
                "carbs": int(carbs_g * 0.20),
                "fat": int(fat_g * 0.15),
                "foods": ["Rice cakes (2 cakes) with almond butter (20g)", "Banana (1 medium)", "Cup of green tea"],
                "recipe_tip": "Consume 60 minutes before heavy lifting for sustained glycogen and nitric oxide pumps."
            },
            {
                "meal_name": "Tempeh & Lentil High-Protein Stew",
                "timing": "Dinner (7:30 PM)",
                "calories": int(target_calories * 0.28),
                "protein": int(protein_g * 0.30),
                "carbs": int(carbs_g * 0.15),
                "fat": int(fat_g * 0.35),
                "foods": ["Smoked tempeh cubes (150g)", "Brown lentils (100g cooked)", "Spinach & diced tomatoes", "Avocado slices (50g)"],
                "recipe_tip": "Slow-simmer lentils with garlic, cumin, and fire-roasted tomatoes. Fold in fresh spinach right before serving."
            }
        ]
    elif diet_type == 'keto':
        sample_meals = [
            {
                "meal_name": "Keto Bacon, Avocado & Spinach Omelet",
                "timing": "Breakfast (8:00 AM)",
                "calories": int(target_calories * 0.28),
                "protein": int(protein_g * 0.25),
                "carbs": 5,
                "fat": int(fat_g * 0.32),
                "foods": ["Pasture-raised eggs (3 large)", "Avocado (half)", "Streaky bacon (2 slices)", "Baby spinach (handful)", "Cheddar cheese (30g)"],
                "recipe_tip": "Whisk eggs with a splash of heavy cream. Cook in grass-fed butter over low heat."
            },
            {
                "meal_name": "Grilled Wild Salmon & Asparagus with Hollandaise",
                "timing": "Lunch (1:00 PM)",
                "calories": int(target_calories * 0.35),
                "protein": int(protein_g * 0.35),
                "carbs": 8,
                "fat": int(fat_g * 0.35),
                "foods": ["Wild Alaskan Salmon fillet (200g)", "Grilled asparagus spears (150g)", "Extra virgin olive oil / herb butter (25g)", "Kalamata olives (30g)"],
                "recipe_tip": "Pan-sear salmon skin-down for 5 mins until crisp, flip for 2 mins. Drizzle with garlic-herb butter."
            },
            {
                "meal_name": "Macadamia & Whey Keto Fuel",
                "timing": "Snack (4:30 PM)",
                "calories": int(target_calories * 0.12),
                "protein": int(protein_g * 0.15),
                "carbs": 4,
                "fat": int(fat_g * 0.13),
                "foods": ["Whey isolate protein (25g)", "Unsweetened almond milk (200ml)", "Raw macadamia nuts (25g)"],
                "recipe_tip": "Shake well with ice for an ultra-creamy low-carb shake."
            },
            {
                "meal_name": "Grass-Fed Ribeye Steak with Garlic Butter Mushrooms",
                "timing": "Dinner (8:00 PM)",
                "calories": int(target_calories * 0.25),
                "protein": int(protein_g * 0.25),
                "carbs": 6,
                "fat": int(fat_g * 0.20),
                "foods": ["Ribeye steak (220g)", "Portobello mushrooms (100g)", "Grass-fed butter (20g)", "Mixed leafy greens with olive oil"],
                "recipe_tip": "Sear in a screaming hot cast-iron skillet for 3 mins each side. Baste with rosemary butter."
            }
        ]
    else:
        # Standard High Protein
        sample_meals = [
            {
                "meal_name": "Pro-Oats & Whole Egg Scramble",
                "timing": "Breakfast (7:30 AM)",
                "calories": int(target_calories * 0.26),
                "protein": int(protein_g * 0.28),
                "carbs": int(carbs_g * 0.30),
                "fat": int(fat_g * 0.22),
                "foods": ["Steel-cut or rolled oats (75g)", "Whey protein isolate (30g)", "Large eggs (2 whole + 2 whites)", "Fresh blueberries (70g)"],
                "recipe_tip": "Cook oats in water, let cool 2 minutes before folding in whey protein. Serve alongside fluffy soft-scrambled eggs."
            },
            {
                "meal_name": "Grilled Chicken, Jasmine Rice & Roasted Veggies",
                "timing": "Lunch (12:30 PM)",
                "calories": int(target_calories * 0.32),
                "protein": int(protein_g * 0.32),
                "carbs": int(carbs_g * 0.35),
                "fat": int(fat_g * 0.26),
                "foods": ["Skinless chicken breast (180g)", "Steamed jasmine rice (160g cooked)", "Roasted zucchini and broccoli (150g)", "Extra virgin olive oil (10ml)"],
                "recipe_tip": "Marinate chicken with smoked paprika, garlic, oregano, and lemon juice. Grill until internal temp hits 74°C."
            },
            {
                "meal_name": "Greek Yogurt Parfait & Honey Pre-Workout",
                "timing": "Snack / Pre-Workout (4:30 PM)",
                "calories": int(target_calories * 0.16),
                "protein": int(protein_g * 0.15),
                "carbs": int(carbs_g * 0.18),
                "fat": int(fat_g * 0.16),
                "foods": ["0% Plain Greek Yogurt (200g)", "Sliced banana (1 medium)", "Raw honey (1 tbsp)", "Crushed walnuts (15g)"],
                "recipe_tip": "Layer yogurt with honey and banana slices for fast-digesting carbohydrates and steady muscle recovery."
            },
            {
                "meal_name": "Pan-Seared Salmon or Lean Sirloin & Sweet Potato Mash",
                "timing": "Dinner (7:30 PM)",
                "calories": int(target_calories * 0.26),
                "protein": int(protein_g * 0.25),
                "carbs": int(carbs_g * 0.17),
                "fat": int(fat_g * 0.36),
                "foods": ["Atlantic salmon or 93/7 lean beef (180g)", "Baked sweet potato mash (180g)", "Steamed asparagus spears (120g)", "Avocado (40g)"],
                "recipe_tip": "Bake sweet potato at 200°C until soft, mash with a pinch of sea salt, cinnamon, and a dash of almond milk."
            }
        ]

    return {
        "title": f"Custom {diet_type.replace('_', ' ').title()} Nutrition Matrix",
        "goal": goal,
        "daily_calories": target_calories,
        "bmr": int(bmr),
        "tdee": tdee,
        "macros": {
            "protein_g": protein_g,
            "carbs_g": carbs_g,
            "fat_g": fat_g,
            "protein_pct": int((protein_cals / target_calories) * 100),
            "carbs_pct": int((carbs_cals / target_calories) * 100),
            "fat_pct": int((fat_cals / target_calories) * 100),
        },
        "hydration_target_liters": round(weight_kg * 0.04, 1),
        "meals": sample_meals,
        "grocery_list": [
            "Proteins: Chicken breast, Whey isolate, Whole eggs, Wild salmon, Greek yogurt",
            "Complex Carbs: Jasmine rice, Rolled oats, Sweet potatoes, Bananas",
            "Healthy Fats: Extra virgin olive oil, Raw walnuts, Avocados",
            "Fiber & Micronutrients: Broccoli, Asparagus, Spinach, Fresh berries"
        ],
        "nutritionist_notes": [
            f"Aim for {protein_g}g protein spread evenly across 3-4 meals to maximize Muscle Protein Synthesis (MPS).",
            "Drink at least 500ml water immediately upon waking to rehydrate cells.",
            "Time the pre-workout meal 60-90 minutes prior to training for maximum ATP glycogen replenishment."
        ]
    }

def generate_smart_chat_response(user_message, history=None):
    """
    Expert fitness coaching assistant with context-aware responses.
    """
    msg = user_message.lower()

    if any(k in msg for k in ['creatine', 'monohydrate']):
        return """**Titan AI Coach on Creatine Monohydrate:**

Creatine is one of the most researched sports supplements in human history. Here is the scientifically optimal protocol:

1. **Dosage:** 3 to 5 grams daily of pure **Creatine Monohydrate** (Creapure certified preferred).
2. **Loading Phase?** Optional. You can take 20g/day (divided into 4 x 5g doses) for 5-7 days to saturate muscle phosphocreatine stores faster, OR simply take 5g/day consistently; after 3 weeks your muscles will be equally saturated.
3. **Timing:** Any time of day is fine! Post-workout with carbohydrates and protein offers a slight edge in cellular uptake via insulin action.
4. **Hydration:** Creatine pulls water inside the muscle cell (cellular hydration). Ensure you drink 3-4 liters of water daily.
5. **No Cycling Needed:** There is no downregulation of endogenous synthesis long-term. You can take it year-round."""

    elif any(k in msg for k in ['plateau', 'stuck', 'not losing', 'not gaining']):
        return """**How to Break Your Fitness Plateau (AI Protocol):**

When progress halts, the body has adapted. Here is our 4-point diagnostic:

1. **Energy Balance Audit:**
   - If fat loss stopped: Metabolic adaptation or hidden calories. Track using a digital kitchen scale for 4 days. Drop calories by 150-200 kcal or add 2,000 daily steps.
   - If muscle gain stopped: Increase daily calories by 250 kcal (mostly complex carbs like oats or rice).

2. **Progressive Overload Re-Check:**
   - Are you journaling weights, sets, and reps? If you've lifted the same weight for 3 weeks, decrease reps by 2 and increase weight by 2.5%, or add an extra set.

3. **Take a Deload Week:**
   - High systemic fatigue masks fitness. Reduce working sets by 50% and intensity to RPE 6 for 7 days. You will often hit new PRs the following week!

4. **Sleep & Cortisol:**
   - Less than 7 hours of sleep decreases testosterone/IGF-1 and elevates cortisol, suppressing fat oxidation and protein synthesis."""

    elif any(k in msg for k in ['sore', 'soreness', 'doms', 'recovery']):
        return """**DOMS (Delayed Onset Muscle Soreness) Recovery Protocol:**

Muscle soreness is micro-trauma to myofibrils, usually peak 24-48 hours after eccentric loading:

- **Active Recovery (Recommended):** Don't stay stationary! A 20-minute brisk walk, light cycling, or bodyweight mobility drills increases blood flow and clears metabolic byproducts.
- **Hydration & Electrolytes:** Ensure sodium, potassium, and magnesium intake are sufficient.
- **Sleep:** 80% of Growth Hormone is pulsed during slow-wave Deep Sleep.
- **Protein Intake:** Ensure you are getting 1.8 - 2.2g of protein per kg of bodyweight to provide amino acid building blocks for repair.
- **Should you train through it?** If the soreness is muscular (not joint pain) and below a 6/10 intensity, training another muscle group or doing light volume is safe and beneficial."""

    elif any(k in msg for k in ['pre workout', 'pre-workout', 'eat before']):
        return """**Optimal Pre-Workout Fueling Strategy:**

- **Timing:** 60 to 90 minutes before your workout.
- **What to eat:**
  - **Carbohydrates:** 30-50g of fast-to-moderate digesting carbs (e.g., oatmeal with banana, rice cakes with honey, or sourdough toast).
  - **Protein:** 20-30g of fast-digesting protein (whey isolate or egg whites).
  - **Fats:** Keep fats low (< 5-8g) before training because fat slows gastric emptying and can cause bloating.
  - **Hydration:** 500-750ml of water with a pinch of sea salt for intracellular pumps."""

    elif any(k in msg for k in ['schedule', 'hours', 'location', 'class', 'join', 'membership', 'gym']):
        return """**Pulse AI Gym Facility & Schedule Info:**

- **Location:** 742 Iron Forge Blvd, Downtown Metrowest.
- **Hours:** 24/7 Access for Pro, Elite, and AI VIP members. Front Desk & Trainers on-site Mon-Fri 6:00 AM - 10:00 PM, Sat-Sun 7:00 AM - 8:00 PM.
- **Classes:** We host daily HIIT, Powerlifting, Boxing Conditioning, Vinyasa Yoga, and CrossFit sessions. You can browse and reserve your spot directly under our **Classes & Schedule** tab!
- **AI Perks:** All memberships include our AI Workout Routine Generator and Nutrition Planner."""

    else:
        return f"""**Pulse AI Coach Analysis:**

Regarding your question about: *"{user_message}"*

Here are the key takeaways from modern exercise science:
1. **Consistency over Intensity:** 80% effort sustained for 6 months beats 100% effort that leads to burnout in 3 weeks.
2. **Form First:** Every repetition should be controlled. The eccentric (lowering) phase should take 2 seconds, and the concentric (lifting) phase should be explosive.
3. **Nutrition Foundation:** Make sure you hit your daily protein goal (~2g per kg of bodyweight) and match your caloric intake to whether you want to burn fat (caloric deficit) or build muscle (caloric surplus).
4. **Need a Custom Plan?** You can generate a tailored routine or meal plan right now using our **AI Workout Generator** and **AI Nutrition Planner** tabs!

Feel free to ask me for exercise form breakdowns, recovery tips, or supplement guidance anytime."""

def calculate_readiness_score(sleep_hours=7.5, soreness=2, stress=2, energy=4):
    """
    Computes a daily readiness score (0-100) based on vital recovery markers.
    """
    # Sleep score (ideal 8h): 0-35 points
    sleep_score = min(35, max(5, (sleep_hours / 8.0) * 35))
    
    # Soreness score (1 = none, 5 = severe): 0-25 points
    soreness_score = (6 - soreness) * 5
    
    # Stress score (1 = relaxed, 5 = extreme stress): 0-20 points
    stress_score = (6 - stress) * 4
    
    # Energy score (1 = exhausted, 5 = fully energized): 0-20 points
    energy_score = energy * 4
    
    total = int(sleep_score + soreness_score + stress_score + energy_score)
    total = max(10, min(100, total))

    if total >= 85:
        category = "Peak Performance / PR Day"
        recommendation = "Central Nervous System is fully recovered! Perfect day for heavy compound lifts, testing personal records, or high-intensity interval sprints."
        intensity_level = "High / 90-100% RPE"
    elif total >= 65:
        category = "Optimal Training Zone"
        recommendation = "Good recovery profile. Proceed with your scheduled hypertrophy and strength workout as planned. Keep good form and rest 90s between working sets."
        intensity_level = "Moderate-High / 75-85% RPE"
    elif total >= 45:
        category = "Moderate Recovery / Deload Suggested"
        recommendation = "Slight systemic fatigue detected. Focus on moderate weights, higher reps, or technique refinement. Ensure proper hydration and pre-workout fueling."
        intensity_level = "Moderate / 60-70% RPE"
    else:
        category = "High Fatigue / Active Recovery Day"
        recommendation = "Your body is showing elevated strain signals. We recommend light cardio, foam rolling, yoga mobility, and an extra 1-2 hours of sleep tonight."
        intensity_level = "Light / Active Recovery"

    return {
        "readiness_score": total,
        "category": category,
        "recommendation": recommendation,
        "intensity_level": intensity_level,
        "breakdown": {
            "sleep_contribution": round(sleep_score),
            "muscle_recovery": round(soreness_score),
            "stress_management": round(stress_score),
            "energy_state": round(energy_score)
        }
    }
