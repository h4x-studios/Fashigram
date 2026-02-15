"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { demoStore } from '../demo-store';
import styles from './CreateCircleModal.module.css';

interface CreateCircleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated?: (circleId: string) => void;
}

export default function CreateCircleModal({ isOpen, onClose, onCreated }: CreateCircleModalProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !name.trim()) return;

        setSaving(true);
        try {
            const circle = await demoStore.createCircle(name.trim(), description.trim(), user.id);
            if (onCreated) {
                onCreated(circle.id);
            } else {
                router.push(`/circles/${circle.id}`);
            }
            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to create circle. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <header className={styles.header}>
                    <h2 className={styles.title}>Create New Circle</h2>
                    <button onClick={onClose} className={styles.closeButton}>×</button>
                </header>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>Circle Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Tokyo Street Style"
                            required
                            className={styles.input}
                            autoFocus
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="What is this circle about?"
                            className={styles.textarea}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving || !name.trim()}
                        className={styles.submitButton}
                    >
                        {saving ? 'Creating...' : 'Create Circle'}
                    </button>
                </form>
            </div>
        </div>
    );
}
