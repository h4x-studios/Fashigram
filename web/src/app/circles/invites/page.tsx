"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { demoStore, CircleMember } from '../../demo-store';
import styles from '../circles.module.css';
import CircleIcon from '../../components/CircleIcon';
import { ArrowLeftIcon } from '../../components/Icons';

export default function CircleInvitesPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [invites, setInvites] = useState<CircleMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!user) return;
            setLoading(true);
            // In a real app we'd fetch actual invites. For now we use the stubbed data logic
            // We'll just show an empty state or stubbed if we added any to DEMO data
            const data = await demoStore.getCircleMembers(user.id, 'INVITED'); // This matches our store method signature
            setInvites(data);
            setLoading(false);
        };
        load();
    }, [user]);

    if (loading) return <div className={styles.container}>Loading invites...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Pending Invites</h1>
            </header>

            <div className={styles.list} style={{ marginTop: 24 }}>
                {invites.length > 0 ? (
                    invites.map((invite, idx) => (
                        <div key={idx} className={styles.card}>
                            <div className={styles.cardLeft}>
                                <CircleIcon size={40} />
                                <div className={styles.cardContent}>
                                    <div className={styles.cardTitle}>Circle Invite</div>
                                    <div className={styles.cardSubtitle}>You've been invited to join this community</div>
                                </div>
                            </div>
                            <button className={styles.acceptButton} style={{ padding: '8px 16px', borderRadius: 20, background: '#E91E63', color: 'white', border: 'none', fontWeight: 700, fontSize: 13 }}>
                                Accept
                            </button>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <p>No pending invites.</p>
                        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#E91E63', fontWeight: 700, marginTop: 16, cursor: 'pointer' }}>
                            Go Back
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
