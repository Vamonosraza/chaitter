import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        presentation: 'modal',
        ...Platform.select({
          ios: {
            // iOS-specific options
            headerTransparent: true,
            headerBlurEffect: 'regular',
          },
          default: {},
        }),
      }}
    />
  );
}
