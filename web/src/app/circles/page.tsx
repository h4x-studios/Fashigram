"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { demoStore, Circle, CircleMember } from '../demo-store';
import styles from './circles.module.css';
import CircleIcon from '../components/CircleIcon';
import { PlusIcon } from '../components/Icons';
import CreateCircleModal from '../components/CreateCircleModal';

export default function CirclesPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [circles, setCircles] = useState<Circle[]>([]);
    const [invites, setInvites] = useState<CircleMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            setLoading(true);

            try {
                // Parallel load
                const [myCircles, myInvites] = await Promise.all([
                    demoStore.getCirclesForUser(user.id),
                    demoStore.getCircleMembers(user.id, 'INVITED')
                ]);

                setCircles(myCircles);
                setInvites(myInvites);
            } catch (err) {
                console.error("Error loading circles:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user]);

    const [editingCircleId, setEditingCircleId] = useState<string | null>(null);
    const [editDesc, setEditDesc] = useState('');

    const handleUpdateCircle = async (circleId: string, name: string) => {
        if (!user) return;
        const success = await demoStore.updateCircle(circleId, name, editDesc);
        if (success) {
            setCircles(prev => prev.map(c => c.id === circleId ? { ...c, description: editDesc } : c));
            setEditingCircleId(null);
        } else {
            alert("Failed to update circle.");
        }
    };

    if (!user && !loading) {
        return (
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Circles</h1>
                </header>
                <div className={styles.emptyState}>
                    <p>Log in to view and join circles.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                        <Link href="/auth/login" className={styles.createButton} style={{ textDecoration: 'none' }}>
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className={styles.container}>Loading your circles...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Circles</h1>
            </header>

            {/* Pending Invites Highlight */}
            {invites.length > 0 && (
                <Link href="/circles/invites" className={styles.dreamInviteCard}>
                    <div className={styles.cardLeft}>
                        <CircleIcon size={40} />
                        <div className={styles.cardContent}>
                            <div className={styles.cardTitle}>You have {invites.length} pending invites!</div>
                            <div className={styles.cardSubtitle}>Tap to view and join new communities</div>
                        </div>
                    </div>
                </Link>
            )}

            <div className={styles.sectionHeader}>My Circles</div>

            <div className={styles.list}>
                {circles.length > 0 ? (
                    circles.map(circle => {
                        const isOwner = user?.id === circle.owner_user_id;
                        const isEditing = editingCircleId === circle.id;

                        return (
                            <div key={circle.id} className={styles.card} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }} onClick={() => !isEditing && router.push(`/circles/${circle.id}`)}>
                                    <CircleIcon size={40} staticIcon />
                                    <div className={styles.cardContent} style={{ flex: 1 }}>
                                        <div className={styles.cardTitle}>{circle.name}</div>
                                        {isEditing ? (
                                            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }} onClick={e => e.stopPropagation()}>
                                                <textarea
                                                    value={editDesc}
                                                    onChange={e => setEditDesc(e.target.value)}
                                                    autoFocus
                                                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px' }}
                                                />
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button onClick={() => handleUpdateCircle(circle.id, circle.name)} style={{ background: '#E91E63', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>Save</button>
                                                    <button onClick={() => setEditingCircleId(null)} style={{ background: '#eee', color: '#666', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={styles.cardSubtitle}>{circle.description || 'Community archive'}</div>
                                        )}
                                    </div>
                                    {isOwner && !isEditing && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingCircleId(circle.id);
                                                setEditDesc(circle.description || '');
                                            }}
                                            style={{ background: 'none', border: 'none', color: '#E91E63', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', padding: '8px' }}
                                        >
                                            EDIT
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className={styles.emptyState}>
                        <p>You haven't joined any circles yet.</p>
                        <p style={{ fontSize: '13px', marginTop: 8 }}>Create your first circle to start curating style with others!</p>
                    </div>
                )}
            </div>

            {/* Create FAB */}
            <div className={styles.createButtonContainer}>
                <button
                    className={styles.createButton}
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <PlusIcon />
                    Create New Circle
                </button>
            </div>

            <CreateCircleModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}
