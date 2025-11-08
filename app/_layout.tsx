import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "@/contexts/AppContext";
import { KeyboardProvider } from "react-native-keyboard-controller";
import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
  Theme,
} from "@react-navigation/native";
import colors from "@/constants/colors";
import { enableFreeze } from "react-native-screens";

enableFreeze(true);

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const lightTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.light.primary,
      background: colors.light.background,
      card: colors.light.card,
      text: colors.light.text,
      border: colors.light.border,
    },
  }

  const darkTheme: Theme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: colors.dark.primary,
      background: colors.dark.background,
      card: colors.dark.card,
    },
  }
  return (
    <ThemeProvider value={colorScheme === "dark" ? darkTheme : lightTheme}>
      <KeyboardProvider>
      <Stack screenOptions={{ headerBackTitle: "Back", headerBackButtonDisplayMode: "minimal", headerShadowVisible: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, headerShadowVisible: false }} />
        <Stack.Screen 
          name="workout/[id]" 
          options={{ 
            headerShown: true,
            title: "Workout Details",
            presentation: "card",
          }} 
        />
        <Stack.Screen 
          name="workout/[id]/videos"
          options={{
            headerShown: false,
            presentation: "card",
          }}
        />
        <Stack.Screen 
          name="weight-setup"
          options={{
            presentation: "formSheet",
            sheetGrabberVisible: true,
            headerShown: false,
            
          }}
        />
        <Stack.Screen 
          name="goals/[id]"
          options={{
            headerShown: true,
            headerBackButtonDisplayMode: "minimal",
            title: "Fitness Program Details",
          }}
        />
        <Stack.Screen 
          name="goals/index"
          options={{
            presentation: "card",
            headerShown: true,
            title: "Fitness Programs",
            headerBackButtonDisplayMode: "minimal",
          }}
        />
        <Stack.Screen 
          name="seed-data"
          options={{
            presentation: "card",
            headerShown: true,
            title: "Seed Database",
            headerBackButtonDisplayMode: "minimal",
          }}
        />
        <Stack.Screen 
          name="auth"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="post/[id]/comments"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack>
      </KeyboardProvider>
      </ThemeProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AppProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </AppProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
