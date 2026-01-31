"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { demoStore, Circle, PostData } from '../../demo-store';
import CircleIcon from '../../components/CircleIcon';
import { ArrowLeftIcon, SettingsIcon, UserIcon, StarIcon, GlobeIcon } from '../../components/Icons';
import PostTile from '../../feed/PostTile';
import FilterDropdown from '../../feed/FilterDropdown';
import { ALL_STYLES, getSubstylesForStyle, hasSubstyles } from '../../data/styles';
import styles from './circle.module.css';

interface CircleViewProps {
    circleId: string;
}

export default function CircleView({ circleId }: CircleViewProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [circle, setCircle] = useState<Circle | null>(null);
    const [activeTab, setActiveTab] = useState<'feed' | 'spotlight'>('feed');
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<PostData[]>([]);
    const [styleFilter, setStyleFilter] = useState<string | null>(null);
    const [substyleFilter, setSubstyleFilter] = useState<string | null>(null);
    const [countryFilter, setCountryFilter] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<any>(null);

    useEffect(() => {
        if (!user) return;

        // Load Circle
        const c = demoStore.getCircle(circleId);
        // Check membership
        const isMember = demoStore.isCircleMember(circleId, user.id);

        if (!c || !isMember) {
            console.log("Circle access error:", { circleId, userId: user.id, c, isMember });
            setError("Circle not found or access denied.");
            setDebugInfo({
                circleId,
                userId: user.id,
                foundCircle: !!c,
                isMember,
                storeCircleCount: Object.keys(demoStore['circles']).length
            });
            setLoading(false);
            return;
        }

        setCircle(c);
        setLoading(false);
    }, [circleId, user, router]);

    useEffect(() => {
        if (!circle) return;

        let allPosts = demoStore.getAllPosts();

        if (activeTab === 'feed') {
            // Get all posts by circle members
            const members = demoStore.getCircleMembers(circle.id, 'ACTIVE');
            const memberUserIds = members.map(m => m.user_id);

            let memberPosts = allPosts.filter(post => {
                // Check if post creator is a circle member
                const postUser = demoStore.getUser(post.username);
                return postUser && memberUserIds.includes(postUser.id);
            });

            // Apply style filter
            if (styleFilter) {
                memberPosts = memberPosts.filter(p => p.style === styleFilter);
            }

            // Apply substyle filter
            if (substyleFilter) {
                memberPosts = memberPosts.filter(p => p.substyle === substyleFilter);
            }

            // Apply country filter
            if (countryFilter) {
                memberPosts = memberPosts.filter(p => p.countryName === countryFilter);
            }

            setPosts(memberPosts);
        } else {
            // Spotlight: Get posts that have been added to spotlight
            let spotlightPosts = demoStore.getSpotlightPostsForCircle(circle.id);

            // Apply style filter
            if (styleFilter) {
                spotlightPosts = spotlightPosts.filter(p => p.style === styleFilter);
            }

            // Apply substyle filter
            if (substyleFilter) {
                spotlightPosts = spotlightPosts.filter(p => p.substyle === substyleFilter);
            }

            // Apply country filter
            if (countryFilter) {
                spotlightPosts = spotlightPosts.filter(p => p.countryName === countryFilter);
            }

            // Sort by most recent (assuming post IDs contain timestamps or we use createdAt)
            spotlightPosts.sort((a, b) => {
                // Extract timestamp from ID or use a timestamp field
                const timeA = parseInt(a.id.split('-').pop() || '0');
                const timeB = parseInt(b.id.split('-').pop() || '0');
                return timeB - timeA; // Most recent first
            });

            setPosts(spotlightPosts);
        }

    }, [circle, activeTab, styleFilter, substyleFilter, countryFilter]);

    // Get unique countries from posts
    const countries = Array.from(new Set(
        demoStore.getAllPosts()
            .map(p => p.countryName)
            .filter((c): c is string => !!c && c !== 'Everywhere')
    )).sort();

    if (error) {
        return (
            <div className={styles.container} style={{ padding: 40, textAlign: 'center' }}>
                <h2 style={{ color: 'red' }}>{error}</h2>
                <div style={{ marginTop: 20, padding: 20, background: '#f5f5f5', borderRadius: 8, textAlign: 'left', overflow: 'auto' }}>
                    <strong>Debug Info:</strong>
                    <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
                <button
                    onClick={() => router.push('/circles')}
                    style={{ marginTop: 20, padding: '10px 20px', cursor: 'pointer' }}
                >
                    Back to Circles
                </button>
            </div>
        );
    }

    if (loading || !circle) return <div className={styles.container}>Loading...</div>;

    const isOwner = circle.owner_user_id === user?.id;

    return (
        <div className={styles.container}>
            {/* Header US-8.5 */}
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <button onClick={() => router.back()} className={styles.backButton}>
                        <ArrowLeftIcon />
                    </button>
                    {isOwner && (
                        <button onClick={() => router.push(`/circles/${circleId}/settings`)} className={styles.settingsButton}>
                            <SettingsIcon />
                        </button>
                    )}
                </div>

                <div className={styles.iconWrapper}>
                    {/* US-8.5: Animates on first page entry */}
                    <CircleIcon size={48} staticIcon />
                </div>

                <h1 className={styles.circleName}>{circle.name}</h1>
                <div className={styles.circleMeta} onClick={() => router.push(`/circles/${circleId}/members`)}>
                    <UserIcon />
                    <span>Member View</span>
                </div>
            </header>

            {/* Tabs */}
            <div className={styles.tabs}>
                <div
                    className={`${styles.tab} ${activeTab === 'feed' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('feed')}
                >
                    Feed
                </div>
                <div
                    className={`${styles.tab} ${activeTab === 'spotlight' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('spotlight')}
                >
                    <CircleIcon staticIcon size={16} /> {/* Small icon in tab per US-8.7 */}
                    Spotlight
                </div>
            </div>

            {/* Content Filters */}
            <div className={styles.filters}>
                <div className={styles.filterRow}>
                    <FilterDropdown
                        options={ALL_STYLES}
                        selectedValue={styleFilter}
                        onSelect={(value) => {
                            setStyleFilter(value);
                            setSubstyleFilter(null); // Reset substyle when style changes
                        }}
                        placeholder="Search Styles..."
                        icon={
                            <StarIcon
                                filled={!!styleFilter}
                            />
                        }
                        allLabel="All Styles"
                    />
                    <FilterDropdown
                        options={countries}
                        selectedValue={countryFilter}
                        onSelect={setCountryFilter}
                        placeholder="Search Countries..."
                        icon={<GlobeIcon />}
                        allLabel="Everywhere"
                    />
                </div>

                {/* Substyle filter - only show when style is selected and has substyles */}
                {styleFilter && hasSubstyles(styleFilter) && (
                    <div className={styles.filterRow}>
                        <FilterDropdown
                            options={getSubstylesForStyle(styleFilter)}
                            selectedValue={substyleFilter}
                            onSelect={setSubstyleFilter}
                            placeholder="Select Substyle..."
                            icon={<StarIcon filled={!!substyleFilter} />}
                            allLabel="All Substyles"
                        />
                    </div>
                )}
            </div>

            {/* Feed Grid */}
            <div className={styles.feed}>
                {posts.map(post => (
                    <div key={post.id} style={{ marginBottom: '24px' }}>
                        <PostTile post={post} onClick={() => router.push(`/post/${post.id}`)} />
                        {activeTab === 'spotlight' && (
                            <div style={{ padding: '0 16px' }}>
                                <span className={styles.spotlightTileBadge}>Spotlight</span>
                                <div className={styles.spotlightSubtitle}>Added by @owner</div>
                            </div>
                        )}
                    </div>
                ))}
                {posts.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                        No posts here yet.
                    </div>
                )}
            </div>
        </div>
    );
}
