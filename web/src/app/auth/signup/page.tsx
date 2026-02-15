"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../supabase/config';
import styles from '../auth.module.css';

import { useAuth } from '../../contexts/AuthContext';

export default function SignupPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // Redirect if already logged in
    useEffect(() => {
        if (user && !authLoading) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        // Basic validation
        if (username.length < 3) {
            setError("Username must be at least 3 characters.");
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username, // Pass username to metadata
                    },
                },
            });

            if (error) {
                setError(error.message);
            } else if (data.session) {
                // If auto-confirm is on (session exists), redirect home
                router.push('/');
                router.refresh();
            } else if (data.user) {
                // User created but no session => Email confirmation required
                setMessage("Check your email for the confirmation link.");
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', color: '#555' }}>Create Account</h2>

                {error && <div className={styles.error}>{error}</div>}

                {message ? (
                    <div style={{ padding: '24px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '8px' }}>
                        <p>{message}</p>
                        <div style={{ marginTop: '16px' }}>
                            <Link href="/auth/login" className={styles.link}>Back to Login</Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSignup} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                placeholder="Username (unique)"
                                className={styles.input}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <input
                                type="email"
                                placeholder="Email address"
                                className={styles.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <input
                                type="password"
                                placeholder="Password (min 6 chars)"
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <button type="submit" className={styles.submitButton} disabled={loading}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>
                )}

                {!message && (
                    <div className={styles.footer}>
                        Already have an account?
                        <Link href="/auth/login" className={styles.link}>Log in</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
