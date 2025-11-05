# React Compiler Optimization Guidelines

## Overview

This document provides guidelines for writing React components optimized for the React Compiler. The React Compiler automatically optimizes components, but it works best when components are small, focused, and independent.

## Core Principles

### 1. **Always Extract Independent Components**

**Rule**: Any section of a screen/component that can function independently should be extracted into its own component file.

**Why**: React Compiler can better optimize smaller, focused components. Independent components can be memoized and re-rendered only when their specific props change.

**Examples of Independent Sections**:
- Loading states
- Error states
- Headers with images and titles
- Description text
- Meta information displays (stats, badges, etc.)
- Equipment lists
- Action buttons/footers
- Form sections
- Lists of items
- Individual list items

### 2. **Component Structure Guidelines**

#### ✅ DO: Extract Independent Sections

```tsx
// ✅ GOOD: Separate components for each section
<WorkoutHeader workout={workout} />
<WorkoutDescription description={workout.description} />
<ExerciseMeta duration={duration} caloriesBurn={calories} />
<EquipmentSection equipment={equipment} />
<WorkoutFooter onStart={handleStart} />
```

#### ❌ DON'T: Keep Everything in One Component

```tsx
// ❌ BAD: Everything in one large component
<View>
  <Image source={{ uri: workout.imageUrl }} />
  <Text>{workout.title}</Text>
  <Text>{workout.description}</Text>
  {/* ... 100+ lines of JSX ... */}
</View>
```

### 3. **Component Size Guidelines**

- **Maximum component size**: ~200 lines of JSX/component logic
- **If a component exceeds 200 lines**: Extract independent sections
- **If a component has multiple responsibilities**: Split into separate components

### 4. **Props Interface Guidelines**

#### ✅ DO: Pass Only Necessary Props

```tsx
// ✅ GOOD: Component receives only what it needs
function WorkoutHeader({ workout }: { workout: Workout }) {
  return (
    <>
      <Image source={{ uri: workout.imageUrl }} />
      <Text>{workout.title}</Text>
    </>
  );
}
```

#### ❌ DON'T: Pass Entire Context Objects

```tsx
// ❌ BAD: Passing entire context or parent state
function WorkoutHeader({ 
  workout, 
  user, 
  theme, 
  navigation,
  // ... many unrelated props
}) {
  // Component doesn't need all of these
}
```

### 5. **State Management Guidelines**

- **Local state**: Keep state in the smallest component that needs it
- **Shared state**: Lift state to the nearest common ancestor
- **Avoid**: Passing state through many components just to reach a deep child

### 6. **Component Organization**

#### Directory Structure

```
components/
  [feature-name]/
    ComponentName.tsx
    AnotherComponent.tsx
    index.ts  // Re-exports for clean imports
```

#### Example: Workout Components

```
components/
  workout/
    LoadingState.tsx
    ErrorState.tsx
    WorkoutHeader.tsx
    WorkoutDescription.tsx
    ExerciseMeta.tsx
    EquipmentSection.tsx
    ExercisesList.tsx
    ExerciseVideo.tsx
    WorkoutFooter.tsx
    index.ts
```

### 7. **Component Extraction Checklist**

When creating a new screen or component, ask yourself:

- [ ] Can this section work independently? → Extract it
- [ ] Does this section have its own styling? → Extract it
- [ ] Does this section have its own logic? → Extract it
- [ ] Will this section be reused elsewhere? → Extract it
- [ ] Is the main component >200 lines? → Extract sections
- [ ] Are there multiple distinct visual sections? → Extract each

### 8. **Common Patterns to Extract**

#### Loading States
```tsx
// ✅ Extract to: components/[feature]/LoadingState.tsx
export function LoadingState() {
  return <ActivityIndicator />;
}
```

#### Error States
```tsx
// ✅ Extract to: components/[feature]/ErrorState.tsx
export function ErrorState({ error }: { error: Error | null }) {
  return <Text>Error: {error?.message}</Text>;
}
```

#### Headers
```tsx
// ✅ Extract to: components/[feature]/FeatureHeader.tsx
export function FeatureHeader({ title, image }: Props) {
  return (
    <>
      <Image source={{ uri: image }} />
      <Text>{title}</Text>
    </>
  );
}
```

#### Lists
```tsx
// ✅ Extract to: components/[feature]/ItemsList.tsx
export function ItemsList({ items, onItemPress }: Props) {
  return items.map(item => <Item key={item.id} {...item} />);
}
```

#### Footers/Action Buttons
```tsx
// ✅ Extract to: components/[feature]/FeatureFooter.tsx
export function FeatureFooter({ onAction, isDisabled }: Props) {
  return <TouchableOpacity onPress={onAction} disabled={isDisabled}>...</TouchableOpacity>;
}
```

### 9. **When NOT to Extract**

While extraction is generally good, don't over-extract:

- ❌ Don't extract single `<Text>` elements
- ❌ Don't extract components used only once if they're <20 lines
- ❌ Don't extract if it makes the code harder to understand
- ❌ Don't extract if props would become too complex

### 10. **Testing Component Independence**

After extracting a component, verify:
- ✅ Component can be rendered in isolation (with mock props)
- ✅ Component doesn't depend on parent component's internal state
- ✅ Component receives all data via props
- ✅ Component has clear, typed props interface

## Implementation Examples

### Before (Large Monolithic Component)

```tsx
// ❌ BAD: 500+ lines, everything in one component
export default function WorkoutDetailScreen() {
  // ... lots of state and logic ...
  
  if (isLoading) {
    return (
      <View>
        <ActivityIndicator />
        <Text>Loading...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View>
      <Image source={{ uri: workout.imageUrl }} />
      <Text>{workout.title}</Text>
      {/* ... 400+ more lines ... */}
    </View>
  );
}
```

### After (Optimized with Extracted Components)

```tsx
// ✅ GOOD: Small, focused main component
export default function WorkoutDetailScreen() {
  // ... state and logic ...
  
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  
  return (
    <View>
      <ScrollView>
        <WorkoutHeader workout={workout} />
        <WorkoutDescription description={workout.description} />
        <ExerciseMeta {...metaProps} />
        <EquipmentSection equipment={workout.equipment} />
        <ExercisesList {...exercisesProps} />
      </ScrollView>
      <WorkoutFooter {...footerProps} />
    </View>
  );
}
```

## Benefits of This Approach

1. **Better React Compiler Optimization**: Smaller components are easier to optimize
2. **Improved Reusability**: Components can be used in other screens
3. **Easier Testing**: Smaller components are easier to test in isolation
4. **Better Code Organization**: Clear separation of concerns
5. **Easier Maintenance**: Changes to one section don't affect others
6. **Better Performance**: Only re-render what actually changed

## Quick Reference

### Component Extraction Decision Tree

```
Is this section >50 lines?
├─ YES → Extract it
└─ NO → Is it used in multiple places?
    ├─ YES → Extract it
    └─ NO → Is it independent (has its own state/logic/styling)?
        ├─ YES → Extract it
        └─ NO → Keep it inline (if it's simple)
```

## Enforcement

- **Code Review**: Check that screens follow these guidelines
- **Linting**: Consider adding custom rules to detect large components
- **Documentation**: Reference this document in PR templates

## Questions?

If unsure whether to extract a component:
1. Ask: "Can this work independently?"
2. Ask: "Will this be reused?"
3. Ask: "Is the parent component >200 lines?"
4. If any answer is "yes", extract it!

---

**Last Updated**: 2024
**Related**: React Compiler documentation, React best practices

