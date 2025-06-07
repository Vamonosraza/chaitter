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
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/lib/supabase';

/**
 * Signup Screen Component
 * 
 * Allows new users to create an account
 * Matches the styling of the login screen for consistency
 */
export default function SignupScreen() {
    // useState is when the component needs to manage its own state. In this case we start name as an empty string. When setName is called, it will update 'name' and re-render the component (e.g. when the user types in the input field) and show the updated value.
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const { signUp, isLoading } = useAuth(); // Use the auth hook

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


        try {
            console.log('Attempting to sign up with:', email);
            
            // First sign up the user. I said error because the signup function returns an error if the email is already in use or the password is too weak. Look at signUp function in context/AuthProvider.tsx
            const { error } = await signUp(email, password);

            // The error is a SupabaseAuthError with the properties message, code, and details. if error is not null, then the signup failed because the email is already in use or the password is too weak.
            // If error is null, then the signup was successful and the user needs to confirm their email
            if (error) {
                console.error('Signup error:', error.message);
                Alert.alert('Signup Failed', error.message || 'There was a problem creating your account. Please try again.');
                return;
            }

            // Store the name for later - when the user confirms their email
            // You'll need to create this table in Supabase
            try {
                // We need to get the current user ID 
                const { data: { user } } = await supabase.auth.getUser();
                
                if (user) {
                    console.log('User signed up:', user.id);
                    // Store additional user data in profiles table
                    const { error: profileError } = await supabase
                        .from('profiles')
                        // Upsert is used to insert or update the profile. This happens here because the user has just signed up and we want to create their profile.
                        .upsert({ 
                            id: user.id,
                            full_name: name,
                            // Use email as temporary username (make it unique by adding random characters)
                            username: email.split('@')[0] + Math.floor(Math.random() * 1000),
                            // These fields can be updated later in user settings
                            created_at: new Date(),
                            updated_at: new Date()
                        });
                        
                    if (profileError) {
                        console.error('Profile update error:', profileError.message);
                        console.error('Profile updated error details:', JSON.stringify(profileError))
                    }
                    else{
                        console.log('Profile updated successfully for user:', user.id);
                    }
                }
            } catch (profileError) {
                console.error('Profile update error:', profileError);
                // Continue even if profile update fails
            }

            Alert.alert(
                'Account Created',
                'Please check your email to confirm your account.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/(auth)/login')
                    }
                ]
            );
        } catch (error) {
            console.error('Unexpected signup error:', error);
            Alert.alert('Signup Failed', 'An unexpected error occurred. Please try again.');
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