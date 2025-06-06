import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
    };
    checkAuth();
  }, []);

  return { isAuthenticated
, setIsAuthenticated };
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!loaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && inAuthGroup) {
      // If the user is authenticated and in the auth group, redirect to home.
      router.replace('/');
    } else if (!isAuthenticated && !inAuthGroup) {
      // If the user is not authenticated and not in the auth group, redirect to login.
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, loaded, segments, router]);



  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  if ((isAuthenticated && segments[0] === '(auth)') || (!isAuthenticated && segments[0] !== '(auth)')) {
    // If the user is authenticated and in the auth group, or not authenticated and not in the auth group, we don't render the layout.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
