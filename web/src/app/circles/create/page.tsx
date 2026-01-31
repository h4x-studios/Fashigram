"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { demoStore } from '../../demo-store';
import CircleIcon from '../../components/CircleIcon';
import { ArrowLeftIcon } from '../../components/Icons';
import styles from './create.module.css';

export default function CreateCirclePage() {
    const router = useRouter();
    const { user } = useAuth();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !name.trim()) return;

        setIsSubmitting(true);

        // Simulate network delay
        setTimeout(() => {
            const newCircle = demoStore.createCircle(name, description, user.id);
            router.push(`/circles/${newCircle.id}`); // Redirect to new circle (Phase 4)
            // Note: Phase 4 page might not exist yet, will 404 until implemented.
            // But this completes US-8.3 flow.
        }, 800);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => router.back()} className={styles.backButton}>
                    <ArrowLeftIcon />
                </button>
            </header>

            {/* Large Static Icon - Visual Language */}
            <div className={styles.iconWrapper}>
                <CircleIcon staticIcon size={100} />
            </div>

            <h1 className={styles.title}>Create a Circle</h1>
            <p className={styles.subtitle}>
                Curate a shared feed with your inner circle.<br />
                Private, invite-only, no noise.
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="name">Circle Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Harajuku Queens"
                        className={styles.input}
                        maxLength={50}
                        required
                        autoFocus
                    />
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="description">Description (Optional)</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What's this circle about?"
                        className={`${styles.input} ${styles.textarea}`}
                        maxLength={200}
                    />
                    <div className={styles.charCount}>{description.length}/200</div>
                </div>

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting || !name.trim()}
                >
                    {isSubmitting ? 'Creating...' : 'Create Circle'}
                </button>
            </form>
        </div>
    );
}
