"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../supabase/config';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Application specific user interface (merging Auth User + Profile Table)
export interface AppUser {
    id: string;
    email?: string;
    username: string; // From metadata or specific table
    avatar_url?: string;
    bio?: string;
}

interface AuthContextType {
    user: AppUser | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => { },
    refreshProfile: async () => { }
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Helper to construct AppUser from Session + DB Profile
    async function fetchUserProfile(authUser: SupabaseUser) {
        try {
            // 1. Try fetching from 'users' table
            const { data: profile, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (profile) {
                setUser({
                    id: authUser.id,
                    email: authUser.email,
                    username: profile.username || authUser.user_metadata?.username || 'user',
                    avatar_url: profile.avatar_url,
                    bio: profile.bio
                });
            } else {
                // Fallback if no profile record exists yet (e.g. freshly signed up via Auth only)
                // Ideally we create the record on signup, but being robust is good.
                setUser({
                    id: authUser.id,
                    email: authUser.email,
                    username: authUser.user_metadata?.preferred_username || authUser.email?.split('@')[0] || 'user',
                    avatar_url: authUser.user_metadata?.avatar_url,
                    bio: ''
                });
            }
        } catch (e) {
            console.error("Error fetching profile", e);
            // Minimal fallback
            setUser({
                id: authUser.id,
                email: authUser.email,
                username: 'user',
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // Check active session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchUserProfile(session.user);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchUserProfile(session.user);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    async function signOut() {
        await supabase.auth.signOut();
        setUser(null);
    }

    async function refreshProfile() {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            await fetchUserProfile(session.user);
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
