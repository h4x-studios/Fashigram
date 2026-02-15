"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { demoStore, Circle, PostData } from '../../demo-store';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../circles.module.css';
import CircleIcon from '../../components/CircleIcon';
import PostTile from '../../feed/PostTile';
import { ArrowLeftIcon } from '../../components/Icons';

export default function CircleView({ circleId }: { circleId: string }) {
    const router = useRouter();
    const { user } = useAuth();
    const [circle, setCircle] = useState<Circle | null>(null);
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!circleId) return;
            setLoading(true);
            const [c, p] = await Promise.all([
                demoStore.getCircle(circleId),
                demoStore.getSpotlightPostsForCircle(circleId)
            ]);
            setCircle(c);
            setPosts(p);
            setLoading(false);
        };
        load();
    }, [circleId]);

    if (loading) return <div className={styles.container}>Loading circle...</div>;
    if (!circle) return <div className={styles.container}>Circle not found.</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <CircleIcon size={64} staticIcon />
                    <div>
                        <h1 className={styles.title}>{circle.name}</h1>
                        <p style={{ color: '#666', fontSize: 14 }}>{circle.description}</p>
                    </div>
                </div>
            </header>

            <div className={styles.sectionHeader}>Spotlight Feed</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {posts.length > 0 ? (
                    posts.map(post => (
                        <PostTile
                            key={post.id}
                            post={post}
                            onClick={() => router.push(`/post/${post.id}`)}
                        />
                    ))
                ) : (
                    <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: 40, color: '#999' }}>
                        No posts spotlighted in this circle yet.
                    </div>
                )}
            </div>

            <div style={{ height: 40 }}></div>
        </div>
    );
}
