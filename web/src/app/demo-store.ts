// Simple singleton to store post data for the demo flow
// In a real app, this would be Supabase.

export interface PostData {
    id: string;
    username: string;
    avatarUrl?: string;
    countryName?: string;
    images: string[];
    style: string;
    substyle?: string;  // Optional substyle for scoped filtering
    caption?: string;
    createdAt: string;
}

export interface StyleVote {
    postId: string;
    style: string;
    userId: string;
    voteType: 'DECLARED' | 'SUGGESTED';
    createdAt: string;
}

// Feature 6: User Profiles
export interface User {
    id: string;
    username: string;
    avatarUrl: string;
    bio?: string;
}

// Feature 8: Circles
import {
    Circle, CircleMember, SpotlightEntry,
    DEMO_CIRCLES, DEMO_CIRCLE_MEMBERS, DEMO_SPOTLIGHT_ENTRIES
} from './data/circles-data';

export type { Circle, CircleMember, SpotlightEntry };


class DemoStore {
    private posts: Record<string, PostData> = {};
    private votes: StyleVote[] = [];
    private users: Record<string, User> = {}; // Feature 6: User storage
    // Feature 8: Circles storage
    private circles: Record<string, Circle> = {};
    private circleMembers: CircleMember[] = [];
    private spotlightEntries: SpotlightEntry[] = [];

    constructor() {
        // Try loading from storage first
        this.load();

        // Seed if empty (and we have seed methods available/called)
        // Note: seedDemoPosts might be called externally, but we ensure circles init
        // If posts are empty, maybe seed them?
        if (Object.keys(this.posts).length === 0) {
            this.seedDemoPosts();
        }
    }

