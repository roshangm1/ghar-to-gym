# InstantDB Setup Guide

This guide will help you set up InstantDB for your Ghar-to-Gym fitness app with **workouts** and **nutrition tips**.

## 📋 Prerequisites

✅ InstantDB library already installed (`@instantdb/react-native`)

## 🚀 Quick Setup (3 Steps)

### Step 1: Get Your APP_ID

1. Visit **https://instantdb.com/dash**
2. Sign up or log in
3. Create a new app (or use an existing one)
4. Copy your **APP_ID**

### Step 2: Configure InstantDB

1. Open `lib/instant.ts`
2. Replace `__YOUR_APP_ID__` with your actual APP_ID:

```typescript
const APP_ID = 'your-actual-app-id-here'; // Replace this!
```

### Step 3: Seed Your Database

You have two options to seed your database with workout and nutrition data:

#### Option A: Use the Seed Data Screen (Recommended)

1. Run your app
2. Navigate to the seed data screen by adding a button somewhere (e.g., in your profile or settings):

```tsx
import { router } from 'expo-router';

<TouchableOpacity onPress={() => router.push('/seed-data')}>
  <Text>Setup Database</Text>
</TouchableOpacity>
```

3. Tap "🌱 Seed All Data (Recommended)" button to seed both workouts and nutrition
4. Wait for confirmation

**Or** use the individual buttons:
- "💪 Seed Workouts Only" - Seeds 6 workouts with exercises
- "🍱 Seed Nutrition Only" - Seeds 6 nutrition tips

#### Option B: Call the Functions Directly

Add this code to any component and call it once:

```tsx
import { seedWorkouts } from '@/lib/seed-workouts';
import { seedNutrition } from '@/lib/seed-nutrition';

// Seed everything at once:
const handleSeedAll = async () => {
  try {
    await Promise.all([
      seedWorkouts(),
      seedNutrition(),
    ]);
    console.log('All data seeded successfully!');
  } catch (error) {
    console.error('Error seeding:', error);
  }
};

// Or seed individually:
await seedWorkouts();  // 6 workouts + 18 exercises
await seedNutrition(); // 6 nutrition tips
```

## 📦 What's Included

### Files Created

**Core Setup:**
1. **`lib/instant.ts`** - InstantDB initialization and schema

**Workouts:**
2. **`lib/seed-workouts.ts`** - Functions to seed and clear workout data
3. **`lib/useWorkouts.ts`** - Custom hooks for querying workouts

**Nutrition:**
4. **`lib/seed-nutrition.ts`** - Functions to seed and clear nutrition data
5. **`lib/useNutrition.ts`** - Custom hooks for querying nutrition tips

**UI:**
6. **`app/seed-data.tsx`** - UI screen for seeding/clearing all data
7. **`lib/SeedButton.tsx`** - Quick button component
8. **`lib/README.md`** - Detailed API documentation

### Database Schema

The schema includes three main entities:

```typescript
workouts {
  id: string
  title: string
  culturalName: string
  description: string
  duration: number
  difficulty: string ('beginner' | 'intermediate' | 'advanced')
  equipment: string[] (JSON)
  category: string ('strength' | 'cardio' | 'flexibility' | 'cultural')
  caloriesBurn: number
  imageUrl: string
  createdAt: number
}

exercises {
  id: string
  workoutId: string
  name: string
  reps?: string
  duration?: number
  instructions: string[] (JSON)
  videoUrl?: string
  imageUrl?: string
  order: number
}

nutritionTips {
  id: string
  title: string
  category: string ('dal-bhat' | 'momo' | 'traditional' | 'modern')
  description: string
  imageUrl: string
  tips: string[] (JSON)
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  createdAt: number
}
```

Plus a `workoutExercises` link connecting workouts to exercises (one-to-many).

## 🎯 Using the Data

### Workouts

#### Query All Workouts

