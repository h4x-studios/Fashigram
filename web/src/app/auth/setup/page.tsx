"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../../supabase/config";
import styles from "../auth.module.css";

export default function SetupPage() {
    const { user, refreshProfile, loading: authLoading } = useAuth();
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/login");
        }
    }, [user, authLoading, router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanUsername = username.trim().toLowerCase();

        if (cleanUsername.length < 3) {
            setError("Username must be at least 3 characters.");
            return;
        }

        if (cleanUsername.startsWith("user_")) {
            setError("Username cannot start with 'user_'.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Check if username is taken in public.users
            const { data: existing, error: checkError } = await supabase
                .from('users')
                .select('id')
                .eq('username', cleanUsername);

            if (checkError && checkError.code !== 'PGRST116') {
                // handle unexpected error
            }

            if (existing && existing.length > 0) {
                setError("Username is already taken.");
                setLoading(false);
                return;
            }

            // Update or Insert profile
            // Note: Trigger might have already created a record with placeholder.
            // So we use upsert.
            const { error: updateError } = await supabase
                .from('users')
                .upsert({
                    id: user?.id,
                    username: cleanUsername,
                    email: user?.email,
                    avatar_url: user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`
                });

            if (updateError) {
                setError(updateError.message);
            } else {
                await refreshProfile();
                router.push("/");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <div className={styles.container}>Loading...</div>;
    if (!user) return null;

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.logo}>Fashigram</h1>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: '#333' }}>
                    Welcome to Fashigram!
                </h2>
                <p style={{ marginBottom: '24px', color: '#666', fontSize: '15px', lineHeight: '1.5' }}>
                    Choose a unique username to complete your account.
                </p>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSave} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="Pick a username"
                            className={styles.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? 'Finalizing...' : 'Complete Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}
