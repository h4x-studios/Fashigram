"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { demoStore, User, PostData } from "../../demo-store";
import { useAuth } from "../../contexts/AuthContext";
import ProfileView from "../ProfileView";
import styles from "../profile.module.css";

export default function Page({ params }: { params: Promise<{ username: string }> }) {
    const { username } = use(params);
    const router = useRouter();
    const { user: authUser } = useAuth(); // Get logged-in user from Supabase
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const decodedUsername = decodeURIComponent(username);
            let targetUsername = decodedUsername;

            // ALIAS: "you" (case-insensitive) -> Logged-in user
            if (decodedUsername.toLowerCase() === 'you' && authUser) {
                targetUsername = authUser.username;
            } else if (decodedUsername.toLowerCase() === 'you' && !authUser) {
                // Not logged in trying to view 'you'
                router.push('/auth/login');
                return;
            }

            let userData = await demoStore.getUser(targetUsername);

            // "You" fallback if missing in DB but exists in Auth (shouldn't happen with proper seed, but for robustness)
            if (!userData && authUser && authUser.username === targetUsername) {
                // We rely on AuthContext if DB lookup fails?
                // Or we can construct a transient User object.
                userData = {
                    id: authUser.id,
                    username: authUser.username,
                    avatarUrl: authUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.username}`,
                    bio: authUser.bio || ''
                };
            }

            if (userData) {
                const userPosts = await demoStore.getPostsByUsername(targetUsername);
                setUser(userData);
                setPosts(userPosts);
            }
            setLoading(false);
        };

        loadData();
    }, [username, authUser, router]);

    if (loading) {
        return (
            <div className={styles.centerMessage}>
                <p>Loading archive...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={styles.container}>
                <header className={styles.header}>
                    <button className={styles.backButton} onClick={() => router.push('/')}>
                        ←
                    </button>
                    <h1 className={styles.headerTitle}>Not Found</h1>
                </header>
                <div className={styles.centerMessage}>
                    <p>User not found.</p>
                    <button onClick={() => router.push('/')} style={{ textDecoration: 'underline' }}>
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    const isOwner = authUser?.username === user.username;

    return <ProfileView user={user} posts={posts} isOwner={isOwner} />;
}
