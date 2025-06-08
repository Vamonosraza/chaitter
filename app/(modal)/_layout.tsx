import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function ModalLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false, // Hide the header completely
                ...Platform.select({
                    ios: {
                        // iOS-specific options
                        contentStyle: {
                            backgroundColor: '#fff',
                        }
                    },
                    default: {},
                }),
            }}
        />
    );
}
