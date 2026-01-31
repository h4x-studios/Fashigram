"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./profile.module.css";
import { User, PostData, demoStore } from "../demo-store";
import ProfilePostTile from "./ProfilePostTile";
import FilterDropdown from "../feed/FilterDropdown";
import { STYLES } from "../data/styles";
import Sidebar from "../components/Sidebar";
import {
    ChevronDownIcon,
    StarIcon,
    HomeIcon,
    PlusIcon,
    UserIcon,
    ArrowLeftIcon
} from "../components/Icons";



interface ProfileViewProps {
    user: User;
    posts: PostData[];
    isOwner?: boolean;
}

export default function ProfileView({ user, posts, isOwner = false }: ProfileViewProps) {
    const router = useRouter();
    const [styleFilter, setStyleFilter] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // Toggle removed as per user request (always include suggested/all tags)

    // Filter Logic
    const filteredPosts = useMemo(() => {
        if (!styleFilter) return posts;

        return posts.filter(post => {
            // 1. Check declared style
            if (post.style === styleFilter) return true;

            // 2. Check suggested styles (Always include per new requirement)
            const suggested = demoStore.getSuggestedStylesForPost(post.id, post.style);
            if (suggested.includes(styleFilter)) return true;

            return false;
        });
    }, [posts, styleFilter]);

    return (
        <div className={styles.container}>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Header */}
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <ArrowLeftIcon />
                </button>
                <h1 className={styles.headerTitle}>{user.username}</h1>
            </header>

            {/* User Details */}
            <section className={styles.userHeader}>
                <div className={styles.identity}>
                    <img src={user.avatarUrl} alt={user.username} className={styles.avatar} />
                    <div className={styles.username}>{user.username}</div>
                </div>
                {user.bio && <div className={styles.bio}>{user.bio}</div>}
            </section>

            {/* Filters */}
            <section className={styles.filterSection}>
                <FilterDropdown
                    options={STYLES}
                    selectedValue={styleFilter}
                    onSelect={setStyleFilter}
                    placeholder="Filter Archive..."
                    icon={<StarIcon className={styleFilter ? styles.starIconActive : ''} filled={!!styleFilter} />}
                    allLabel="All Posts"
                />
            </section>

            {/* Archive Grid */}
            {filteredPosts.length > 0 ? (
                <div className={styles.archiveGrid}>
                    {filteredPosts.map(post => (
                        <ProfilePostTile
                            key={post.id}
                            post={post}
                            onClick={() => router.push(`/post/${post.id}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>📂</div>
                    <p>No posts found in this archive.</p>
                    {styleFilter && (
                        <button
                            className={styles.resetButton}
                            onClick={() => setStyleFilter(null)}
                            style={{ marginTop: '12px', background: 'none', border: '1px solid currentColor', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Clear Filter
                        </button>
                    )}
                </div>
            )}

            {/* Navbar */}
            <nav className={styles.navbar}>
                <Link href="/" className={styles.navIcon}><HomeIcon filled /></Link>
                <Link href="/create" className={styles.createButton}>
                    <PlusIcon />
                </Link>
                <Link
                    href={isOwner ? `/profile/${user.username}` : "/auth/login"}
                    className={`${styles.navIcon} ${isOwner ? styles.navIconActive : ''}`}
                >
                    <UserIcon filled className={isOwner ? '' : styles.navUserIcon} />
                </Link>
            </nav>
        </div>
    );
}
