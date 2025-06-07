import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';

export default function CreateCompanionScreen() {
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

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
                <Text style={styles.title}>Create AI Companion</Text>
            </SafeAreaView>
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
                <TextInput
                    style={styles.input}
                    placeholder="Language Code (e.g. 'es', 'fr') *"
                    value={languageCode}
                    onChangeText={setLanguageCode}
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#fff', padding: 24 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#4285F4', marginBottom: 24, textAlign: 'center' },
    form: { width: '100%' },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 14,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
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
