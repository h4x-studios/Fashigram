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
    const [isEditing, setIsEditing] = useState(false);
    const [editDesc, setEditDesc] = useState('');

    useEffect(() => {
        const load = async () => {
            if (!circleId) return;
            setLoading(true);
            const [c, p] = await Promise.all([
                demoStore.getCircle(circleId),
                demoStore.getSpotlightPostsForCircle(circleId)
            ]);
            setCircle(c);
            setEditDesc(c?.description || '');
            setPosts(p);
            setLoading(false);
        };
        load();
    }, [circleId]);

    const handleUpdate = async () => {
        if (!circle || !user) return;
        const success = await demoStore.updateCircle(circle.id, circle.name, editDesc);
        if (success) {
            setCircle({ ...circle, description: editDesc });
            setIsEditing(false);
        } else {
            alert("Failed to update circle description.");
        }
    };

    if (loading) return <div className={styles.container}>Loading circle...</div>;
    if (!circle) return <div className={styles.container}>Circle not found.</div>;

    const isOwner = user?.id === circle.owner_user_id;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <CircleIcon size={64} staticIcon />
                    <div style={{ flex: 1 }}>
                        <h1 className={styles.title}>{circle.name}</h1>
                        {isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                                <textarea
                                    value={editDesc}
                                    onChange={e => setEditDesc(e.target.value)}
                                    className={styles.editInput}
                                    autoFocus
                                    placeholder="Enter circle description..."
                                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', minHeight: '60px' }}
                                />
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button onClick={handleUpdate} style={{ background: '#E91E63', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Save</button>
                                    <button onClick={() => setIsEditing(false)} style={{ background: '#eee', color: '#666', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => isOwner && setIsEditing(true)}
                                style={{ cursor: isOwner ? 'pointer' : 'default' }}
                            >
                                <p style={{ color: '#666', fontSize: 14 }}>{circle.description || 'No description'}</p>
                                {isOwner && <span style={{ fontSize: '10px', color: '#E91E63', fontWeight: 'bold' }}>EDIT DESCRIPTION</span>}
                            </div>
                        )}
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
