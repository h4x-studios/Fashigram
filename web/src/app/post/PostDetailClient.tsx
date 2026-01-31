"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./post.module.css";
import Link from "next/link";
import { demoStore, PostData, StyleVote } from "../demo-store";
import StyleChip from "./StyleChip";
import StyleSuggestionModal from "./StyleSuggestionModal";
import Sidebar from "../components/Sidebar";
import {
    HomeIcon,
    PlusIcon,
    UserIcon,
    ArrowLeftIcon
} from "../components/Icons";
import ChooseCircleModal from "../components/ChooseCircleModal";
import CircleIcon from "../components/CircleIcon";
import Logo from "../components/Logo";

const MAX_SUGGESTIONS = 2;

export default function PostDetailView({ id }: { id: string }) {
    const router = useRouter();
    const [post, setPost] = useState<PostData | null>(null);
    const [votes, setVotes] = useState<StyleVote[]>([]);
    const [suggestedStyles, setSuggestedStyles] = useState<string[]>([]);
    const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // UI State
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSpotlightModalOpen, setIsSpotlightModalOpen] = useState(false);

    // Initial Data Load
    useEffect(() => {
        const storedPost = demoStore.getPost(id);
        if (storedPost) {
            setPost(storedPost);
        } else {
            // Fallback for direct link/refresh
            setPost({
                id,
                username: "CherryPop",
                avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cherry",
                countryName: "United States",
                images: [
                    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
                    "https://images.unsplash.com/photo-1539109132384-36155575239b?w=400&q=80",
                    "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&q=80"
                ],
                style: "Decora",
                caption: "Feeling super kawaii in this Decora outfit! I love mixing bright colors and cute accessories!",
                createdAt: "2 hours ago"
            });
        }
    }, [id]);

    // Vote Data Sync
    // Wrapped in useCallback if needed, but here simple function is fine as it's called in effects
    const refreshVotes = () => {
        if (!post) return;

        // Ensure declared vote exists
        if (!demoStore.areVotesInitialized(id)) {
            demoStore.addVote({
                postId: id,
                style: post.style,
                userId: post.username === "You" ? demoStore.getCurrentUserId() : "creator",
                voteType: 'DECLARED',
                createdAt: new Date().toISOString()
            });
        }

        const currentVotes = demoStore.getVotesForPost(id);
        const currentSuggestions = demoStore.getSuggestedStylesForPost(id, post.style);

        const userId = demoStore.getCurrentUserId();
        const myVotes = new Set(currentVotes.filter(v => v.userId === userId).map(v => v.style));

        setVotes(currentVotes);
        setSuggestedStyles(currentSuggestions);
        setUserVotes(myVotes);
    };

    useEffect(() => {
        if (post) refreshVotes();
    }, [post]);

    // Handlers
    const handleVote = (style: string, voteType: 'DECLARED' | 'SUGGESTED') => {
        const userId = demoStore.getCurrentUserId();

        // Toggle Vote Logic
        if (demoStore.hasUserVotedForStyle(id, style, userId)) {
            // Unvote
            demoStore.removeVote(id, style, userId);
            refreshVotes();
            return;
        }

        // Add Vote
        const success = demoStore.addVote({
            postId: id,
            style: style,
            userId,
            voteType,
            createdAt: new Date().toISOString()
        });

        if (success) {
            refreshVotes();
        } else {
            setError('Failed to record vote');
        }
    };

    const handleSuggest = (style: string) => {
        // If already exists, treat as vote
        if (style === post?.style || suggestedStyles.includes(style)) {
            handleVote(style, 'SUGGESTED');
            setIsModalOpen(false);
            return;
        }

        // Check Limit
        if (suggestedStyles.length >= MAX_SUGGESTIONS) {
            setError('This post already has the maximum number of style suggestions.');
            setTimeout(() => setError(null), 3000);
            setIsModalOpen(false);
            return;
        }

        // Add new
        handleVote(style, 'SUGGESTED');
        setIsModalOpen(false);
    };

    if (!post) return null;

    const galleryClass = post.images.length === 1 ? styles.gallery1 :
        post.images.length === 2 ? styles.gallery2 :
            styles.gallery3;

    const declaredCount = demoStore.getVoteCountForStyle(id, post.style) || 1;

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Header */}
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <ArrowLeftIcon />
                </button>
                <div className={styles.logoContainer}>
                    <Logo variant="icon" size={64} clickable={false} />
                </div>
                <div style={{ width: 40 }}></div>
            </header>

            <ChooseCircleModal
                postId={post.id}
                isOpen={isSpotlightModalOpen}
                onClose={() => setIsSpotlightModalOpen(false)}
            />

            <div className={styles.container}>
                {/* User Info */}
                <section className={styles.userSection}>
                    <img src={post.avatarUrl} alt={post.username} className={styles.avatar} />
                    <div className={styles.userInfo}>
                        <Link href={`/profile/${encodeURIComponent(post.username)}`} className={styles.username} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {post.username}
                        </Link>
                        <span className={styles.declaredStyleHeader}>{post.style}</span>
                    </div>

                    {/* Circle Icon with + on same row as user info */}
                    <button
                        onClick={() => setIsSpotlightModalOpen(true)}
                        className={styles.userSectionCircleButton}
                        title="Add to Circle Spotlight"
                    >
                        <CircleIcon staticIcon size={18} />
                        <span className={styles.plusIcon}>+</span>
                    </button>
                </section>

                {/* Media Gallery */}
                <section className={`${styles.gallery} ${galleryClass}`}>
                    {post.images.map((img, idx) => (
                        <div key={idx} className={styles.imageWrapper} onClick={() => setFullscreenImage(img)}>
                            <img src={img} alt={`Look detail ${idx + 1}`} className={styles.image} />
                        </div>
                    ))}
                </section>

                {/* Content Section */}
                <section className={styles.contentSection}>
                    {/* Interactive Style Chips */}
                    <div className={styles.chipSection}>
                        {/* Declared Primary */}
                        <StyleChip
                            label={post.style}
                            count={declaredCount}
                            isDeclared={true}
                            isVoted={userVotes.has(post.style)}
                            onClick={() => handleVote(post.style, 'DECLARED')}
                        />

                        {/* Suggested Secondary */}
                        {suggestedStyles.map(s => (
                            <StyleChip
                                key={s}
                                label={s}
                                count={demoStore.getVoteCountForStyle(id, s)}
                                isDeclared={false}
                                isVoted={userVotes.has(s)}
                                onClick={() => handleVote(s, 'SUGGESTED')}
                            />
                        ))}

                        {/* Suggest Button */}
                        {suggestedStyles.length < MAX_SUGGESTIONS && (
                            <button className={styles.suggestButton} onClick={() => setIsModalOpen(true)}>+</button>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && <div className={styles.errorMessage}>{error}</div>}

                    {/* Caption */}
                    {post.caption && (
                        <div className={styles.caption}>
                            <span style={{ fontWeight: 700, marginRight: 8 }}>{post.username}</span>
                            {post.caption}
                        </div>
                    )}

                    <div className={styles.location}>
                        <span>📍 {post.countryName || "Everywhere"}</span>
                        <span>•</span>
                        <span>{post.createdAt}</span>
                    </div>
                </section>

                {/* Modals */}
                {fullscreenImage && (
                    <div className={styles.modal} onClick={() => setFullscreenImage(null)}>
                        <button className={styles.modalClose}>×</button>
                        <img src={fullscreenImage} alt="Fullscreen view" className={styles.modalImage} />
                    </div>
                )}

                {isModalOpen && (
                    <StyleSuggestionModal
                        existingStyles={[post.style, ...suggestedStyles]}
                        onSelect={handleSuggest}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}

            </div>
        </>
    );
}
