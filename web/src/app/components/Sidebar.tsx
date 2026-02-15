"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import styles from './Sidebar.module.css';
import { UserIcon } from './Icons';
import CircleIcon from './CircleIcon';
import Logo from './Logo';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

// Simple icon components matching the mockup
const SettingsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 6v6m5.196-15.804l-4.243 4.243m-1.414 1.414l-4.243 4.243m15.804-5.196l-4.243 4.243m-1.414-1.414L2.804 17.196" />
    </svg>
);

const LogOutIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const LoginIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
);

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleLogout = async () => {
        await signOut();
        onClose();
        router.push('/');
    };

    const handleNavigation = (path: string) => {
        router.push(path);
        onClose();
    };

    // Check if we're on the profile page
    const isProfileActive = pathname?.startsWith('/profile');
    const isCirclesActive = pathname?.startsWith('/circles');

    if (!mounted || !isOpen) return null;

    return createPortal(
        <>
            {/* Scrim/Overlay */}
            <div
                className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
                <div className={styles.header}>
                    <Logo variant="full" size={56} clickable={false} color="white" />
                </div>

                <nav className={styles.menu}>
                    {/* Profile */}
                    <button
                        className={`${styles.menuItem} ${isProfileActive ? styles.menuItemActive : ''}`}
                        onClick={() => handleNavigation(user ? `/profile/You` : '/auth/login')}
                    >
                        <span className={`${styles.menuIcon} ${isProfileActive ? styles.menuIconActive : styles.menuIconInactive}`}>
                            <UserIcon filled />
                        </span>
                        Profile
                    </button>

                    {/* Circles */}
                    <button
                        className={`${styles.menuItem} ${isCirclesActive ? styles.menuItemActive : ''}`}
                        onClick={() => handleNavigation('/circles')}
                    >
                        <span className={`${styles.menuIcon} ${isCirclesActive ? styles.menuIconActive : styles.menuIconInactive}`}>
                            <CircleIcon animateOnHover={true} />
                        </span>
                        Circles
                    </button>

                    {/* Settings */}
                    {user && (
                        <button
                            className={styles.menuItem}
                            onClick={() => handleNavigation('/settings')}
                        >
                            <span className={`${styles.menuIcon} ${styles.menuIconInactive}`}>
                                <SettingsIcon />
                            </span>
                            Settings
                        </button>
                    )}

                    {/* Login/Logout */}
                    {user ? (
                        <button
                            className={styles.menuItem}
                            onClick={handleLogout}
                        >
                            <span className={`${styles.menuIcon} ${styles.menuIconInactive}`}>
                                <LogOutIcon />
                            </span>
                            Log Out
                        </button>
                    ) : (
                        <button
                            className={styles.menuItem}
                            onClick={() => handleNavigation('/auth/login')}
                        >
                            <span className={`${styles.menuIcon} ${styles.menuIconInactive}`}>
                                <LoginIcon />
                            </span>
                            Log In
                        </button>
                    )}
                </nav>
            </div>
        </>,
        document.body
    );
}
