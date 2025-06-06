// filepath: /Users/jessymartinez/VSC/chaitter/app/(auth)/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = () => {
    // Basic validation
    if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password.');
        return;
    }
    // --- Placeholder for actual login logic ---
    // In a real app, you'd call your backend here to authenticate the user.
    // For now, we'll simulate a successful login and navigate to the main app.
    console.log('Attempting login with:', { email, password });
    // Simulate successful login
    // Replace this with your actual auth logic and state management
    const FAKE_USER_AUTHENTICATED = true; 

    if (FAKE_USER_AUTHENTICATED) {
      // Navigate to the main part of the app (e.g., the 'tabs' layout)
      // Assuming your main app is within a group like (tabs) or directly at root after auth.
      router.replace('/(tabs)'); // Or wherever your main app content starts
    } else {
        Alert.alert('Login Failed', 'Invalid credentials.');
        }
        // --- End of placeholder ---
    };

    return (
        <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>Welcome Back!</ThemedText>
        <ThemedText style={styles.subtitle}>Log in to Chaitter</ThemedText>
        
        <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
        />
        <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
        />
        <Button title="Login" onPress={handleLogin} />
        {/* You can add a button to navigate to a sign-up screen later */}
        {/* <Button title="Don't have an account? Sign Up" onPress={() => router.push('/(auth)/signup')} /> */}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
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
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#fff', // Or use ThemedInput if you have one
    },
    // Add more styles as needed
});