
export interface Circle {
    id: string;
    owner_user_id: string;
    name: string;
    description?: string;
    style?: string;
    country?: string;
    created_at: string;
    updated_at: string;
}

export type CircleRole = 'OWNER' | 'MEMBER';
export type CircleStatus = 'ACTIVE' | 'INVITED';

export interface CircleMember {
    circle_id: string;
    user_id: string;
    role: CircleRole;
    status: CircleStatus;
    invited_by_user_id: string;
    invited_at: string;
    joined_at?: string;
}

export interface SpotlightEntry {
    id: string;
    circle_id: string;
    post_id: string;
    added_by_user_id: string;
    added_at: string;
    note?: string;
}

// Initial Demo Data
export const DEMO_CIRCLES: Circle[] = [
    {
        id: 'c1',
        owner_user_id: 'u1',
        name: 'Tokyo Street Style',
        description: 'A place to curate the best Harajuku looks we find.',
        created_at: '2026-01-15T10:00:00Z',
        updated_at: '2026-01-15T10:00:00Z'
    },
    {
        id: 'c2',
        owner_user_id: 'user_visual_kei_fan', // Assuming this exists or will map to someone
        name: 'Visual Kei Enthusiasts',
        description: 'Dark, edgy, and theatrical.',
        created_at: '2026-01-20T14:30:00Z',
        updated_at: '2026-01-20T14:30:00Z'
    }
];

export const DEMO_CIRCLE_MEMBERS: CircleMember[] = [
    // You (Owner of c1)
    {
        circle_id: 'c1',
        user_id: 'current_user',
        role: 'OWNER',
        status: 'ACTIVE',
        invited_by_user_id: 'current_user',
        invited_at: '2026-01-15T10:00:00Z',
        joined_at: '2026-01-15T10:00:00Z'
    },
    // You (Member of c2)
    {
        circle_id: 'c2',
        user_id: 'current_user',
        role: 'MEMBER',
        status: 'ACTIVE',
        invited_by_user_id: 'user_visual_kei_fan',
        invited_at: '2026-01-20T14:30:00Z',
        joined_at: '2026-01-21T09:00:00Z'
    }
];

export const DEMO_SPOTLIGHT_ENTRIES: SpotlightEntry[] = [];
