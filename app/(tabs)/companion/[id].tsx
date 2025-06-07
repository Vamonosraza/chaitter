import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function CompanionDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [companion, setCompanion] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: '',
        description: '',
        language_code: '',
        system_prompt: '',
        avatar_url: '',
        voice_id: '',
    });

    // Fetch companion details
    useEffect(() => {
        const fetchCompanion = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('ai_companion')
                .select('*')
                .eq('id', id)
                .single();
            if (error) {
                Alert.alert('Error', 'Could not load companion.');
                router.back();
            } else {
                setCompanion(data);
                setForm({
                    name: data.name || '',
                    description: data.description || '',
                    language_code: data.language_code || '',
                    system_prompt: data.system_prompt || '',
                    avatar_url: data.avatar_url || '',
                    voice_id: data.voice_id || '',
                });
            }
            setLoading(false);
        };
        if (id) fetchCompanion();
    }, [id]);

    const handleSave = async () => {
        setLoading(true);
        const { error } = await supabase
            .from('ai_companion')
            .update(form)
            .eq('id', id);
        setLoading(false);
        if (error) {
            Alert.alert('Error', error.message || 'Could not update companion.');
        } else {
            Alert.alert('Success', 'Companion updated!');
            setEditing(false);
            setCompanion({ ...companion, ...form });
        }
    };

    const handleDelete = async () => {
        Alert.alert('Delete', 'Are you sure you want to delete this companion?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: async () => {
                    setLoading(true);
                    const { error } = await supabase.from('ai_companion').delete().eq('id', id);
                    setLoading(false);
                    if (error) {
                        Alert.alert('Error', error.message || 'Could not delete companion.');
                    } else {
                        Alert.alert('Deleted', 'Companion deleted.', [
                            { text: 'OK', onPress: () => router.replace('/(tabs)') }
                        ]);
                    }
                }
            }
        ]);
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#4285F4" />
            </View>
        );
    }

    if (!companion) {
        return (
            <View style={styles.centered}>
                <Text>Companion not found.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{editing ? 'Edit' : 'View'} AI Companion</Text>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={form.name}
                    editable={editing}
                    onChangeText={v => setForm(f => ({ ...f, name: v }))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    value={form.description}
                    editable={editing}
                    onChangeText={v => setForm(f => ({ ...f, description: v }))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Language Code"
                    value={form.language_code}
                    editable={editing}
                    onChangeText={v => setForm(f => ({ ...f, language_code: v }))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="System Prompt"
                    value={form.system_prompt}
                    editable={editing}
                    onChangeText={v => setForm(f => ({ ...f, system_prompt: v }))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Avatar URL"
                    value={form.avatar_url}
                    editable={editing}
                    onChangeText={v => setForm(f => ({ ...f, avatar_url: v }))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Voice ID"
                    value={form.voice_id}
                    editable={editing}
                    onChangeText={v => setForm(f => ({ ...f, voice_id: v }))}
                />
                {editing ? (
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Ionicons name="save-outline" size={20} color="#fff" />
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
                        <Ionicons name="create-outline" size={20} color="#fff" />
                        <Text style={styles.saveButtonText}>Edit</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={20} color="#fff" />
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#fff', padding: 24 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4285F4',
        borderRadius: 12,
        paddingVertical: 14,
        marginTop: 8,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4dabf7',
        borderRadius: 12,
        paddingVertical: 14,
        marginTop: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dc3545',
        borderRadius: 12,
        paddingVertical: 14,
        marginTop: 16,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});