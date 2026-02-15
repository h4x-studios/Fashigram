import { Circle, CircleMember, SpotlightEntry } from './data/circles-data';

export type { Circle, CircleMember, SpotlightEntry };

export interface PostData {
    id: string;
    username: string;
    avatarUrl?: string; // from user profile
    countryName?: string;
    images: string[];
    imagePaths?: string[]; // Optional storage paths
    style: string; // declared_genre
    substyle?: string;
    caption?: string;
    createdAt: string;
}

export interface StyleVote {
    postId: string;
    style: string; // genre
    userId: string;
    voteType: 'DECLARED' | 'SUGGESTED';
    createdAt: string;
}

export interface User {
    id: string;
    username: string;
    avatarUrl: string;
    bio?: string;
}
