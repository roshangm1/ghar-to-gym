import { FitnessProgram } from '@/types';

export const FITNESS_PROGRAMS: FitnessProgram[] = [
  {
    id: 'gp1',
    title: 'Weight Loss Journey',
    culturalName: 'तौल घटाउने यात्रा',
    description:
      'A comprehensive 12-week program designed to help you lose weight the healthy Nepali way. Combines traditional exercises with culturally-adapted meal plans.',
    goalType: 'weight-loss',
    duration: 12,
    difficulty: 'beginner',
    workouts: ['w1', 'w2', 'w3', 'w4'],
    mealPlans: [
      {
        id: 'mp1',
        day: 'Monday',
        meals: [
          {
            name: 'Breakfast',
            culturalName: 'बिहानको खाना',
            time: '7:00 AM',
            items: [
              'Light Dal (1 cup)',
              'Brown Rice (1/2 cup)',
              'Mixed vegetable curry',
              'Green tea',
            ],
            calories: 350,
          },
          {
            name: 'Mid-Morning Snack',
            time: '10:00 AM',
            items: ['Seasonal fruit', 'Handful of roasted soybeans'],
            calories: 150,
          },
          {
            name: 'Lunch',
            culturalName: 'दिउँसोको खाना',
            time: '12:30 PM',
            items: [
              'Dal (1 cup)',
              'Brown Rice (3/4 cup)',
              'Chicken curry (100g)',
              'Salad',
              'Yogurt',
            ],
            calories: 450,
          },
          {
            name: 'Evening Snack',
            time: '4:00 PM',
            items: ['Boiled egg', 'Cucumber slices'],
            calories: 100,
          },
          {
            name: 'Dinner',
            culturalName: 'बेलुकीको खाना',
            time: '7:00 PM',
            items: [
              'Vegetable soup',
              'Roti (2 pieces)',
              'Grilled chicken/fish',
              'Salad',
            ],
            calories: 400,
          },
        ],
      },
    ],
    tips: [
      'Reduce rice portions gradually - start with 1/2 cup instead of full plate',
      'Replace regular dal with sprouted dal for better nutrition',
      'Avoid fried snacks like samosa and pakoda',
      'Drink warm lemon water in the morning',
      'Walk for 15 minutes after dinner',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop',
    targetMetrics: {
      weightChange: -5,
      caloriesPerDay: 1450,
      workoutsPerWeek: 5,
    },
  },
  {
    id: 'gp2',
    title: 'Muscle Building Plan',
    culturalName: 'मांसपेशी निर्माण योजना',
    description:
      'An 8-week program to build lean muscle mass with protein-rich Nepali diet and strength training.',
    goalType: 'muscle-gain',
    duration: 8,
    difficulty: 'intermediate',
    workouts: ['w1', 'w2', 'w5'],
    mealPlans: [
      {
        id: 'mp2',
        day: 'Monday',
        meals: [
          {
            name: 'Breakfast',
            culturalName: 'बिहानको खाना',
            time: '7:00 AM',
            items: [
              'Scrambled eggs (3)',
              'Whole wheat roti (2)',
              'Milk (1 glass)',
              'Banana',
            ],
            calories: 550,
          },
          {
            name: 'Mid-Morning Snack',
            time: '10:00 AM',
            items: ['Protein shake', 'Almonds (10-12)'],
            calories: 250,
          },
          {
            name: 'Lunch',
            culturalName: 'दिउँसोको खाना',
            time: '12:30 PM',
            items: [
              'Dal (1.5 cups)',
              'Brown Rice (1 cup)',
              'Chicken/Mutton (150g)',
              'Mixed vegetables',
              'Curd',
            ],
            calories: 700,
          },
          {
            name: 'Post-Workout',
            time: '5:00 PM',
            items: ['Whey protein shake', 'Banana'],
            calories: 300,
          },
          {
            name: 'Dinner',
            culturalName: 'बेलुकीको खाना',
            time: '8:00 PM',
            items: [
              'Grilled fish/chicken (200g)',
              'Quinoa/Brown rice',
              'Salad',
              'Paneer curry',
            ],
            calories: 650,
          },
        ],
      },
    ],
    tips: [
      'Increase protein intake - aim for 150g per day',
      'Include paneer, chicken, fish, and eggs daily',
      'Have protein-rich snacks like roasted chickpeas',
      'Lift progressively heavier weights each week',
      'Get 8 hours of sleep for muscle recovery',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop',
    targetMetrics: {
      weightChange: 3,
      caloriesPerDay: 2450,
      workoutsPerWeek: 5,
    },
  },
  {
    id: 'gp3',
    title: 'Flexibility & Balance',
    culturalName: 'लचिलोपन र सन्तुलन',
    description:
      'A 6-week yoga and stretching program inspired by traditional Nepali practices to improve flexibility.',
    goalType: 'flexibility',
    duration: 6,
    difficulty: 'beginner',
    workouts: ['w6'],
    mealPlans: [
      {
        id: 'mp3',
        day: 'Monday',
        meals: [
          {
            name: 'Breakfast',
            culturalName: 'बिहानको खाना',
            time: '7:00 AM',
            items: [
              'Oatmeal with honey',
              'Seasonal fruits',
              'Green tea',
              'Nuts',
            ],
            calories: 400,
          },
          {
            name: 'Mid-Morning Snack',
            time: '10:00 AM',
            items: ['Fruit smoothie', 'Handful of seeds'],
            calories: 200,
          },
          {
            name: 'Lunch',
            culturalName: 'दिउँसोको खाना',
            time: '12:30 PM',
            items: [
              'Dal (1 cup)',
              'Rice (3/4 cup)',
              'Mixed vegetable curry',
              'Salad',
            ],
            calories: 500,
          },
          {
            name: 'Evening Snack',
            time: '4:00 PM',
            items: ['Herbal tea', 'Roasted makhana'],
            calories: 150,
          },
          {
            name: 'Dinner',
            culturalName: 'बेलुकीको खाना',
            time: '7:00 PM',
            items: ['Light soup', 'Roti (2)', 'Vegetable curry', 'Curd'],
            calories: 450,
          },
        ],
      },
    ],
    tips: [
      'Practice yoga in the morning on empty stomach',
      'Focus on breathing - deep inhales and exhales',
      'Hold each stretch for at least 30 seconds',
      'Stay hydrated throughout the day',
      'Include anti-inflammatory foods like turmeric',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    targetMetrics: {
      caloriesPerDay: 1700,
      workoutsPerWeek: 6,
    },
  },
  {
    id: 'gp4',
    title: 'Endurance Builder',
    culturalName: 'सहनशक्ति निर्माणकर्ता',
    description:
      'A 10-week cardio-focused program to build stamina for those hills and stairs in Nepal!',
    goalType: 'endurance',
    duration: 10,
    difficulty: 'intermediate',
    workouts: ['w3', 'w4'],
    mealPlans: [
      {
        id: 'mp4',
        day: 'Monday',
        meals: [
          {
            name: 'Breakfast',
            culturalName: 'बिहानको खाना',
            time: '6:30 AM',
            items: [
              'Poha/Beaten rice',
              'Boiled eggs (2)',
              'Banana',
              'Juice',
            ],
            calories: 500,
          },
          {
            name: 'Mid-Morning Snack',
            time: '10:00 AM',
            items: ['Energy bar', 'Coconut water'],
            calories: 200,
          },
          {
            name: 'Lunch',
            culturalName: 'दिउँसोको खाना',
            time: '1:00 PM',
            items: [
              'Dal (1 cup)',
              'Rice (1 cup)',
              'Chicken/Fish (100g)',
              'Vegetables',
              'Salad',
            ],
            calories: 600,
          },
          {
            name: 'Pre-Workout',
            time: '4:30 PM',
            items: ['Banana', 'Dates (3-4)'],
            calories: 150,
          },
          {
            name: 'Dinner',
            culturalName: 'बेलुकीको खाना',
            time: '8:00 PM',
            items: [
              'Khichdi',
              'Grilled chicken',
              'Mixed vegetables',
              'Buttermilk',
            ],
            calories: 550,
          },
        ],
      },
    ],
    tips: [
      'Start with 20-minute runs, increase by 5 minutes weekly',
      'Include carb-rich foods before cardio sessions',
      'Practice interval training - alternate fast and slow pace',
      'Climb stairs daily - start with 5 floors',
      'Stay consistent - run/cardio at least 4 days a week',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop',
    targetMetrics: {
      caloriesPerDay: 2000,
      workoutsPerWeek: 5,
    },
  },
];
