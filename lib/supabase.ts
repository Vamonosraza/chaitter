import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

// Access environment variables with the EXPO_PUBLIC_ prefix
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/**
 * AsyncStorageAdapter: Interface for Supabase to use AsyncStorage
 * Provides a simple key-value storage for auth tokens
 *
 * Time complexity: O(1) for all operations
 */

// Validate environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables. Check your .env file.");
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // Must be false for React Native
    },
});