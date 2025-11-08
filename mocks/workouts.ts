import { Workout } from '@/types';

export const WORKOUTS: Workout[] = [

    {
      "id": "7",
      "title": "Himalayan HIIT",
      "culturalName": "हिमालयन HIIT",
      "description": "High-intensity intervals to boost metabolism, mountain-style. Quick and effective.",
      "duration": 15,
      "difficulty": "intermediate",
      "equipment": [],
      "category": "cardio",
      "caloriesBurn": 200,
      "imageUrl": "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800",
      "exercises": [
        {
          "id": "e19",
          "name": "Jumping Jacks",
          "duration": 60,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
          "instructions": [
            "Start with feet together, arms at sides",
            "Jump, spreading feet wide and bringing arms overhead",
            "Return to start"
          ]
        },
        {
          "id": "e20",
          "name": "Squat Jumps",
          "reps": "3 sets of 12",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
          "instructions": [
            "Perform a regular squat",
            "Explosively jump up",
            "Land softly back into a squat"
          ]
        },
        {
          "id": "e21",
          "name": "Mountain Climbers",
          "duration": 45,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
          "instructions": [
            "Start in plank position",
            "Quickly alternate bringing knees to chest",
            "Keep core tight"
          ]
        },
        {
          "id": "e22",
          "name": "Burpees",
          "reps": "3 sets of 8",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
          "instructions": [
            "Drop to squat, kick feet to plank",
            "Optional push-up",
            "Jump feet back to squat, jump up"
          ]
        }
      ]
    },
    {
      "id": "8",
      "title": "Pokhara Peace Yoga",
      "culturalName": "पोखरा शान्ति योग",
      "description": "Find your center with a calming flow inspired by the peace of Pokhara.",
      "duration": 25,
      "difficulty": "beginner",
      "equipment": [],
      "category": "flexibility",
      "caloriesBurn": 110,
      "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      "exercises": [
        {
          "id": "e23",
          "name": "Cat-Cow Pose",
          "reps": "10 rounds",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          "instructions": [
            "Start on all fours",
            "Inhale, arch back (Cow)",
            "Exhale, round spine (Cat)"
          ]
        },
        {
          "id": "e24",
          "name": "Downward-Facing Dog",
          "duration": 60,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
          "instructions": [
            "From all fours, lift hips up and back",
            "Form an inverted 'V' shape",
            "Press heels toward floor"
          ]
        },
        {
          "id": "e25",
          "name": "Child's Pose",
          "duration": 120,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
          "instructions": [
            "Kneel, sit back on heels",
            "Fold forward, rest forehead on mat",
            "Relax"
          ]
        },
        {
          "id": "e26",
          "name": "Seated Forward Bend",
          "duration": 60,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
          "instructions": [
            "Sit with legs straight out",
            "Hinge at hips, fold forward over legs",
            "Breathe deeply"
          ]
        }
      ]
    },
    {
      "id": "9",
      "title": "Gurkha Guard Core",
      "culturalName": "गोर्खाली गार्ड कोर",
      "description": "Build a rock-solid core with the discipline of a Gurkha warrior.",
      "duration": 20,
      "difficulty": "intermediate",
      "equipment": [],
      "category": "strength",
      "caloriesBurn": 160,
      "imageUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
      "exercises": [
        {
          "id": "e27",
          "name": "Plank Hold",
          "duration": 60,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          "instructions": [
            "Hold plank on forearms or hands",
            "Keep body in straight line",
            "Engage core"
          ]
        },
        {
          "id": "e28",
          "name": "Hollow Body Hold",
          "reps": "3 sets of 30s",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          "instructions": [
            "Lie on back, press lower back into floor",
            "Lift shoulders and legs off floor",
            "Hold 'banana' shape"
          ]
        },
        {
          "id": "e29",
          "name": "Bird-Dog",
          "reps": "3 sets of 10 each side",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          "instructions": [
            "Start on all fours",
            "Extend opposite arm and leg",
            "Hold, then return. Alternate sides."
          ]
        },
        {
          "id": "e30",
          "name": "V-Ups",
          "reps": "3 sets of 12",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          "instructions": [
            "Lie flat on back",
            "Simultaneously lift legs and torso",
            "Reach hands toward toes"
          ]
        }
      ]
    },
    {
      "id": "10",
      "title": "Annapurna Ascent Legs",
      "culturalName": "अन्नपूर्ण आरोहण खुट्टा",
      "description": "A challenging lower body workout to build legs strong enough for any trek.",
      "duration": 25,
      "difficulty": "intermediate",
      "equipment": [],
      "category": "strength",
      "caloriesBurn": 220,
      "imageUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800",
      "exercises": [
        {
          "id": "e31",
          "name": "Squats",
          "reps": "4 sets of 15",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          "instructions": [
            "Feet shoulder-width apart",
            "Lower hips back and down",
            "Keep chest up"
          ]
        },
        {
          "id": "e32",
          "name": "Alternating Lunges",
          "reps": "3 sets of 10 each leg",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
          "instructions": [
            "Step forward, lower into lunge",
            "Push back to start, switch legs",
            "Keep front knee over ankle"
          ]
        },
        {
          "id": "e33",
          "name": "Glute Bridges",
          "reps": "3 sets of 15",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
          "instructions": [
            "Lie on back, knees bent",
            "Lift hips toward ceiling",
            "Squeeze glutes at top"
          ]
        },
        {
          "id": "e34",
          "name": "Calf Raises",
          "reps": "4 sets of 20",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
          "instructions": [
            "Stand tall",
            "Raise up onto balls of your feet",
            "Lower slowly"
          ]
        },
        {
          "id": "e35",
          "name": "Wall Sit",
          "duration": 45,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
          "instructions": [
            "Slide back down a wall",
            "Hold squat position with knees at 90°",
            "Keep back flat against wall"
          ]
        }
      ]
    },
    {
      "id": "11",
      "title": "Kathmandu Temple Hop",
      "culturalName": "काठमाडौं मन्दिर हप",
      "description": "A fun, agile cardio workout. Imagine hopping between temples in Durbar Square!",
      "duration": 20,
      "difficulty": "beginner",
      "equipment": [],
      "category": "cardio",
      "caloriesBurn": 180,
      "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800",
      "exercises": [
        {
          "id": "e36",
          "name": "Side Shuffles",
          "duration": 60,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          "instructions": [
            "Stand in athletic stance",
            "Shuffle side to side",
            "Stay low"
          ]
        },
        {
          "id": "e37",
          "name": "Skaters",
          "reps": "3 sets of 20",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
          "instructions": [
            "Leap side to side",
            "Land on one foot, bring other foot behind",
            "Touch ground if possible"
          ]
        },
        {
          "id": "e38",
          "name": "High Knees",
          "duration": 45,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
          "instructions": [
            "Run in place",
            "Bring knees up to hip height",
            "Pump arms"
          ]
        },
        {
          "id": "e39",
          "name": "Quick Feet",
          "duration": 60,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
          "instructions": [
            "Stand with feet wide",
            "Run in place as fast as possible",
            "Stay on balls of feet"
          ]
        }
      ]
    },
    {
      "id": "12",
      "title": "Zen Monk Mobility",
      "culturalName": "जेन भिक्षु गतिशीलता",
      "description": "Improve your range of motion and flexibility with this mindful mobility routine.",
      "duration": 20,
      "difficulty": "beginner",
      "equipment": [],
      "category": "flexibility",
      "caloriesBurn": 80,
      "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      "exercises": [
        {
          "id": "e40",
          "name": "Neck Rolls",
          "reps": "5 each direction",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          "instructions": [
            "Sit tall",
            "Gently drop chin to chest",
            "Slowly roll ear to shoulder, repeat other side"
          ]
        },
        {
          "id": "e41",
          "name": "Shoulder Circles",
          "reps": "10 each direction",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          "instructions": [
            "Roll shoulders backward in big circles",
            "Reverse and roll forward"
          ]
        },
        {
          "id": "e42",
          "name": "Spinal Twists",
          "reps": "3 each side (hold 30s)",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          "instructions": [
            "Sit tall, cross one leg over other",
            "Twist torso toward bent knee",
            "Hold and breathe"
          ]
        },
        {
          "id": "e43",
          "name": "Hip Circles",
          "reps": "10 each direction",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          "instructions": [
            "Stand with hands on hips",
            "Make large circles with your hips",
            "Keep knees soft"
          ]
        }
      ]
    },
    {
      "id": "13",
      "title": "Yeti Strength Upper Body",
      "culturalName": "यति शक्ति माथिल्लो शरीर",
      "description": "Build legendary upper body strength. No equipment, just pure power.",
      "duration": 20,
      "difficulty": "intermediate",
      "equipment": [],
      "category": "strength",
      "caloriesBurn": 170,
      "imageUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
      "exercises": [
        {
          "id": "e44",
          "name": "Push-ups",
          "reps": "3 sets to failure",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          "instructions": [
            "Start in plank position",
            "Lower chest to floor",
            "Push back up, keeping core tight"
          ]
        },
        {
          "id": "e45",
          "name": "Tricep Dips (using chair)",
          "reps": "3 sets of 12",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
          "instructions": [
            "Sit on edge of chair, hands gripping edge",
            "Slide hips off, lower body",
            "Push back up with triceps"
          ]
        },
        {
          "id": "e46",
          "name": "Pike Push-ups",
          "reps": "3 sets of 10",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
          "instructions": [
            "Start in downward dog position",
            "Bend elbows, lower head toward floor",
            "Push back up"
          ]
        },
        {
          "id": "e47",
          "name": "Plank to Downward Dog",
          "reps": "3 sets of 10",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
          "instructions": [
            "Start in plank",
            "Push hips up and back into downward dog",
            "Flow back to plank, repeat"
          ]
        }
      ]
    },
    {
      "id": "14",
      "title": "Manaslu Morning Flow",
      "culturalName": "मनास्लु बिहानको प्रवाह",
      "description": "A gentle yoga flow to wake up your body and mind, inspired by the Manaslu sunrise.",
      "duration": 20,
      "difficulty": "beginner",
      "equipment": [],
      "category": "yoga",
      "caloriesBurn": 100,
      "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      "exercises": [
        {
          "id": "e48",
          "name": "Sun Salutation A",
          "reps": "5 rounds",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
          "instructions": [
            "Flow from mountain pose to forward fold",
            "Step back to plank, chaturanga (or knees-chest-chin)",
            "Move to upward dog/cobra, then downward dog"
          ]
        },
        {
          "id": "e49",
          "name": "Warrior I",
          "duration": 30,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          "instructions": [
            "Step one foot back",
            "Bend front knee, raise arms overhead",
            "Hold each side"
          ]
        },
        {
          "id": "e50",
          "name": "Triangle Pose",
          "duration": 30,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
          "instructions": [
            "Straighten front leg",
            "Hinge at hip, reach hand to shin or floor",
            "Open chest to ceiling"
          ]
        },
        {
          "id": "e51",
          "name": "Savasana",
          "duration": 180,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
          "instructions": [
            "Lie flat on back",
            "Relax all muscles",
            "Breathe naturally"
          ]
        }
      ]
    },
    {
      "id": "15",
      "title": "Lumbini Lightness Stretch",
      "culturalName": "लुम्बिनी हल्का स्ट्रेच",
      "description": "A post-workout or end-of-day stretching routine for full-body relaxation.",
      "duration": 15,
      "difficulty": "beginner",
      "equipment": [],
      "category": "flexibility",
      "caloriesBurn": 70,
      "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      "exercises": [
        {
          "id": "e52",
          "name": "Hamstring Stretch",
          "duration": 60,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
          "instructions": [
            "Sit and extend one leg, reach for toes",
            "Hold, switch sides",
            "Keep back straight"
          ]
        },
        {
          "id": "e53",
          "name": "Quad Stretch",
          "duration": 60,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          "instructions": [
            "Stand, pull heel to glute",
            "Hold for balance",
            "Hold, switch sides"
          ]
        },
        {
          "id": "e54",
          "name": "Triceps Stretch",
          "duration": 60,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          "instructions": [
            "Raise one arm, bend elbow",
            "Gently pull elbow with other hand",
            "Hold, switch sides"
          ]
        },
        {
          "id": "e55",
          "name": "Chest Opener",
          "duration": 60,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          "instructions": [
            "Stand or sit",
            "Clasp hands behind back",
            "Lift arms and open chest"
          ]
        }
      ]
    },
    {
      "id": "16",
      "title": "Chitwan Jungle Agility",
      "culturalName": "चितवन जङ्गल चपलता",
      "description": "Move like a rhino or leap like a deer with this fun, agility-focused workout.",
      "duration": 20,
      "difficulty": "intermediate",
      "equipment": [],
      "category": "cardio",
      "caloriesBurn": 210,
      "imageUrl": "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800",
      "exercises": [
        {
          "id": "e56",
          "name": "Agility Dots (Imaginary)",
          "reps": "3 sets of 60s",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          "instructions": [
            "Imagine 4 dots on floor",
            "Hop between them in different patterns",
            "Stay light on feet"
          ]
        },
        {
          "id": "e57",
          "name": "Skaters",
          "reps": "3 sets of 20",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          "instructions": [
            "Leap side to side",
            "Land softly on one foot",
            "Swing arms for momentum"
          ]
        },
        {
          "id": "e58",
          "name": "Plank Jacks",
          "reps": "3 sets of 25",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
          "instructions": [
            "Start in plank position",
            "Jump feet wide and back together",
            "Keep hips stable"
          ]
        },
        {
          "id": "e59",
          "name": "Tuck Jumps",
          "reps": "3 sets of 10",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
          "instructions": [
            "Stand tall",
            "Jump explosively, tucking knees to chest",
            "Land softly"
          ]
        }
      ]
    },
    {
      "id": "17",
      "title": "Doko Carrier Back",
      "culturalName": "डोको बोक्ने ढाड",
      "description": "Strengthen your entire back and core, inspired by the strength of Nepali porters.",
      "duration": 20,
      "difficulty": "intermediate",
      "equipment": [],
      "category": "strength",
      "caloriesBurn": 150,
      "imageUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
      "exercises": [
        {
          "id": "e60",
          "name": "Supermans",
          "reps": "3 sets of 15",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
          "instructions": [
            "Lie on stomach, arms extended",
            "Lift arms, chest, and legs off floor",
            "Hold, then lower"
          ]
        },
        {
          "id": "e61",
          "name": "Glute Bridges",
          "reps": "3 sets of 20",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
          "instructions": [
            "Lie on back, knees bent",
            "Lift hips, squeezing glutes",
            "Engage lower back"
          ]
        },
        {
          "id": "e62",
          "name": "Bird-Dog",
          "reps": "3 sets of 10 each side",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          "instructions": [
            "On all fours, extend opposite arm and leg",
            "Keep back flat and core tight",
            "Alternate sides"
          ]
        },
        {
          "id": "e63",
          "name": "Plank Hold",
          "duration": 60,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
          "instructions": [
            "Hold a steady plank",
            "Focus on keeping a straight line",
            "Don't let hips sag"
          ]
        }
      ]
    },
    {
      "id": "18",
      "title": "Thangka Painter's Posture",
      "culturalName": "थाङ्का चित्रकार आसन",
      "description": "Correct your posture and strengthen your upper back. Perfect for desk workers.",
      "duration": 15,
      "difficulty": "beginner",
      "equipment": [],
      "category": "flexibility",
      "caloriesBurn": 90,
      "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      "exercises": [
        {
          "id": "e64",
          "name": "Wall Angels",
          "reps": "3 sets of 10",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
          "instructions": [
            "Stand with back against wall",
            "Raise arms to 90° (cactus arms)",
            "Slide arms up and down wall"
          ]
        },
        {
          "id": "e65",
          "name": "Chest Opener Stretch",
          "duration": 60,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
          "instructions": [
            "Clasp hands behind back",
            "Lift arms and open chest",
            "Look slightly up"
          ]
        },
        {
          "id": "e66",
          "name": "Cat-Cow Pose",
          "reps": "10 rounds",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          "instructions": [
            "On all fours, mobilize your spine",
            "Inhale to arch (Cow), Exhale to round (Cat)"
          ]
        },
        {
          "id": "e67",
          "name": "Chin Tucks",
          "reps": "3 sets of 10",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          "instructions": [
            "Sit or stand tall",
            "Gently tuck chin toward chest",
            "Feel stretch in back of neck"
          ]
        }
      ]
    },
    {
      "id": "19",
      "title": "Prayer Wheel Twists",
      "culturalName": "प्रार्थना चक्र ट्विस्ट",
      "description": "A core and mobility workout focused on rotational strength and spinal health.",
      "duration": 15,
      "difficulty": "beginner",
      "equipment": [],
      "category": "strength",
      "caloriesBurn": 100,
      "imageUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
      "exercises": [
        {
          "id": "e68",
          "name": "Russian Twists",
          "reps": "3 sets of 20",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          "instructions": [
            "Sit, lean back, feet off floor",
            "Twist torso side to side",
            "Keep core engaged"
          ]
        },
        {
          "id": "e69",
          "name": "Seated Spinal Twist",
          "duration": 60,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          "instructions": [
            "Sit tall, cross one leg over",
            "Twist toward bent knee",
            "Hold each side"
          ]
        },
        {
          "id": "e70",
          "name": "Bicycle Crunches",
          "reps": "3 sets of 20",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          "instructions": [
            "Lie on back",
            "Alternate bringing elbow to opposite knee",
            "Keep lower back on floor"
          ]
        },
        {
          "id": "e71",
          "name": "Windshield Wipers (Lying)",
          "reps": "3 sets of 12",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
          "instructions": [
            "Lie on back, legs at 90°",
            "Slowly lower legs side to side",
            "Keep shoulders on floor"
          ]
        }
      ]
    },
    {
      "id": "20",
      "title": "Lhotse Lower Body Burn",
      "culturalName": "ल्होत्से तल्लो शरीर बर्न",
      "description": "A high-rep, high-burn workout for building endurance in your legs.",
      "duration": 20,
      "difficulty": "advanced",
      "equipment": [],
      "category": "strength",
      "caloriesBurn": 230,
      "imageUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800",
      "exercises": [
        {
          "id": "e72",
          "name": "Squat Jumps",
          "reps": "3 sets of 15",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
          "instructions": [
            "Squat deep",
            "Explode up into a high jump",
            "Land softly"
          ]
        },
        {
          "id": "e73",
          "name": "Lunge Jumps",
          "reps": "3 sets of 10 each leg",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
          "instructions": [
            "Start in lunge position",
            "Jump and switch legs mid-air",
            "Land in a lunge on other side"
          ]
        },
        {
          "id": "e74",
          "name": "Pistol Squat (Assisted)",
          "reps": "3 sets of 8 each leg",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
          "instructions": [
            "Hold onto chair or wall for balance",
            "Squat down on one leg",
            "Push through heel to return"
          ]
        },
        {
          "id": "e75",
          "name": "Burpees",
          "reps": "3 sets of 12",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          "instructions": [
            "Squat, plank, push-up",
            "Jump feet in, jump up",
            "Keep it fast"
          ]
        }
      ]
    },
    {
      "id": "21",
      "title": "Makalu Mountain Full Body",
      "culturalName": "मकालु पर्वत पूर्ण शरीर",
      "description": "A complete, no-equipment workout to build strength from head to toe.",
      "duration": 30,
      "difficulty": "intermediate",
      "equipment": [],
      "category": "strength",
      "caloriesBurn": 280,
      "imageUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
      "exercises": [
        {
          "id": "e76",
          "name": "Squats",
          "reps": "3 sets of 20",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
          "instructions": [
            "Feet shoulder-width apart",
            "Lower hips back and down",
            "Keep chest up"
          ]
        },
        {
          "id": "e77",
          "name": "Push-ups",
          "reps": "3 sets of 15",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
          "instructions": [
            "Hands under shoulders",
            "Lower chest to floor",
            "Keep body in straight line"
          ]
        },
        {
          "id": "e78",
          "name": "Alternating Lunges",
          "reps": "3 sets of 10 each leg",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
          "instructions": [
            "Step forward into lunge",
            "Push back to start, alternate",
            "Keep front knee over ankle"
          ]
        },
        {
          "id": "e79",
          "name": "Plank Hold",
          "duration": 60,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          "instructions": [
            "Hold plank on forearms or hands",
            "Engage core, don't let hips sag"
          ]
        },
        {
          "id": "e80",
          "name": "Glute Bridges",
          "reps": "3 sets of 15",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          "instructions": [
            "Lie on back, knees bent",
            "Lift hips toward ceiling",
            "Squeeze glutes"
          ]
        }
      ]
    },
    {
      "id": "22",
      "title": "Himalayan Sunrise Salutations",
      "culturalName": "हिमालयन सूर्य नमस्कार",
      "description": "A focused yoga session dedicated to repeating and refining the Sun Salutation.",
      "duration": 20,
      "difficulty": "beginner",
      "equipment": [],
      "category": "yoga",
      "caloriesBurn": 130,
      "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      "exercises": [
        {
          "id": "e81",
          "name": "Sun Salutation A (Slow)",
          "reps": "5 rounds",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          "instructions": [
            "Focus on breath with each movement",
            "Hold each pose for 1-2 breaths",
            "Warm up the body"
          ]
        },
        {
          "id": "e82",
          "name": "Sun Salutation B (Slow)",
          "reps": "5 rounds",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          "instructions": [
            "Adds Chair Pose and Warrior I",
            "Builds heat and strength",
            "Coordinate breath and movement"
          ]
        },
        {
          "id": "e83",
          "name": "Child's Pose",
          "duration": 120,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          "instructions": [
            "Rest forehead on mat",
            "Breathe into your back",
            "Relax and recover"
          ]
        },
        {
          "id": "e84",
          "name": "Savasana",
          "duration": 180,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
          "instructions": [
            "Lie flat on back",
            "Let go of all effort",
            "Absorb your practice"
          ]
        }
      ]
    },
    {
      "id": "23",
      "title": "Tibetan Plateau Endurance",
      "culturalName": "तिब्बती पठार सहनशीलता",
      "description": "A non-stop cardio workout designed to build high-altitude level endurance.",
      "duration": 25,
      "difficulty": "advanced",
      "equipment": [],
      "category": "cardio",
      "caloriesBurn": 300,
      "imageUrl": "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800",
      "exercises": [
        {
          "id": "e85",
          "name": "High Knees",
          "duration": 180,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
          "instructions": [
            "Run in place, knees high",
            "Maintain a fast pace",
            "Use your arms"
          ]
        },
        {
          "id": "e86",
          "name": "Jumping Jacks",
          "duration": 180,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
          "instructions": [
            "Keep a steady, fast rhythm",
            "Full range of motion",
            "Don't stop"
          ]
        },
        {
          "id": "e87",
          "name": "Mountain Climbers",
          "duration": 120,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
          "instructions": [
            "Plank position",
            "Drive knees to chest quickly",
            "Keep hips low"
          ]
        },
        {
          "id": "e88",
          "name": "Burpees (No Push-up)",
          "duration": 120,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          "instructions": [
            "Focus on speed",
            "Squat, plank, squat, jump",
            "Continuous movement"
          ]
        }
      ]
    },
    {
      "id": "24",
      "title": "Bhaktapur Brick Builder",
      "culturalName": "भक्तपुर ईंट निर्माण",
      "description": "Build a strong foundation with bodyweight basics. Solid, strong, and effective.",
      "duration": 20,
      "difficulty": "beginner",
      "equipment": [],
      "category": "strength",
      "caloriesBurn": 160,
      "imageUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
      "exercises": [
        {
          "id": "e89",
          "name": "Bodyweight Squats",
          "reps": "3 sets of 15",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
          "instructions": [
            "Focus on good form",
            "Go as low as comfortable",
            "Push through heels"
          ]
        },
        {
          "id": "e90",
          "name": "Knee Push-ups",
          "reps": "3 sets of 12",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
          "instructions": [
            "Modify push-up on your knees",
            "Lower chest to floor",
            "Keep core tight"
          ]
        },
        {
          "id": "e91",
          "name": "Lunges (Static)",
          "reps": "3 sets of 10 each leg",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
          "instructions": [
            "Step into lunge and hold position",
            "Pulse up and down",
            "Complete all reps on one side"
          ]
        },
        {
          "id": "e92",
          "name": "Forearm Plank",
          "duration": 45,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          "instructions": [
            "Hold plank on your forearms",
            "Keep body straight",
            "Breathe"
          ]
        }
      ]
    },
    {
      "id": "25",
      "title": "Bagmati River Flow",
      "culturalName": "बागमती नदी प्रवाह",
      "description": "A flowing Vinyasa yoga sequence to connect breath with movement.",
      "duration": 30,
      "difficulty": "intermediate",
      "equipment": [],
      "category": "yoga",
      "caloriesBurn": 140,
      "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      "exercises": [
        {
          "id": "e93",
          "name": "Sun Salutation B",
          "reps": "6 rounds",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          "instructions": [
            "Flow one breath per movement",
            "Builds heat quickly",
            "Links Chair, Warrior I, and vinyasa"
          ]
        },
        {
          "id": "e94",
          "name": "Warrior II to Reverse Warrior",
          "reps": "5 flows each side",
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          "instructions": [
            "Hold Warrior II",
            "Inhale, reverse warrior",
            "Exhale, back to Warrior II"
          ]
        },
        {
          "id": "e95",
          "name": "Crescent Lunge Twist",
          "duration": 30,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          "instructions": [
            "From high lunge, bring hands to prayer",
            "Twist, hooking opposite elbow",
            "Hold each side"
          ]
        },
        {
          "id": "e96",
          "name": "Pigeon Pose",
          "duration": 60,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          "instructions": [
            "Ease into hip stretch",
            "Fold forward if comfortable",
            "Hold each side"
          ]
        },
        {
          "id": "e97",
          "name": "Savasana",
          "duration": 300,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
          "instructions": [
            "Final rest",
            "Relax body and mind",
            "Breathe"
          ]
        }
      ]
    },
    {
      "id": "26",
      "title": "Rara Lake Calmness",
      "culturalName": "रारा ताल शान्त",
      "description": "A mindfulness and meditation-focused session. Not a workout, but a 'work-in'.",
      "duration": 15,
      "difficulty": "beginner",
      "equipment": [],
      "category": "mindfulness",
      "caloriesBurn": 30,
      "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      "exercises": [
        {
          "id": "e98",
          "name": "Seated Posture Check",
          "duration": 60,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
          "instructions": [
            "Find a comfortable seated position",
            "Sit tall, relax shoulders",
            "Close eyes"
          ]
        },
        {
          "id": "e99",
          "name": "Focused Breathing",
          "duration": 300,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
          "instructions": [
            "Focus on the sensation of your breath",
            "Notice inhale and exhale",
            "If mind wanders, gently return"
          ]
        },
        {
          "id": "e100",
          "name": "Body Scan",
          "duration": 300,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
          "instructions": [
            "Mentally scan from toes to head",
            "Notice any tension",
            "Breathe into those areas"
          ]
        },
        {
          "id": "e101",
          "name": "Gentle Return",
          "duration": 120,
          "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          "instructions": [
            "Slowly bring awareness back",
            "Wiggle fingers and toes",
            "Open eyes when ready"
          ]
        }
      ]
    }
  
];
