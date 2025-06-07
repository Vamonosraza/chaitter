import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

type AICompanion = {
  id: string;
  name: string;
  description: string;
  language_code: string;
  system_prompt: string;
  avatar_url: string | null;
  voice_id: string | null;
};

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [companions, setCompanions] = useState<AICompanion[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's AI companions from Supabase
  useEffect(() => {
    const fetchCompanions = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('ai_companions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching companions:', error.message);
      } else {
        setCompanions(data || []);
      }
      setLoading(false);
    };

    fetchCompanions();
  }, [user]);

  // Handler for creating a new AI companion
  const handleCreate = () => {
    router.push('/(tabs)/create-companion');
  };

  // Handler for viewing a companion
  const handleViewCompanion = (companionId: string) => {
    router.push(`/(tabs)/companion/${companionId}`);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
        <Text style={styles.title}>ChAItter</Text>
      </SafeAreaView>
      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.createButtonText}>Create New AI Companion</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Your AI Companions</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4285F4" style={{ marginTop: 24 }} />
      ) : companions.length === 0 ? (
        <Text style={styles.emptyText}>No AI companions yet. Tap "Create" to get started!</Text>
      ) : (
        <FlatList
          data={companions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.companionCard}
              onPress={() => handleViewCompanion(item.id)}
            >
              <View style={styles.avatarCircle}>
                {item.avatar_url ? (
                  <Ionicons name="person-circle" size={40} color="#4285F4" />
                ) : (
                  <Ionicons name="person-circle-outline" size={40} color="#bbb" />
                )}
              </View>
              <View style={styles.companionInfo}>
                <Text style={styles.companionName}>{item.name || 'Unnamed Companion'}</Text>
                <Text style={styles.companionDesc} numberOfLines={1}>
                  {item.description || 'No description'}
                </Text>
                <Text style={styles.companionLang}>{item.language_code?.toUpperCase() || 'N/A'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#bbb" />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#4285F4', marginBottom: 24, textAlign: 'center' },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 32,
    alignSelf: 'center',
  },
  createButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  emptyText: { color: '#888', fontSize: 16, textAlign: 'center', marginTop: 32 },
  companionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f8fa',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarCircle: { marginRight: 16 },
  companionInfo: { flex: 1 },
  companionName: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  companionDesc: { fontSize: 14, color: '#666', marginTop: 2 },
  companionLang: { fontSize: 12, color: '#888', marginTop: 2 },
});