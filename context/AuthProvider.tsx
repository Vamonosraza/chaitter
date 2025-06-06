import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Define the shape of our authentication context
type AuthContextType = {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    signUp: (email: string, password: string) => Promise<{ error: any | null }>;
    signIn: (email: string, password: string) => Promise<{ error: any | null }>;
    signOut: () => Promise<void>;
};

// Create context with undefined default (forces consumers to use useAuth hook)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider Component
 * 
 * Manages authentication state and provides auth methods to the entire app
 * Uses Supabase's auth API under the hood
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to auth context
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Subscribe to auth state changes (runs on mount)
    useEffect(() => {
        // Set up auth state listener
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            console.log(`Auth state changed: ${event}`);
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        // Cleanup subscription on unmount (prevents memory leaks)
        return () => {
            data.subscription.unsubscribe();
        };
    }, []);

    // Authentication methods
    const signUp = async (email: string, password: string) => {
        setIsLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        setIsLoading(false);
        return { error };
    };

    const signIn = async (email: string, password: string) => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setIsLoading(false);
        return { error };
    };

    const signOut = async () => {
        setIsLoading(true);
        await supabase.auth.signOut();
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, session, isLoading, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Custom hook to use the auth context
 * 
 * Provides a type-safe way to access authentication state and methods
 * Throws an error if used outside of AuthProvider
 * 
 * @returns {AuthContextType} The auth context value
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