```tsx
import { useWorkouts } from '@/lib/useWorkouts';

function WorkoutList() {
  const { isLoading, error, data } = useWorkouts();

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      {data.workouts.map((workout) => (
        <View key={workout.id}>
          <Text>{workout.title}</Text>
          <Text>{workout.culturalName}</Text>
          <Text>{workout.difficulty}</Text>
          {/* Exercises are automatically included */}
          {workout.exercises.map((exercise) => (
            <Text key={exercise.id}>{exercise.name}</Text>
          ))}
        </View>
      ))}
    </View>
  );
}
```

### Query a Single Workout

```tsx
import { useWorkout } from '@/lib/useWorkouts';

function WorkoutDetail({ id }: { id: string }) {
  const { isLoading, error, data } = useWorkout(id);

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  
  const workout = data?.workout;
  if (!workout) return <Text>Workout not found</Text>;

  return (
    <View>
      <Text>{workout.title}</Text>
      {workout.exercises.map((exercise) => (
        <Text key={exercise.id}>{exercise.name}</Text>
      ))}
    </View>
  );
}
```

### Query by Category

```tsx
import { useWorkoutsByCategory } from '@/lib/useWorkouts';

function CardioWorkouts() {
  const { data } = useWorkoutsByCategory('cardio');
  
  return (
    <View>
      {data?.workouts.map((workout) => (
        <Text key={workout.id}>{workout.title}</Text>
      ))}
    </View>
  );
}
```

#### Query by Difficulty

```tsx
import { useWorkoutsByDifficulty } from '@/lib/useWorkouts';

function BeginnerWorkouts() {
  const { data } = useWorkoutsByDifficulty('beginner');
  
  return (
    <View>
      {data?.workouts.map((workout) => (
        <Text key={workout.id}>{workout.title}</Text>
      ))}
    </View>
  );
}
```

### Nutrition Tips

#### Query All Nutrition Tips

```tsx
import { useNutrition } from '@/lib/useNutrition';

function NutritionList() {
  const { isLoading, error, data } = useNutrition();

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      {data.nutritionTips.map((tip) => (
        <View key={tip.id}>
          <Text>{tip.title}</Text>
          <Text>{tip.description}</Text>
          {tip.calories && <Text>Calories: {tip.calories}</Text>}
        </View>
      ))}
    </View>
  );
}
```

#### Query a Single Nutrition Tip

```tsx
import { useNutritionTip } from '@/lib/useNutrition';

function NutritionDetail({ id }: { id: string }) {
  const { isLoading, error, data } = useNutritionTip(id);

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  
  const tip = data?.tip;
  if (!tip) return <Text>Tip not found</Text>;

  return (
    <View>
      <Text>{tip.title}</Text>
      {tip.tips.map((tipText, i) => (
        <Text key={i}>• {tipText}</Text>
      ))}
    </View>
  );
}
```

#### Query by Category

```tsx
import { useNutritionByCategory } from '@/lib/useNutrition';

function DalBhatTips() {
  const { data } = useNutritionByCategory('dal-bhat');
  
  return (
    <View>
      {data?.nutritionTips.map((tip) => (
        <Text key={tip.id}>{tip.title}</Text>
      ))}
    </View>
  );
}
```

## 🔧 Utility Functions

### Workouts

#### Seed Workouts

```tsx
import { seedWorkouts } from '@/lib/seed-workouts';

await seedWorkouts();
// Returns: { success: true, count: 6 }
```

#### Clear Workouts

```tsx
import { clearWorkouts } from '@/lib/seed-workouts';

await clearWorkouts();
// Returns: { success: true, deleted: number }
```

### Nutrition

#### Seed Nutrition

```tsx
import { seedNutrition } from '@/lib/seed-nutrition';

await seedNutrition();
// Returns: { success: true, count: 6 }
```

#### Clear Nutrition

```tsx
import { clearNutrition } from '@/lib/seed-nutrition';

await clearNutrition();
// Returns: { success: true, deleted: number }
```

