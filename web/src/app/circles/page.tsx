"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { demoStore, Circle } from '../demo-store';
import CircleIcon from '../components/CircleIcon';
import Sidebar from '../components/Sidebar';
import { PlusIcon, ChevronRightIcon, ArrowLeftIcon } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';
import styles from './circles.module.css';

export default function CirclesListPage() {
    const { user } = useAuth();
    const [circles, setCircles] = useState<Circle[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            const userCircles = demoStore.getCirclesForUser(user.id, 'ACTIVE');
            setCircles(userCircles);
            setLoading(false);
        }
    }, [user]);

    if (!user) return null;

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                        onClick={() => router.back()}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', color: '#111',
                            padding: 8, marginLeft: -8
                        }}
                        aria-label="Go back"
                    >
                        <ArrowLeftIcon />
                    </button>
                    <h1 className={styles.title}>Circles</h1>
                </div>
            </header>

            {/* Community Banner */}
            <div className={styles.dreamInviteCard}>
                <div className={styles.cardLeft}>
                    <CircleIcon staticIcon size={40} />
                    <div className={styles.cardContent}>
                        <span className={styles.cardTitle}>Interact with your Circles</span>
                        <span className={styles.cardSubtitle}>This is where community is made!</span>
                    </div>
                </div>
            </div>

            {/* My Circles Section */}
            <div className={styles.sectionHeader}>MY CIRCLES</div>
            <div className={styles.list}>
                {loading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : circles.length > 0 ? (
                    circles.map(circle => (
                        <div
                            key={circle.id}
                            className={styles.card}
                            onClick={() => router.push(`/circles/${circle.id}`)}
                        >
                            <div className={styles.cardLeft}>
                                <CircleIcon staticIcon size={40} />
                                <div className={styles.cardContent}>
                                    <span className={styles.cardTitle}>{circle.name}</span>
                                    <span className={styles.cardSubtitle}>
                                        {demoStore.getCircleMembers(circle.id).length} members
                                    </span>
                                </div>
                            </div>
                            <ChevronRightIcon />
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        {circles.length === 0
                            ? "You haven't joined any circles yet."
                            : "No circles match your filters."}
                    </div>
                )}
            </div>

            {/* Invites Section (Static Link for now) */}
            <div style={{ marginTop: 24 }}>
                <div
                    className={styles.card}
                    onClick={() => router.push('/circles/invites')}
                >
                    <div className={styles.cardLeft}>
                        <div style={{ width: 40, height: 40, background: '#f0f0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            ✉️
                        </div>
                        <span className={styles.cardTitle}>View Invites</span>
                    </div>
                    <ChevronRightIcon />
                </div>
            </div>

            {/* Create FAB */}
            <div className={styles.createButtonContainer}>
                <Link href="/circles/create" className={styles.createButton}>
                    Create Circle
                </Link>
            </div>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </div>
    );
}
