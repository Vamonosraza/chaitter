import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

/**
 * Login screen component
 * Simple implementation to test navigation
 */
export default function LoginScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Chaitter!</Text>
            <Text style={styles.subtitle}>Learn languages with AI companions</Text>

            <Button
                title="Go to Main App (Temporary)"
                onPress={() => router.replace('/(tabs)')}
            />

            <View style={styles.linkContainer}>
                <Text>Don't have an account? </Text>
                <Button
                    title="Sign Up"
                    onPress={() => router.push('/(auth)/signup')}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#666',
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
});