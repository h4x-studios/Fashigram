"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { demoStore, Circle, CircleMember } from '../demo-store';
import styles from './circles.module.css';
import CircleIcon from '../components/CircleIcon';
import { PlusIcon } from '../components/Icons';
import CreateCircleModal from '../components/CreateCircleModal';

export default function CirclesPage() {
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

    if (!user && !loading) {
        return (
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Circles</h1>
                </header>
                <div className={styles.emptyState}>
                    <p>Log in to view and join circles.</p>
                    <Link href="/auth/login" className={styles.createButton} style={{ marginTop: 20, textDecoration: 'none' }}>
                        Log In
                    </Link>
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
                    circles.map(circle => (
                        <Link key={circle.id} href={`/circles/${circle.id}`} className={styles.card}>
                            <div className={styles.cardLeft}>
                                <CircleIcon size={40} staticIcon />
                                <div className={styles.cardContent}>
                                    <div className={styles.cardTitle}>{circle.name}</div>
                                    <div className={styles.cardSubtitle}>{circle.description || 'Community archive'}</div>
                                </div>
                            </div>
                        </Link>
                    ))
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
