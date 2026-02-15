"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./profile.module.css";
import { User, PostData, demoStore } from "../demo-store";
import ProfilePostTile from "./ProfilePostTile";
import FilterDropdown from "../feed/FilterDropdown";
import { STYLES } from "../data/styles";
import {
    StarIcon
} from "../components/Icons";

interface ProfileViewProps {
    user: User;
    posts: PostData[];
    isOwner?: boolean;
}

export default function ProfileView({ user, posts, isOwner = false }: ProfileViewProps) {
    const router = useRouter();
    const [styleFilter, setStyleFilter] = useState<string | null>(null);

    // Cache suggested styles for filtering. Map<PostId, SuggestedStyles[]>
    const [suggestionsMap, setSuggestionsMap] = useState<Record<string, string[]>>({});
    const [loadingSuggestions, setLoadingSuggestions] = useState(true);

    // Load suggested styles for all posts
    useEffect(() => {
        const loadSuggestions = async () => {
            setLoadingSuggestions(true);
            const map: Record<string, string[]> = {};
            // Parallel fetch
            await Promise.all(posts.map(async (post) => {
                const suggested = await demoStore.getSuggestedStylesForPost(post.id, post.style);
                map[post.id] = suggested;
            }));
            setSuggestionsMap(map);
            setLoadingSuggestions(false);
        };

        if (posts.length > 0) {
            loadSuggestions();
        } else {
            setLoadingSuggestions(false);
        }
    }, [posts]);

    // Filter Logic
    const filteredPosts = useMemo(() => {
        if (!styleFilter) return posts;
        if (loadingSuggestions && posts.length > 0) return []; // Wait for loading? Or show declared only?
        // Show declared only implies "No results" until loaded. 
        // Better: Show declared matches immediately, add suggested matches when loaded?
        // Simpler: Just filter.

        return posts.filter(post => {
            // 1. Check declared style
            if (post.style === styleFilter) return true;

            // 2. Check suggested styles
            const suggested = suggestionsMap[post.id] || [];
            if (suggested.includes(styleFilter)) return true;

            return false;
        });
    }, [posts, styleFilter, suggestionsMap, loadingSuggestions]);

    return (
        <div className={styles.container}>

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

        </div>
    );
}