    private save() {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem('fashigram_circles', JSON.stringify(this.circles));
            localStorage.setItem('fashigram_members', JSON.stringify(this.circleMembers));
            localStorage.setItem('fashigram_posts', JSON.stringify(this.posts));
            localStorage.setItem('fashigram_votes', JSON.stringify(this.votes));
            localStorage.setItem('fashigram_spotlight', JSON.stringify(this.spotlightEntries));
        } catch (e) {
            console.error("Failed to save to localStorage", e);
        }
    }

    private load() {
        if (typeof window === 'undefined') return;
        try {
            const c = localStorage.getItem('fashigram_circles');
            if (c) this.circles = JSON.parse(c);

            const m = localStorage.getItem('fashigram_members');
            if (m) this.circleMembers = JSON.parse(m);

            const p = localStorage.getItem('fashigram_posts');
            if (p) this.posts = JSON.parse(p);

            const v = localStorage.getItem('fashigram_votes');
            if (v) this.votes = JSON.parse(v);

            const s = localStorage.getItem('fashigram_spotlight');
            if (s) this.spotlightEntries = JSON.parse(s);
        } catch (e) {
            console.error("Failed to load from localStorage", e);
        }
    }

    getCurrentUserId(): string {
        return 'demo-user-1';
    }

    savePost(post: PostData) {
        this.posts[post.id] = post;
        // In a real app we'd do this transactionally, here we can do it manually in the UI or here.
        // Let's keep it simple and handle vote addition in the UI for clarity of the feature steps.
    }

    getPost(id: string): PostData | null {
        return this.posts[id] || null;
    }

    addVote(vote: StyleVote): boolean {
        // Enforce unique vote per user per style per post
        const exists = this.votes.some(v =>
            v.postId === vote.postId &&
            v.style === vote.style &&
            v.userId === vote.userId
        );
        if (exists) return false;
        this.votes.push(vote);
        return true;
    }

    removeVote(postId: string, style: string, userId: string): boolean {
        const initialLength = this.votes.length;
        this.votes = this.votes.filter(v =>
            !(v.postId === postId && v.style === style && v.userId === userId)
        );
        return this.votes.length < initialLength;
    }

    getVotesForPost(postId: string): StyleVote[] {
        return this.votes.filter(v => v.postId === postId);
    }
    // Feature 3 & 4 additions
    getVoteCountForStyle(postId: string, style: string): number {
        return this.votes.filter(v => v.postId === postId && v.style === style).length;
    }

    hasUserVotedForStyle(postId: string, style: string, userId: string): boolean {
        return this.votes.some(v =>
            v.postId === postId && v.style === style && v.userId === userId
        );
    }

    getSuggestedStylesForPost(postId: string, declaredStyle: string): string[] {
        const votes = this.getVotesForPost(postId);
        const suggestions = votes
            .filter(v => v.voteType === 'SUGGESTED' && v.style !== declaredStyle)
            .reduce((acc, v) => {
                if (!acc[v.style]) {
                    acc[v.style] = { style: v.style, count: 0, firstSeen: v.createdAt };
                }
                acc[v.style].count++;
                return acc;
            }, {} as Record<string, { style: string; count: number; firstSeen: string }>);

        return Object.values(suggestions)
            .sort((a, b) => {
                // Feature 4: Sort by Vote Count DESC, then Timestamp ASC
                if (b.count !== a.count) return b.count - a.count;
                return a.firstSeen.localeCompare(b.firstSeen);
            })
            .map(s => s.style);
    }

    // Check if a post has any votes (to auto-add declared vote if fresh)
    areVotesInitialized(postId: string): boolean {
        return this.votes.some(v => v.postId === postId);
    }

    // Feature 5: Feed support
    getAllPosts(): PostData[] {
        return Object.values(this.posts);
    }

    seedDemoPosts() {
        // Import substyle utilities
        const { getSubstylesForStyle } = require('./data/styles');

        const styles = ["Decora", "Lolita", "Gyaru", "Visual Kei", "Goth", "Streetwear", "Y2K", "Techwear", "Cottagecore", "Grunge"];
        const countries: (string | undefined)[] = ["United States", "Japan", "United Kingdom", "France", "South Korea", undefined];
        const usernames = ["SakuraDreams", "TokyoVibe", "GothQueen", "StreetKing", "VintageVibes", "CyberPunk", "KawaiiCutie", "DarkAesthetic", "RetroRevival", "FashionFwd"];

        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        for (let i = 0; i < 15; i++) {
            const id = `demo-post-${i}`;
            const style = styles[i % styles.length];
            const country = countries[i % countries.length];
            const username = usernames[i % usernames.length];
            const daysAgo = Math.floor(i / 2); // Spread posts over ~7 days
            const createdAt = new Date(now - (daysAgo * oneDay)).toISOString();

            // Assign substyle if parent style has substyles (70% of the time)
            const substyles = getSubstylesForStyle(style);
            const substyle = substyles.length > 0 && Math.random() > 0.3
                ? substyles[Math.floor(Math.random() * substyles.length)]
                : undefined;

            this.posts[id] = {
                id,
                username,
                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
                countryName: country,
                images: [
                    `https://images.unsplash.com/photo-${1500000000000 + i * 10000000}?w=400&q=80`,
                    `https://images.unsplash.com/photo-${1500000000000 + i * 10000000 + 5000000}?w=400&q=80`
                ],
                style,
                substyle,  // NEW: Assign substyle
                caption: substyle
                    ? `Showcasing my ${substyle} style!`
                    : `Showcasing my ${style} style!`,
                createdAt
            };

            // Add 1-20 declared votes (varied)
            const voteCount = 1 + Math.floor(Math.random() * 20);
            for (let v = 0; v < voteCount; v++) {
                this.addVote({
                    postId: id,
                    style,
                    userId: `voter-${v}`,
                    voteType: 'DECLARED',
                    createdAt
                });
            }
        }

        // Feature 6: Seed users after seeding posts
        this.seedDemoUsers(usernames);
    }

    // Feature 6 Methods
    addUser(user: User): void {
        this.users[user.username] = user;

        // Auto-seed posts for this user if none exist, so the profile isn't empty (for demo purposes)
        const userPosts = this.getPostsByUsername(user.username);
        if (userPosts.length === 0) {
            const styles = ["Streetwear", "CyberPunk", "Harajuku"];
            const now = Date.now();

            for (let i = 0; i < 3; i++) {
                const id = `demo-post-${user.username}-${i}`;
                const style = styles[i];
                const createdAt = new Date(now - (i * 86400000)).toISOString();

                this.posts[id] = {
                    id,
                    username: user.username,
                    avatarUrl: user.avatarUrl,
                    countryName: "United States",
                    images: [
                        `https://images.unsplash.com/photo-${1500000000000 + (i + 20) * 10000000}?w=400&q=80`
                    ],
                    style,
                    caption: `My first ${style} look! #fashigram`,
                    createdAt
                };

                this.addVote({
                    postId: id,
                    style,
                    userId: user.id,
                    voteType: 'DECLARED',
                    createdAt
                });
            }
        }
    }

    getUser(username: string): User | null {
        // Safety check: If posts exist but users don't (e.g. HMR or partial seed), re-seed users
        if (Object.keys(this.users).length === 0 && Object.keys(this.posts).length > 0) {
            const usernames = Object.values(this.posts).map(p => p.username);
            this.seedDemoUsers(usernames);
        }

        // Failsafe for "You" profile
        if (username === 'You' && !this.users['You']) {
            this.users['You'] = {
                id: 'current-user',
                username: 'You',
                avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
                bio: 'My personal fashion archive.'
            };
        }

        return Object.values(this.users).find(u => u.username === username) || null;
    }

    getPostsByUsername(username: string): PostData[] {
        return Object.values(this.posts)
            .filter(p => p.username === username)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    private seedDemoUsers(usernames: string[]) {
        // Create a user record for each unique username used in posts
        const distinctUsernames = Array.from(new Set(usernames));

        distinctUsernames.forEach(username => {
            this.users[username] = {
                id: `user-${username}`,
                username: username,
                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
                bio: `Lover of ${['J-Fashion', 'streetwear', 'vintage', 'avant-garde'][Math.floor(Math.random() * 4)]}. capturing style moments.`
            };
        });

        // Add "You" as the current user
        this.users['You'] = {
            id: 'current-user',
            username: 'You',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
            bio: 'My personal fashion archive.'
        };
    }

    // Feature 8: Circles Methods (Phase 1)

    // Initialize demo data for circles
    initCircles() {
        if (Object.keys(this.circles).length > 0) return; // Already initialized or loaded

        DEMO_CIRCLES.forEach(c => this.circles[c.id] = c);
        this.circleMembers = [...DEMO_CIRCLE_MEMBERS];
        this.spotlightEntries = [...DEMO_SPOTLIGHT_ENTRIES];
        this.save();
    }

    createCircle(name: string, description: string | undefined, ownerUserId: string): Circle {
        this.initCircles();
        const id = `c-${Date.now()}`; // Simple ID gen
        const now = new Date().toISOString();

        const newCircle: Circle = {
            id,
            owner_user_id: ownerUserId,
            name,
            description,
            created_at: now,
            updated_at: now
        };

        this.circles[id] = newCircle;

        // Add owner as member
        this.circleMembers.push({
            circle_id: id,
            user_id: ownerUserId,
            role: 'OWNER',
            status: 'ACTIVE',
            invited_by_user_id: ownerUserId,
            invited_at: now,
            joined_at: now
        });

        this.save();
        return newCircle;

        this.circles[id] = newCircle;

        // Add owner as member
        this.circleMembers.push({
            circle_id: id,
            user_id: ownerUserId,
            role: 'OWNER',
            status: 'ACTIVE',
            invited_by_user_id: ownerUserId,
            invited_at: now,
            joined_at: now
        });

        return newCircle;
    }

    getCirclesForUser(userId: string, status?: 'ACTIVE' | 'INVITED'): Circle[] {
        this.initCircles();
        const userMemberships = this.circleMembers.filter(m =>
            m.user_id === userId &&
            (!status || m.status === status)
        );

        return userMemberships
            .map(m => this.circles[m.circle_id])
            .filter(Boolean)
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }

    getCircle(circleId: string): Circle | null {
        this.initCircles();
        return this.circles[circleId] || null;
    }

    getCircleMembers(circleId: string, status?: 'ACTIVE' | 'INVITED'): CircleMember[] {
        this.initCircles();
        return this.circleMembers.filter(m =>
            m.circle_id === circleId &&
            (!status || m.status === status)
        );
    }

    // Basic Access Check
    isCircleMember(circleId: string, userId: string, requireActive = true): boolean {
        this.initCircles();
        const member = this.circleMembers.find(m => m.circle_id === circleId && m.user_id === userId);
        if (!member) return false;
        return requireActive ? member.status === 'ACTIVE' : true;
    }

    inviteToCircle(circleId: string, username: string, invitedByUserId: string): boolean {
        this.initCircles();
        const user = Object.values(this.users).find(u => u.username === username);
        if (!user) return false; // User not found

        // Check if already member
        if (this.isCircleMember(circleId, user.id, false)) return false;

        const now = new Date().toISOString();
        this.circleMembers.push({
            circle_id: circleId,
            user_id: user.id,
            role: 'MEMBER',
            status: 'INVITED',
            invited_by_user_id: invitedByUserId,
            invited_at: now
        });

        return true;
    }

    // Spotlight Management Methods
    addToSpotlight(postId: string, circleId: string, userId: string): boolean {
        this.initCircles();

        // Check if already exists
        const exists = this.spotlightEntries.some(
            e => e.post_id === postId && e.circle_id === circleId
        );

        if (exists) return false;

        const entry: SpotlightEntry = {
            id: `spotlight-${Date.now()}-${Math.random()}`,
            circle_id: circleId,
            post_id: postId,
            added_by_user_id: userId,
            added_at: new Date().toISOString(),
            note: undefined
        };

        this.spotlightEntries.push(entry);
        this.save();
        return true;
    }

    removeFromSpotlight(postId: string, circleId: string): boolean {
        this.initCircles();
        const initialLength = this.spotlightEntries.length;

        this.spotlightEntries = this.spotlightEntries.filter(
            e => !(e.post_id === postId && e.circle_id === circleId)
        );

        this.save();
        return this.spotlightEntries.length < initialLength;
    }

    getCirclesWithPostInSpotlight(postId: string): string[] {
        this.initCircles();
        return this.spotlightEntries
            .filter(e => e.post_id === postId)
            .map(e => e.circle_id);
    }

    getSpotlightPostsForCircle(circleId: string): PostData[] {
        this.initCircles();
        const spotlightPostIds = this.spotlightEntries
            .filter(e => e.circle_id === circleId)
            .map(e => e.post_id);

        return spotlightPostIds
            .map(id => this.getPost(id))
            .filter((p): p is PostData => p !== null);
    }
}

// Global instance
export const demoStore = new DemoStore();
