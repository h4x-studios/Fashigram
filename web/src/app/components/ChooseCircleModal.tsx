"use client";

import { useState, useEffect } from 'react';
import { demoStore, Circle } from '../demo-store';
import { useAuth } from '../contexts/AuthContext';
import CircleIcon from './CircleIcon';
import styles from './ChooseCircleModal.module.css';

interface ChooseCircleModalProps {
    postId: string;
    isOpen?: boolean;
    onClose: () => void;
}

export default function ChooseCircleModal({ postId, isOpen = true, onClose }: ChooseCircleModalProps) {
    const { user } = useAuth();
    const [circles, setCircles] = useState<Circle[]>([]);
    const [spotlightedIn, setSpotlightedIn] = useState<string[]>([]);

    useEffect(() => {
        if (user && isOpen) {
            const active = demoStore.getCirclesForUser(user.id, 'ACTIVE');
            setCircles(active);

            // Get circles where this post is already spotlighted
            const spotlighted = demoStore.getCirclesWithPostInSpotlight(postId);
            setSpotlightedIn(spotlighted);
        }
    }, [user, isOpen, postId]);

    const handleToggle = (circleId: string) => {
        if (!user) return;

        const isCurrentlySpotlighted = spotlightedIn.includes(circleId);

        if (isCurrentlySpotlighted) {
            // Remove from spotlight
            demoStore.removeFromSpotlight(postId, circleId);
            setSpotlightedIn(prev => prev.filter(id => id !== circleId));
        } else {
            // Add to spotlight
            demoStore.addToSpotlight(postId, circleId, user.id);
            setSpotlightedIn(prev => [...prev, circleId]);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <header className={styles.header}>
                    <div className={styles.title}>Add to Circle Spotlight</div>
                    <button onClick={onClose} className={styles.closeButton}>×</button>
                </header>

                <div className={styles.list}>
                    {circles.length > 0 ? (
                        circles.map(circle => {
                            const isSpotlighted = spotlightedIn.includes(circle.id);
                            return (
                                <button
                                    key={circle.id}
                                    className={`${styles.row} ${isSpotlighted ? styles.rowActive : ''}`}
                                    onClick={() => handleToggle(circle.id)}
                                >
                                    <CircleIcon staticIcon size={32} />
                                    <span className={styles.circleName}>{circle.name}</span>
                                    {isSpotlighted && (
                                        <span className={styles.checkmark}>✓</span>
                                    )}
                                </button>
                            );
                        })
                    ) : (
                        <div className={styles.empty}>
                            You don't have any circles yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
