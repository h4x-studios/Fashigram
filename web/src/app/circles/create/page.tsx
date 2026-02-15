"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { demoStore } from '../../demo-store';
import styles from '../circles.module.css';
import { ArrowLeftIcon } from '../../components/Icons';

export default function CreateCirclePage() {
    const router = useRouter();
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !name.trim()) return;

        setSaving(true);
        try {
            const circle = await demoStore.createCircle(name.trim(), description.trim(), user.id);
            router.push(`/circles/${circle.id}`);
        } catch (err) {
            console.error(err);
            alert('Failed to create circle. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, marginLeft: -8 }}>
                    <ArrowLeftIcon />
                </button>
                <h1 className={styles.title} style={{ marginTop: 16 }}>Create New Circle</h1>
            </header>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>Circle Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Tokyo Street Style"
                        required
                        style={{ padding: 16, borderRadius: 12, border: '1px solid #ddd', fontSize: 16 }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>Description (Optional)</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="What is this circle about?"
                        style={{ padding: 16, borderRadius: 12, border: '1px solid #ddd', fontSize: 16, minHeight: 100, resize: 'none' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving || !name.trim()}
                    className={styles.createButton}
                    style={{ position: 'relative', bottom: 0, marginTop: 12 }}
                >
                    {saving ? 'Creating...' : 'Create Circle'}
                </button>
            </form>
        </div>
    );
}
