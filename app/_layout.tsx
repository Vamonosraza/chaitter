import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { Text, View } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/context/AuthProvider';

/**
 * Root layout component that provides global context and theming
 * This is the entry point for the application
 */
export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

/**
 * Inner navigation component that handles protected routes
 * This component has access to auth context and handles redirects
 */
function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  // Debug info that will appear in your app
  const DebugOverlay = () => (
    <View style={{ 
      position: 'absolute', top: 40, right: 10, backgroundColor: 'rgba(0,0,0,0.7)', 
      padding: 5, borderRadius: 5, zIndex: 9999 
    }}>
      <Text style={{ color: 'white', fontSize: 10 }}>
        Auth: {isLoading ? 'Loading' : user ? 'Logged In' : 'No User'}
      </Text>
    </View>
  );

  // Handle authentication-based navigation
  useEffect(() => {
    console.log("Auth state changed - User:", !!user, "Loading:", isLoading);
    
    // Skip redirection while auth is still loading
    if (isLoading) return;
    
    const inAuthGroup = segments[0] === '(auth)';
    console.log("Current route group:", segments[0], "In auth group:", inAuthGroup);

    if (!user && !inAuthGroup) {
      // Redirect to login if user is not authenticated and not already in auth group
      console.log("Redirecting to login page");
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect to main app if user is authenticated but on auth screen
      console.log("Redirecting to main app");
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar />
      <DebugOverlay />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
      </Stack>
    </ThemeProvider>
  );
}