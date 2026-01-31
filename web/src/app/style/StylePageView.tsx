"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PostData, demoStore } from '../demo-store';
import { STYLE_INFO } from '../data/style-data';
import { STYLES } from '../data/styles';
import PostTile from '../feed/PostTile';
import styles from './style.module.css';
import Link from 'next/link';

// Bottom Nav Components (reused inline simple versions for now or imported if available)
// Ideally we should extract BottomNav to a component, but for MVP consistency with other pages, we'll inline or use standard layout if present.
// Looking at ProfileView, it renders its own specific bottom nav or main layout handles it?
// Main layout handles it in page.tsx, but ProfileView has its own.
// We will include standard bottom nav here for consistency.

import { HomeIcon, PlusIcon, UserIcon, ArrowLeftIcon } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';

interface StylePageViewProps {
    styleName: string;
}

export default function StylePageView({ styleName }: StylePageViewProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'new' | 'top'>('new');

    // Case-insensitive matching for URL robustness
    const normalizedStyleName = Object.keys(STYLE_INFO).find(
        key => key.toLowerCase() === styleName.toLowerCase()
    );

    let info: { name: string; subtitle?: string; blurb?: string } | null = normalizedStyleName ? STYLE_INFO[normalizedStyleName] : null;

    // Fallback: Check if it's in the master STYLES list if not found in detailed info
    if (!info) {
        const masterStyleMatch = STYLES.find(s => s.toLowerCase() === styleName.toLowerCase());
        if (masterStyleMatch) {
            info = {
                name: masterStyleMatch
            };
        }
    }

    // Use the found name (either from info or fallback) for filtering
    const effectiveStyleName = info ? info.name : null;

    // Filter posts: Declared Style MUST match current style
    const stylePosts = useMemo(() => {
        if (!effectiveStyleName) return [];

        const allPosts = demoStore.getAllPosts();
        // US-7.4: Filter by declared_style only
        return allPosts.filter(p => p.style === effectiveStyleName);
    }, [effectiveStyleName]);

    // Sorting (US-7.5)
    const sortedPosts = useMemo(() => {
        const posts = [...stylePosts];
        if (activeTab === 'new') {
            return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else {
            // Top: For MVP, sort by vote count for this specific style
            // Feature 5 used a complex decay, here we can use raw vote count or decay.
            // Let's use getVoteCountForStyle which exists in demoStore (Feature 3/4)
            return posts.sort((a, b) => {
                const votesA = demoStore.getVoteCountForStyle(a.id, effectiveStyleName!);
                const votesB = demoStore.getVoteCountForStyle(b.id, effectiveStyleName!);
                return votesB - votesA;
            });
        }
    }, [stylePosts, activeTab, effectiveStyleName]);

    if (!info) {
        return (
            <div className={styles.errorContainer}>
                <h1 className={styles.errorTitle}>Style Not Found</h1>
                <p className={styles.errorText}>The style "{styleName}" hasn't been documented yet.</p>
                <Link href="/" className={styles.homeButton}>Return Home</Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header (US-7.2) */}
            <header className={styles.header}>
                <div className={styles.navBar}>
                    <button onClick={() => router.back()} className={styles.backButton}>
                        <ArrowLeftIcon />
                    </button>
                    <div className={styles.titleArea}>
                        <h1 className={styles.title}>{info.name}</h1>
                        {info.subtitle && <p className={styles.subtitle}>{info.subtitle}</p>}
                    </div>
                </div>
            </header>

            {/* Blurb (US-7.3) */}
            {info.blurb && (
                <section className={styles.blurbSection}>
                    <p className={styles.blurbText}>{info.blurb}</p>
                </section>
            )}

            {/* Feed Tabs (US-7.5) */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'new' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('new')}
                >
                    Info
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'top' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('top')}
                >
                    Top <span className={styles.tabSuffix}>(All Time)</span>
                </button>
            </div>

            {/* Scoped Feed (US-7.4) */}
            <main className={styles.feed}>
                {sortedPosts.map(post => (
                    <PostTile
                        key={post.id}
                        post={post}
                        onClick={() => router.push(`/post/${post.id}`)}
                    />
                ))}
                {sortedPosts.length === 0 && (
                    <div style={{ gridColumn: '1/-1', padding: '2rem', textAlign: 'center', color: '#999' }}>
                        No posts in this style yet.
                    </div>
                )}
            </main>

            {/* Bottom Nav (Consistent with Layout) */}
            <nav className={styles.navbar}>
                <Link href="/" className={styles.navIcon}>
                    <HomeIcon filled />
                </Link>
                <Link href={user ? "/create" : "/auth/login"} className={styles.createButton}>
                    <PlusIcon />
                </Link>
                <Link
                    href={user ? `/profile/You` : "/auth/login"}
                    className={styles.navIcon}
                >
                    <UserIcon filled />
                </Link>
            </nav>
        </div>
    );
}
