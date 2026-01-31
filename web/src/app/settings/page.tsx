"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './settings.module.css';
import Sidebar from '../components/Sidebar';
import { HomeIcon, PlusIcon, UserIcon } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(90deg)' }}>
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

export default function SettingsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={styles.container}>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Header */}
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <BackIcon />
                </button>
                <h1 className={styles.headerTitle}>Settings</h1>
                <div style={{ width: 40 }}></div>
            </header>

            {/* Content */}
            <div className={styles.content}>
                <div className={styles.placeholder}>
                    <p>⚙️</p>
                    <h2>Settings Coming Soon</h2>
                    <p>This feature is under construction.</p>
                </div>
            </div>

            {/* Bottom Navigation */}
            <nav className={styles.navbar}>
                <Link href="/" className={styles.navIcon}><HomeIcon filled /></Link>
                <Link href={user ? "/create" : "/auth/login"} className={styles.createButton}>
                    <PlusIcon />
                </Link>
                <Link
                    href={user ? `/profile/${user.username}` : "/auth/login"}
                    className={styles.navIcon}
                >
                    <UserIcon filled className={styles.navUserIcon} />
                </Link>
            </nav>
        </div>
    );
}
