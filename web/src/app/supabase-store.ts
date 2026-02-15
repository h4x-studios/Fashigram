import { supabase } from '@/supabase/config';
import { PostData, StyleVote, User, Circle, CircleMember, SpotlightEntry } from './types';

// Helper to map DB Post to App PostData
const mapPost = (dbPost: any): PostData => {
    return {
        id: dbPost.id,
        userId: dbPost.user_id,
        username: dbPost.user?.username || 'unknown',
        avatarUrl: dbPost.user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown',
        countryName: dbPost.country_name,
        images: dbPost.post_images ? dbPost.post_images.map((img: any) => img.url) : [],
        style: dbPost.declared_genre,
        substyle: dbPost.substyle,
        caption: dbPost.caption,
        createdAt: dbPost.created_at
    };
};

export class SupabaseStore {

    async getAllPosts(): Promise<PostData[]> {
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                user:users(username, avatar_url),
                post_images(url, order_index)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching posts:', error);
            return [];
        }

        return data.map(p => {
            if (p.post_images) {
                p.post_images.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
            }
            return mapPost(p);
        });
    }

    async getPost(id: string): Promise<PostData | null> {
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                user:users(username, avatar_url),
                post_images(url, order_index)
            `)
            .eq('id', id)
            .single();

        if (error) return null;

        if (data.post_images) {
            data.post_images.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
        }
        return mapPost(data);
    }

    async savePost(post: PostData): Promise<string> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data: postData, error: postError } = await supabase
            .from('posts')
            .insert({
                user_id: user.id,
                declared_genre: post.style,
                caption: post.caption,
                country_name: post.countryName
            })
            .select()
            .single();

        if (postError) throw postError;

        if (post.images.length > 0) {
            const imageInserts = post.images.map((url, idx) => ({
                post_id: postData.id,
                url: url,
                storage_path: post.imagePaths?.[idx] || url.split('/').pop() || 'unknown',
                order_index: idx
            }));

            const { error: imgError } = await supabase
                .from('post_images')
                .insert(imageInserts);
            if (imgError) {
                console.error("Error saving images", imgError);
                throw new Error("Failed to save post images: " + imgError.message);
            }
        }

        await this.addVote({
            postId: postData.id,
            style: post.style,
            userId: user.id,
            voteType: 'DECLARED',
            createdAt: new Date().toISOString()
        });

        return postData.id;
    }

    async deletePost(id: string): Promise<boolean> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { error } = await supabase
            .from('posts')
            .delete()
            .match({ id, user_id: user.id });

        return !error;
    }

    // PROFILE METHODS
    async getUser(username: string): Promise<User | null> {
        const { data, error } = await supabase.from('users').select('*').eq('username', username).single();
        if (error) return null;
        return {
            id: data.id,
            username: data.username,
            avatarUrl: data.avatar_url,
            bio: data.bio
        };
    }

    async getPostsByUsername(username: string): Promise<PostData[]> {
        // inner join on users to filter by username
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                user:users!inner(username, avatar_url),
                post_images(url, order_index)
            `)
            .eq('user.username', username)
            .order('created_at', { ascending: false });

        if (error) return [];
        return data.map(p => {
            if (p.post_images) {
                p.post_images.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
            }
            return mapPost(p);
        });
    }

    // VOTES
    async getVotesForPost(postId: string): Promise<StyleVote[]> {
        const { data, error } = await supabase
            .from('post_genre_votes')
            .select('*')
            .eq('post_id', postId);

        if (error) return [];
        return data.map((v: any) => ({
            postId: v.post_id,
            style: v.genre,
            userId: v.user_id,
            voteType: v.vote_type,
            createdAt: v.created_at
        }));
    }

    async addVote(vote: StyleVote): Promise<boolean> {
        const { error } = await supabase
            .from('post_genre_votes')
            .insert({
                post_id: vote.postId,
                user_id: vote.userId,
                genre: vote.style,
                vote_type: vote.voteType
            });
        return !error;
    }

    async removeVote(postId: string, style: string, userId: string): Promise<boolean> {
        const { error } = await supabase
            .from('post_genre_votes')
            .delete()
            .match({ post_id: postId, genre: style, user_id: userId });
        return !error;
    }

    async getVoteCountForStyle(postId: string, style: string): Promise<number> {
        const { count } = await supabase
            .from('post_genre_votes')
            .select('*', { count: 'exact', head: true })
            .match({ post_id: postId, genre: style });
        return count || 0;
    }

    async hasUserVotedForStyle(postId: string, style: string, userId: string): Promise<boolean> {
        const { count } = await supabase
            .from('post_genre_votes')
            .select('*', { count: 'exact', head: true })
            .match({ post_id: postId, genre: style, user_id: userId });
        return (count || 0) > 0;
    }

    async getSuggestedStylesForPost(postId: string, declaredStyle: string): Promise<string[]> {
        const votes = await this.getVotesForPost(postId);
        const suggestionsMap: Record<string, number> = {};
        votes.forEach(v => {
            if (v.voteType === 'SUGGESTED' && v.style !== declaredStyle) {
                suggestionsMap[v.style] = (suggestionsMap[v.style] || 0) + 1;
            }
        });
        return Object.keys(suggestionsMap).sort((a, b) => suggestionsMap[b] - suggestionsMap[a]);
    }

    // Circles Implementation
    async getCirclesForUser(userId: string): Promise<Circle[]> {
        const { data, error } = await supabase
            .from('circle_members')
            .select('circles(*)')
            .eq('user_id', userId)
            .eq('status', 'ACTIVE');

        if (error || !data) return [];
        return data.map((d: any) => d.circles).filter(Boolean);
    }

    async createCircle(name: string, description: string | undefined, ownerUserId: string): Promise<Circle> {
        const { data: circle, error: circleError } = await supabase
            .from('circles')
            .insert({
                name,
                description,
                owner_user_id: ownerUserId
            })
            .select()
            .single();

        if (circleError) throw circleError;

        // Automatically add owner as ACTIVE member
        const { error: memberError } = await supabase
            .from('circle_members')
            .insert({
                circle_id: circle.id,
                user_id: ownerUserId,
                role: 'OWNER',
                status: 'ACTIVE',
                invited_by_user_id: ownerUserId,
                joined_at: new Date().toISOString()
            });

        if (memberError) throw memberError;

        return circle;
    }

    async getCircle(circleId: string): Promise<Circle | null> {
        const { data, error } = await supabase
            .from('circles')
            .select('*')
            .eq('id', circleId)
            .single();

        if (error) return null;
        return data;
    }

    async updateCircle(circleId: string, name: string, description: string | undefined): Promise<boolean> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { error } = await supabase
            .from('circles')
            .update({ name, description, updated_at: new Date().toISOString() })
            .match({ id: circleId, owner_user_id: user.id });

        return !error;
    }

    async getCircleMembers(circleId: string, status: 'ACTIVE' | 'INVITED' = 'ACTIVE'): Promise<CircleMember[]> {
        const { data, error } = await supabase
            .from('circle_members')
            .select('*')
            .eq('circle_id', circleId)
            .eq('status', status);

        if (error) return [];
        return data;
    }

    async isCircleMember(circleId: string, userId: string): Promise<boolean> {
        const { count } = await supabase
            .from('circle_members')
            .select('*', { count: 'exact', head: true })
            .match({ circle_id: circleId, user_id: userId, status: 'ACTIVE' });

        return (count || 0) > 0;
    }

    async inviteToCircle(circleId: string, username: string, invitedByUserId: string): Promise<boolean> {
        // 1. Get user by username
        const user = await this.getUser(username);
        if (!user) return false;

        // 2. Insert invite
        const { error } = await supabase
            .from('circle_members')
            .insert({
                circle_id: circleId,
                user_id: user.id,
                role: 'MEMBER',
                status: 'INVITED',
                invited_by_user_id: invitedByUserId
            });

        return !error;
    }

    async addToSpotlight(postId: string, circleId: string, userId: string): Promise<boolean> {
        const { error } = await supabase
            .from('spotlight_entries')
            .insert({
                post_id: postId,
                circle_id: circleId,
                added_by_user_id: userId
            });

        return !error;
    }

    async removeFromSpotlight(postId: string, circleId: string): Promise<boolean> {
        const { error } = await supabase
            .from('spotlight_entries')
            .delete()
            .match({ post_id: postId, circle_id: circleId });

        return !error;
    }

    async getCirclesWithPostInSpotlight(postId: string): Promise<string[]> {
        const { data, error } = await supabase
            .from('spotlight_entries')
            .select('circle_id')
            .eq('post_id', postId);

        if (error || !data) return [];
        return data.map(d => d.circle_id);
    }

    async getSpotlightPostsForCircle(circleId: string): Promise<PostData[]> {
        const { data, error } = await supabase
            .from('spotlight_entries')
            .select(`
                posts(
                    *,
                    user:users(username, avatar_url),
                    post_images(url, order_index)
                )
            `)
            .eq('circle_id', circleId);

        if (error || !data) return [];

        return data.map((d: any) => {
            const p = d.posts;
            if (p.post_images) {
                p.post_images.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
            }
            return mapPost(p);
        });
    }
}

export const supabaseStore = new SupabaseStore();
