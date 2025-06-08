import * as ExpoRandom from 'expo-crypto';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';

// Polyfill for crypto.getRandomValues for uuid in Expo managed workflow
if (typeof global.crypto === 'undefined') {
    global.crypto = {} as any;
}
if (typeof global.crypto.getRandomValues === 'undefined') {
    global.crypto.getRandomValues = function(array) {
        if (array == null) {
            throw new TypeError('Expected input to be an ArrayBufferView');
        }
        const bytes = ExpoRandom.getRandomBytes(array.byteLength);
        const uint8Array = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
        for (let i = 0; i < bytes.length; i++) {
            uint8Array[i] = bytes[i];
        }
        return array;
    };
}

export default function CreateCompanionScreen() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'English', value: 'en' },
        { label: 'Deutsch', value: 'de' },
        { label: 'French', value: 'fr' },
    ]);
    const { user } = useAuth();
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [languageCode, setLanguageCode] = useState('');
    const [systemPrompt, setSystemPrompt] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [voiceId, setVoiceId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        if (!name.trim()) {
            Alert.alert('Validation Error', 'Name is required.');
            return false;
        }
        if (!languageCode.trim()) {
            Alert.alert('Validation Error', 'Language code is required.');
            return false;
        }
        return true;
    };

    const handleCreate = async () => {

        if (!validateForm()) return;
        setIsLoading(true);
        try {
            const id = uuidv4();
            console.log('Creating AI Companion with ID:', id);
            const { error } = await supabase.from('ai_companion').insert({
                id,
                name,
                description,
                language_code: languageCode,
                system_prompt: systemPrompt,
                avatar_url: avatarUrl || null,
                voice_id: voiceId || null,
                is_active: 'true', // or null/false as needed
                created_at: new Date().toISOString(),
                user_id: user?.id || null, // Ensure user ID is set if available
            });
            if (error) {
                console.error('Error creating companion:', error.message);
                Alert.alert('Error', error.message || 'Could not create AI companion.');
                return;
            }
            Alert.alert('Success', 'AI Companion created!', [
                { text: 'OK', onPress: () => router.replace('/(tabs)') }
            ]);
        } catch (err) {
            console.error('Unexpected error:', err);
            Alert.alert('Error', 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    // Update languageCode when value changes
    React.useEffect(() => {
        if (value) setLanguageCode(value);
    }, [value]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#fff' }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#fff' }}>
                <Text style={styles.title}>Create AI Companion</Text>
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Name *"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                    />
                    {/* DropDownPicker is NOT inside a ScrollView to avoid VirtualizedList warning */}
                    <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        placeholder="Select a language..."
                        style={styles.label}
                        containerStyle={{ marginBottom: 16 }}
                        zIndex={1000}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="System Prompt (optional)"
                        value={systemPrompt}
                        onChangeText={setSystemPrompt}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Avatar URL (optional)"
                        value={avatarUrl}
                        onChangeText={setAvatarUrl}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Voice ID (optional)"
                        value={voiceId}
                        onChangeText={setVoiceId}
                    />
                    <TouchableOpacity
                        style={[styles.createButton, isLoading && styles.createButtonDisabled]}
                        onPress={handleCreate}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                                <Text style={styles.createButtonText}>Create</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#fff', padding: 24 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#4285F4', marginBottom: 24, textAlign: 'center' },
    form: { width: '100%' },
    input: {
        borderWidth: 1,
        borderColor: '#000', // Changed to black to match DropDownPicker
        borderRadius: 10,
        padding: 14,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333',
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4285F4',
        borderRadius: 12,
        paddingVertical: 14,
        marginTop: 8,
    },
    createButtonDisabled: {
        backgroundColor: '#a4c0f4',
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});
