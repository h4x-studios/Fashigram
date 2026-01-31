"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { demoStore, User, PostData } from "../../demo-store";
import { useAuth } from "../../contexts/AuthContext";
import ProfileView from "../ProfileView";
import styles from "../profile.module.css";

// Force valid seeding before render logic
if (typeof window !== 'undefined' && demoStore.getAllPosts().length === 0) {
    demoStore.seedDemoPosts();
}

export default function Page({ params }: { params: Promise<{ username: string }> }) {
    const { username } = use(params);
    const router = useRouter();
    const { user: authUser } = useAuth(); // Get logged-in user from Supabase
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Ensure seeding is done
        if (demoStore.getAllPosts().length === 0) {
            demoStore.seedDemoPosts();
        }

        const decodedUsername = decodeURIComponent(username);
        let targetUsername = decodedUsername;

        // ALIAS: "you" (case-insensitive) -> Logged-in user
        if (decodedUsername.toLowerCase() === 'you' && authUser) {
            targetUsername = authUser.username;
        }

        let userData = demoStore.getUser(targetUsername);

        // If user doesn't exist in demo-store but matches logged-in user, create them
        // Note: We check against targetUsername here (which is authUser.username if aliased)
        if (!userData && authUser && authUser.username === targetUsername) {
            // Create demo-store entry for the logged-in user
            demoStore.addUser({
                id: authUser.id,
                username: authUser.username,
                avatarUrl: authUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.username}`,
                bio: authUser.bio || 'My personal fashion archive.'
            });
            userData = demoStore.getUser(targetUsername);
        }

        if (userData) {
            setUser(userData);
            setPosts(demoStore.getPostsByUsername(targetUsername));
        }
        setLoading(false);
    }, [username, authUser]);

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
