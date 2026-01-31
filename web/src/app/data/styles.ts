// Style → Substyle hierarchical mapping
// Defines parent styles and their associated substyles for scoped filtering
export const STYLE_SUBSTYLE_MAP: Record<string, string[]> = {
    "Lolita": [
        "Sweet Lolita", "Gothic Lolita", "Classic Lolita", "Old-School Lolita",
        "Country Lolita", "Punk Lolita", "Sailor Lolita", "Hime Lolita",
        "Shiro Lolita", "Kuro Lolita", "Guro Lolita", "Ero Lolita",
        "Wa Lolita", "Qi Lolita", "Military Lolita", "Pirate Lolita",
        "Steampunk Lolita", "Nun Lolita", "Casual Lolita", "Mori / Natural Lolita",
        "Hijab Lolita"
    ],
    "Goth": [
        "Traditional Goth", "Romantic Goth", "Victorian Goth", "Cybergoth",
        "Deathrock", "Pastel Goth", "Mall Goth", "Nu-Goth", "Corporate Goth",
        "Fetish Goth", "White Goth"
    ],
    "Gyaru": [
        "Kogal", "Ganguro", "Manba", "Yamanba", "Tsuyome Gyaru", "Onee Gyaru",
        "Ane Gyaru", "Hime Gyaru", "Himekaji", "Agejo", "Amekaji", "Rokku",
        "Ora Ora Kei", "Mode Gyaru", "Neo Gyaru", "B-Gyaru"
    ],
    "Punk": [
        "Hardcore Punk", "Street Punk", "Anarcho-Punk", "Crust Punk",
        "Pop Punk", "Cyberpunk", "Steampunk", "Punk Lolita"
    ],
    "Emo": [
        "Midwestern Emo", "Scene", "Mall Emo", "Screamo", "Emocore"
    ],
    "Visual Kei": [
        "Kote Kei", "Koteosa Kei", "Oshare Kei", "Eroguro Kei", "Angura Kei", "Nagoya Kei"
    ],
    "Decora": [
        "Fairy Kei", "Pop Kei", "Cult Party Kei", "Cyber Decora"
    ],
    "Kawaii": [
        "Fairy Kei", "Yume Kawaii", "Menhera", "Gurokawa"
    ],
    "Jirai Kei": [
        "Classic Jirai", "Subcul Jirai", "Yami Jirai", "Menhera Jirai", "Goth Jirai",
        "Tenshi Jirai", "Ryousan Jirai", "Casual Jirai", "Idol Jirai", "Cyber Jirai",
        "Pien Jirai", "Dark Girly Jirai"
    ],
    "Girly Kei": [
        "Classic Girly Kei", "Dark Girly", "Sweet Girly", "French Girly", "Retro Girly",
        "Elegant Girly", "Casual Girly", "Romantic Girly", "Vintage Girly", "Gothic Girly",
        "Ryousan Girly"
    ],
    "Grunge": ["Soft Grunge", "Kinderwhore"],
    "Streetwear": ["Luxury Streetwear", "Skater", "Hypebeast"],
    "Y2K": ["McBling"],
    "Academia": ["Dark Academia", "Light Academia"],
    "Kei": ["Mori Kei", "Dolly Kei", "Cult Party Kei", "Angura Kei"],
};

// Extract parent styles (styles that have substyles)
export const PARENT_STYLES = Object.keys(STYLE_SUBSTYLE_MAP).sort();

// Standalone styles (no substyles)
export const STANDALONE_STYLES = [
    "Shiro-Nuri",
    "E-Girl/Boy",
    "Techwear",
    "Warcore",
    "Darkwear",
    "Cottagecore",
    "Gorpcore",
    "Normcore",
    "Bloke Core",
    "Art Hoe",
    "Indie Sleaze",
    "Twee",
    "Coquette",
    "Balletcore",
    "Vintage",
    "Retro (50s/60s/70s/80s/90s)",
    "Minimalist",
    "Maximalist",
    "Avant Garde",
    "Casual",
    "Chic",
    "Preppy",
    "Boho",
    "Athleisure",
    "Workwear",
    "Utility"
].sort();

// All styles (parent + standalone) - for the main style filter
export const ALL_STYLES = [...PARENT_STYLES, ...STANDALONE_STYLES].sort();

// Legacy flat list for backward compatibility
export const STYLES = ALL_STYLES;

/**
 * Get all substyles for a given parent style
 * @param style - The parent style name
 * @returns Array of substyle names, or empty array if no substyles exist
 */
export function getSubstylesForStyle(style: string): string[] {
    return STYLE_SUBSTYLE_MAP[style] || [];
}

/**
 * Check if a style has substyles
 * @param style - The style name to check
 * @returns true if the style has substyles, false otherwise
 */
export function hasSubstyles(style: string): boolean {
    return PARENT_STYLES.includes(style);
}

/**
 * Get the parent style for a given substyle
 * @param substyle - The substyle name
 * @returns The parent style name, or null if not found
 */
export function getParentStyle(substyle: string): string | null {
    for (const [parent, children] of Object.entries(STYLE_SUBSTYLE_MAP)) {
        if (children.includes(substyle)) {
            return parent;
        }
    }
    return null;
}
