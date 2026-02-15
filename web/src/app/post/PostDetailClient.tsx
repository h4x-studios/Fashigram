"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./post.module.css";
import Link from "next/link";
import { demoStore, PostData, StyleVote } from "../demo-store";
import StyleChip from "./StyleChip";
import StyleSuggestionModal from "./StyleSuggestionModal";
import { useAuth } from "../contexts/AuthContext";
import {
    HomeIcon,
    PlusIcon,
    UserIcon,
    ArrowLeftIcon,
    TrashIcon
} from "../components/Icons";
import ChooseCircleModal from "../components/ChooseCircleModal";
import CircleIcon from "../components/CircleIcon";

const MAX_SUGGESTIONS = 2;

export default function PostDetailView({ id }: { id: string }) {
    const router = useRouter();
    const { user } = useAuth();
    const [post, setPost] = useState<PostData | null>(null);
    const [votes, setVotes] = useState<StyleVote[]>([]);
    const [suggestedStyles, setSuggestedStyles] = useState<string[]>([]);
    const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // UI State
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
    const [isSpotlightModalOpen, setIsSpotlightModalOpen] = useState(false);

    // Initial Data Load
    useEffect(() => {
        const fetchPost = async () => {
            const storedPost = await demoStore.getPost(id);
            if (storedPost) {
                setPost(storedPost);
            }
        };
        fetchPost();
    }, [id]);

    // Vote Data Sync
    useEffect(() => {
        const refreshVotes = async () => {
            if (!post) return;

            const currentVotes = await demoStore.getVotesForPost(id);

            // Client-side aggregate for suggestions
            const suggestionsMap: Record<string, number> = {};
            currentVotes.forEach(v => {
                if (v.voteType === 'SUGGESTED' && v.style !== post.style) {
                    suggestionsMap[v.style] = (suggestionsMap[v.style] || 0) + 1;
                }
            });

            // Sort suggestions by count
            const sortedSuggestions = Object.keys(suggestionsMap)
                .sort((a, b) => suggestionsMap[b] - suggestionsMap[a]);

            // Determine user's votes
            const myVotes = new Set<string>();
            if (user) {
                currentVotes.filter(v => v.userId === user.id).forEach(v => myVotes.add(v.style));
            }

            setVotes(currentVotes);
            setSuggestedStyles(sortedSuggestions);
            setUserVotes(myVotes);
        };

        refreshVotes();
    }, [post, id, user]);

    // Handlers
    const handleVote = async (style: string, voteType: 'DECLARED' | 'SUGGESTED') => {
        if (!user) {
            setError("You must be logged in to vote.");
            return;
        }

        // Toggle Vote Logic
        // We use client state 'userVotes' to check existence, or check DB?
        // Checking DB is safer (race conditions), but client state is faster.
        // demoStore.hasUserVotedForStyle is gone (sync).
        // relying on userVotes set.

        if (userVotes.has(style)) {
            // Unvote
            await demoStore.removeVote(id, style, user.id);
            // Refresh logic will re-fetch
            const currentVotes = await demoStore.getVotesForPost(id);
            // ... update state (duplicate logic from effect? Or trigger effect?)
            // Triggering effect by dependent variable is tricky if nothing changed in dependencies.
            // Better to update state manually or extract refresh function.
            // I'll inline a quick refresh or extract it outside effect?
            // Extracting `refreshVotes` outside isn't easy with `useEffect`.
            // I'll just force re-fetch or assume `setVotes` updates.
            const suggestionsMap: Record<string, number> = {};
            currentVotes.forEach(v => {
                if (v.voteType === 'SUGGESTED' && v.style !== post?.style) {
                    suggestionsMap[v.style] = (suggestionsMap[v.style] || 0) + 1;
                }
            });
            const sortedSuggestions = Object.keys(suggestionsMap).sort((a, b) => suggestionsMap[b] - suggestionsMap[a]);
            const myVotes = new Set<string>();
            currentVotes.filter(v => v.userId === user.id).forEach(v => myVotes.add(v.style));
            setVotes(currentVotes);
            setSuggestedStyles(sortedSuggestions);
            setUserVotes(myVotes);
            return;
        }

        // Add Vote
        const success = await demoStore.addVote({
            postId: id,
            style: style,
            userId: user.id,
            voteType,
            createdAt: new Date().toISOString()
        });

        if (success) {
            // Refresh (inline for now)
            const currentVotes = await demoStore.getVotesForPost(id);
            const suggestionsMap: Record<string, number> = {};
            currentVotes.forEach(v => {
                if (v.voteType === 'SUGGESTED' && v.style !== post?.style) {
                    suggestionsMap[v.style] = (suggestionsMap[v.style] || 0) + 1;
                }
            });
            const sortedSuggestions = Object.keys(suggestionsMap).sort((a, b) => suggestionsMap[b] - suggestionsMap[a]);
            const myVotes = new Set<string>();
            currentVotes.filter(v => v.userId === user.id).forEach(v => myVotes.add(v.style));
            setVotes(currentVotes);
            setSuggestedStyles(sortedSuggestions);
            setUserVotes(myVotes);
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

    const handleDelete = async () => {
        if (!user || user.id !== post?.userId) return;

        if (window.confirm("Are you sure you want to permanently delete this post?")) {
            const success = await demoStore.deletePost(id);
            if (success) {
                router.push('/');
            } else {
                setError("Failed to delete post");
            }
        }
    };

    if (!post) return <div>Loading...</div>; // Or return null

    const galleryClass = post.images.length === 1 ? styles.gallery1 :
        post.images.length === 2 ? styles.gallery2 :
            styles.gallery3;

    // We need declared count.
    // Calculate from `votes` state.
    const declaredCount = votes.filter(v => v.style === post.style).length || 1;

    return (
        <>
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

                    {/* Circle Icon and Delete Button */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {user?.id === post.userId && (
                            <button
                                onClick={handleDelete}
                                className={styles.deleteButton}
                                title="Delete Post"
                            >
                                <TrashIcon className={styles.trashIcon} />
                            </button>
                        )}
                        <button
                            onClick={() => setIsSpotlightModalOpen(true)}
                            className={styles.userSectionCircleButton}
                            title="Add to Circle Spotlight"
                        >
                            <CircleIcon staticIcon size={18} />
                            <span className={styles.plusIcon}>+</span>
                        </button>
                    </div>
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
                                count={votes.filter(v => v.style === s).length}
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
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        {/* Changed relative time to date string for simplicity or keep logic if imported */}
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
