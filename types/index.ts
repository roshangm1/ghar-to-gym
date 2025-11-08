export interface Workout {
    id: string;
    title: string;
    culturalName: string;
    description: string;
    duration: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    equipment: string[];
    exercises: Exercise[];
    caloriesBurn: number;
    category: WorkoutCategory;
    imageUrl: string;
  }
  
  export interface Exercise {
    id: string;
    name: string;
    reps?: string;
    duration?: number;
    instructions: string[];
    videoUrl?: string;
    imageUrl?: string;
  }
  
  export type WorkoutCategory = 'strength' | 'cardio' | 'flexibility' | 'cultural';
  
  export interface NutritionTip {
    id: string;
    title: string;
    category: 'dal-bhat' | 'momo' | 'traditional' | 'modern';
    description: string;
    tips: string[];
    nutritionInfo?: {
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
    };
    imageUrl: string;
  }
  
  export interface UserGoal {
    id: string;
    type: 'weight' | 'workouts' | 'energy' | 'sleep' | 'streak';
    target: number;
    current: number;
    unit: string;
    startDate: string;
    endDate?: string;
  }
  
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  goals: UserGoal[];
  workoutStreak: number;
  totalWorkouts: number;
  points: number;
  achievements: Achievement[];
  weight?: {
    current: number;
    target: number;
    unit: 'kg' | 'lbs';
  };
  customMetrics: {
    energyLevel: number;
    sleepQuality: number;
    lastWorkoutDate?: string;
  };
}
  
  export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedDate: string;
  }
  
  export interface LeaderboardEntry {
    id: string;
    userId: string;
    userName: string;
    points: number;
    streak: number;
    avatar?: string;
    rank: number;
  }
  
  export interface Challenge {
    id: string;
    title: string;
    culturalName: string;
    description: string;
    type: 'weekly' | 'monthly';
    goal: number;
    progress: number;
    participants: number;
    endDate: string;
    reward: string;
  }
  
  export interface WorkoutLog {
    id: string;
    workoutId: string;
    date: string;
    duration: number;
    caloriesBurned: number;
    energyBefore: number;
    energyAfter: number;
    notes?: string;
  }
  
  export interface SocialPost {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    type: 'achievement' | 'workout' | 'milestone' | 'challenge';
    content: string;
    timestamp: string;
    likes: number;
    comments: number;
    isLiked?: boolean; // Whether the current user has liked this post
    data?: {
      achievementId?: string;
      workoutId?: string;
      challengeId?: string;
      icon?: string;
    };
  }

  export interface Comment {
    id: string;
    postId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    timestamp: string;
  }
  
export interface FitnessProgram {
  id: string;
  title: string;
  culturalName: string;
  description: string;
  goalType: 'weight-loss' | 'muscle-gain' | 'flexibility' | 'endurance';
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  workouts: string[];
  mealPlans: MealPlan[];
  tips: string[];
  imageUrl: string;
  targetMetrics: {
    weightChange?: number;
    caloriesPerDay?: number;
    workoutsPerWeek?: number;
  };
}
  
  export interface MealPlan {
    id: string;
    day: string;
    meals: {
      name: string;
      time: string;
      items: string[];
      calories: number;
      culturalName?: string;
    }[];
  }
  
  export interface AchievementPreferences {
    autoPost: boolean;
    shareWorkouts: boolean;
    shareMilestones: boolean;
    shareChallenges: boolean;
  }
  