## 🎨 Data Structure

### Workouts

After seeding, you'll have **6 workouts** with a total of **18 exercises**:

1. **Momo-Maker Arms Workout** (Beginner, Strength) - 3 exercises
2. **Sherpa Stamina Cardio** (Intermediate, Cardio) - 3 exercises
3. **Namaste Flow Yoga** (Beginner, Flexibility) - 3 exercises
4. **Dal-Bhat Power Core** (Beginner, Strength) - 3 exercises
5. **Everest Legs Builder** (Intermediate, Strength) - 3 exercises
6. **Nepali Dance Cardio** (Beginner, Cultural) - 3 exercises

Each workout includes:
- Title and cultural name (Nepali)
- Description
- Duration, difficulty, category
- Calorie burn estimate
- Image URL
- List of exercises with instructions and video URLs

### Nutrition Tips

After seeding, you'll have **6 nutrition tips** across 4 categories:

1. **Lean Dal-Bhat Power Bowl** (dal-bhat) - 6 tips
2. **Healthy Momo Alternatives** (momo) - 7 tips
3. **Protein-Rich Sel Roti Breakfast** (traditional) - 7 tips
4. **Gundruk & Dhido Power Combo** (traditional) - 7 tips
5. **Smart Chiya (Tea) Habits** (modern) - 7 tips
6. **Nepali Snack Swaps** (modern) - 7 tips

Each tip includes:
- Title and category
- Description
- Image URL
- List of pro tips
- Optional nutrition info (calories, protein, carbs, fat)

## 📚 Resources

- [InstantDB Documentation](https://www.instantdb.com/docs)
- [React Native Guide](https://www.instantdb.com/docs/getting-started-react-native)
- [Writing Data](https://www.instantdb.com/docs/writing-data)
- [Reading Data](https://www.instantdb.com/docs/reading-data)
- [Modeling Data](https://www.instantdb.com/docs/modeling-data)

## 🐛 Troubleshooting

### "Invalid APP_ID" Error
- Make sure you replaced `__YOUR_APP_ID__` in `lib/instant.ts`
- Verify the APP_ID is correct from your InstantDB dashboard

### Data Not Showing Up
- Make sure you've run `seedWorkouts()` at least once
- Check the console for any error messages
- Verify you're using the correct query syntax

### Need to Reset Data
- Use the `clearWorkouts()` function
- Then run `seedWorkouts()` again

## 💡 Next Steps

1. ✅ Get your APP_ID from InstantDB dashboard
2. ✅ Configure `lib/instant.ts` with your APP_ID
3. ✅ Run seed functions once (use "Seed All Data" button)
4. ✅ Start using workouts and nutrition in your app!

You can now replace your mock data imports with real InstantDB queries. The data is synced in real-time across all devices!

## 🔄 Migrating from Mocks

### Workouts

**Before:**
```tsx
import { WORKOUTS } from '@/mocks/workouts';
const workouts = WORKOUTS;
```

**After:**
```tsx
import { useWorkouts } from '@/lib/useWorkouts';
const { data, isLoading } = useWorkouts();
const workouts = data?.workouts || [];
```

### Nutrition Tips

**Before:**
```tsx
import { NUTRITION_TIPS } from '@/mocks/nutrition';
const tips = NUTRITION_TIPS;
```

**After:**
```tsx
import { useNutrition } from '@/lib/useNutrition';
const { data, isLoading } = useNutrition();
const tips = data?.nutritionTips || [];
```

## ✅ What's Already Integrated

The following screens are now using InstantDB:

- ✅ **Home Screen** (`app/(tabs)/index.tsx`) - Workouts list
- ✅ **Workout Detail** (`app/workout/[id].tsx`) - Individual workout
- ✅ **Tiffin Screen** (`app/(tabs)/tiffin.tsx`) - Nutrition tips

All screens include proper loading states, error handling, and empty states with buttons to seed data.

That's it! Your app is now using a real-time database. 🎉

