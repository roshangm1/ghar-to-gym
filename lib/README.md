# InstantDB Setup

This directory contains the InstantDB configuration and utilities for your app.

## Getting Started

### 1. Get Your APP_ID

1. Go to https://instantdb.com/dash
2. Create a new app or select an existing one
3. Copy your APP_ID
4. Replace `__YOUR_APP_ID__` in `lib/instant.ts` with your actual APP_ID

### 2. Seed Your Database

To populate your database with the example workout data, you can call the `seedWorkouts` function once.

#### Option A: Add a button in your app (Recommended for Development)

Add this to any screen (e.g., your home screen or a settings screen):

```tsx
import { seedWorkouts } from '@/lib/seed-workouts';
import { Button } from 'react-native';

// In your component:
<Button 
  title="Seed Workouts (Run Once)" 
  onPress={async () => {
    try {
      await seedWorkouts();
      alert('Workouts seeded successfully!');
    } catch (error) {
      alert('Error seeding workouts: ' + error.message);
    }
  }}
/>
```

#### Option B: Run it in useEffect (One-time setup)

```tsx
import { seedWorkouts } from '@/lib/seed-workouts';
import { useEffect } from 'react';

useEffect(() => {
  const initializeData = async () => {
    try {
      await seedWorkouts();
    } catch (error) {
      console.error('Failed to seed workouts:', error);
    }
  };
  
  initializeData();
}, []);
```

### 3. Query Your Data

After seeding, you can query workouts like this:

```tsx
import { db } from '@/lib/instant';

function WorkoutList() {
  const { isLoading, error, data } = db.useQuery({
    workouts: {
      exercises: {},
    },
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      {data.workouts.map((workout) => (
        <View key={workout.id}>
          <Text>{workout.title}</Text>
          <Text>{workout.culturalName}</Text>
          {workout.exercises.map((exercise) => (
            <Text key={exercise.id}>{exercise.name}</Text>
          ))}
        </View>
      ))}
    </View>
  );
}
```

## Utility Functions

### seedWorkouts()
Populates the database with all example workout data from `mocks/workouts.ts`.

### clearWorkouts()
Removes all workouts and exercises from the database. Useful if you need to reset and re-seed.

## Schema

The InstantDB schema includes:

- **workouts**: Main workout entities with title, description, duration, difficulty, etc.
- **exercises**: Individual exercises belonging to workouts
- **workoutExercises**: Link between workouts and exercises (one-to-many relationship)

## Resources

- [InstantDB Documentation](https://www.instantdb.com/docs)
- [React Native Guide](https://www.instantdb.com/docs/getting-started-react-native)
- [Writing Data](https://www.instantdb.com/docs/writing-data)
- [Reading Data](https://www.instantdb.com/docs/reading-data)

