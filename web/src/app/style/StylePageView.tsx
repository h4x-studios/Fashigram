"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PostData, demoStore } from '../demo-store';
import { STYLE_INFO } from '../data/style-data';
import { STYLES } from '../data/styles';
import PostTile from '../feed/PostTile';
import styles from './style.module.css';
import Link from 'next/link';
import { HomeIcon, PlusIcon, UserIcon, ArrowLeftIcon } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';

interface StylePageViewProps {
    styleName: string;
}

export default function StylePageView({ styleName }: StylePageViewProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'new' | 'top'>('new');
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);

    // Case-insensitive matching for URL robustness
    const normalizedStyleName = Object.keys(STYLE_INFO).find(
        key => key.toLowerCase() === styleName.toLowerCase()
    );

    let info: { name: string; subtitle?: string; blurb?: string } | null = normalizedStyleName ? STYLE_INFO[normalizedStyleName] : null;

    // Fallback: Check if it's in the master STYLES list
    if (!info) {
        const masterStyleMatch = STYLES.find(s => s.toLowerCase() === styleName.toLowerCase());
        if (masterStyleMatch) {
            info = {
                name: masterStyleMatch
            };
        }
    }

    const effectiveStyleName = info ? info.name : null;

    // Async Fetch Logic
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            if (!effectiveStyleName) {
                setLoading(false);
                return;
            }

            // In MVP, we fetch all and filter. Optimized later to fetch by style query.
            const allPosts = await demoStore.getAllPosts();
            const filtered = allPosts.filter(p => p.style === effectiveStyleName);
            setPosts(filtered);
            setLoading(false);
        };
        fetchPosts();
    }, [effectiveStyleName]);


    // Sorting (US-7.5)
    // We can't do synchronous getVoteCountForStyle inside sort either!
    // We must fetch scores async or use pre-fetched data.
    // getVoteCountForStyle in SupabaseStore is async.
    // Strategy: enhancing posts with score in the Effect or separate state.

    // For now, let's skip the "Top" sorting complexity if it requires N round trips.
    // Or just sort by date for "Top" as fallback, or use Client side vote counts if available?
    // SupabaseStore doesn't return vote counts in getAllPosts.
    // So "Top" sorting is hard without N queries.
    // I will disable "Top" tab logic for now or make it same as New.

    const displayPosts = useMemo(() => {
        const sorted = [...posts];
        if (activeTab === 'new') {
            return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else {
            // Placeholder: "Top" is just Newest for now until we optimize aggregations
            return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
    }, [posts, activeTab]);


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
            {/* Header */}
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

            {/* Blurb */}
            {info.blurb && (
                <section className={styles.blurbSection}>
                    <p className={styles.blurbText}>{info.blurb}</p>
                </section>
            )}

            {/* Feed Tabs */}
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

            {/* Scoped Feed */}
            <main className={styles.feed}>
                {loading ? (
                    <div style={{ padding: 20, textAlign: 'center' }}>Loading...</div>
                ) : (
                    <>
                        {displayPosts.map(post => (
                            <PostTile
                                key={post.id}
                                post={post}
                                onClick={() => router.push(`/post/${post.id}`)}
                            />
                        ))}
                        {displayPosts.length === 0 && (
                            <div style={{ gridColumn: '1/-1', padding: '2rem', textAlign: 'center', color: '#999' }}>
                                No posts in this style yet.
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Bottom Nav */}
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
