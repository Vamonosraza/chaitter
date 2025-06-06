import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

/**
 * Signup Screen Component
 * 
 * Allows new users to create an account
 * Matches the styling of the login screen for consistency
 */
export default function SignupScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const validateForm = () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Name is required');
            return false;
        }

        if (!email.trim()) {
            Alert.alert('Error', 'Email is required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return false;
        }

        if (!password.trim()) {
            Alert.alert('Error', 'Password is required');
            return false;
        }

        if (password.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters long');
            return false;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSignup = async () => {
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Simulate signup process
            // In a real app, this would call your auth API
            await new Promise(resolve => setTimeout(resolve, 1500));

            Alert.alert(
                'Account Created',
                'Your account has been created successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/(auth)/login')
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Signup Failed', 'There was a problem creating your account. Please try again.');
            console.error('Signup error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>Start your language journey with Chaitter</Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color="#777" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Full Name"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                    testID="signup-name"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color="#777" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    testID="signup-email"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password (min. 8 characters)"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    testID="signup-password"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.passwordToggle}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#777"
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                    testID="signup-confirm-password"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={styles.passwordToggle}
                                >
                                    <Ionicons
                                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#777"
                                    />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
                                onPress={handleSignup}
                                disabled={isLoading}
                                testID="signup-button"
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.signupButtonText}>Create Account</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                                <Text style={styles.loginLink}>Log In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 12,
        height: 56,
        backgroundColor: '#f9f9f9',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#333',
    },
    passwordToggle: {
        padding: 8,
    },
    signupButton: {
        backgroundColor: '#4285F4',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    signupButtonDisabled: {
        backgroundColor: '#a4c0f4',
    },
    signupButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    dividerText: {
        color: '#666',
        paddingHorizontal: 16,
        fontSize: 14,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        color: '#666',
        fontSize: 14,
    },
    loginLink: {
        color: '#4285F4',
        fontSize: 14,
        fontWeight: '600',
    },
});