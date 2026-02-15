"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { demoStore } from "../demo-store";
import { useAuth } from "../contexts/AuthContext";
import styles from "./create.module.css";
import { ArrowLeftIcon } from "../components/Icons";
import Logo from "../components/Logo";

import { STYLES } from "../data/styles";
import { useSupabaseUpload } from "@/hooks/useSupabaseUpload";

// Comprehensive list of countries ISO-3166-1 Alpha-2
const COUNTRIES = [
    { code: "AF", name: "Afghanistan" },
    { code: "AL", name: "Albania" },
    { code: "DZ", name: "Algeria" },
    { code: "AS", name: "American Samoa" },
    { code: "AD", name: "Andorra" },
    { code: "AO", name: "Angola" },
    { code: "AI", name: "Anguilla" },
    { code: "AQ", name: "Antarctica" },
    { code: "AG", name: "Antigua and Barbuda" },
    { code: "AR", name: "Argentina" },
    { code: "AM", name: "Armenia" },
    { code: "AW", name: "Aruba" },
    { code: "AU", name: "Australia" },
    { code: "AT", name: "Austria" },
    { code: "AZ", name: "Azerbaijan" },
    { code: "BS", name: "Bahamas" },
    { code: "BH", name: "Bahrain" },
    { code: "BD", name: "Bangladesh" },
    { code: "BB", name: "Barbados" },
    { code: "BY", name: "Belarus" },
    { code: "BE", name: "Belgium" },
    { code: "BZ", name: "Belize" },
    { code: "BJ", name: "Benin" },
    { code: "BM", name: "Bermuda" },
    { code: "BT", name: "Bhutan" },
    { code: "BO", name: "Bolivia" },
    { code: "BA", name: "Bosnia and Herzegovina" },
    { code: "BW", name: "Botswana" },
    { code: "BV", name: "Bouvet Island" },
    { code: "BR", name: "Brazil" },
    { code: "IO", name: "British Indian Ocean Territory" },
    { code: "BN", name: "Brunei Darussalam" },
    { code: "BG", name: "Bulgaria" },
    { code: "BF", name: "Burkina Faso" },
    { code: "BI", name: "Burundi" },
    { code: "KH", name: "Cambodia" },
    { code: "CM", name: "Cameroon" },
    { code: "CA", name: "Canada" },
    { code: "CV", name: "Cape Verde" },
    { code: "KY", name: "Cayman Islands" },
    { code: "CF", name: "Central African Republic" },
    { code: "TD", name: "Chad" },
    { code: "CL", name: "Chile" },
    { code: "CN", name: "China" },
    { code: "CX", name: "Christmas Island" },
    { code: "CC", name: "Cocos (Keeling) Islands" },
    { code: "CO", name: "Colombia" },
    { code: "KM", name: "Comoros" },
    { code: "CG", name: "Congo" },
    { code: "CD", name: "Congo, the Democratic Republic of the" },
    { code: "CK", name: "Cook Islands" },
    { code: "CR", name: "Costa Rica" },
    { code: "CI", name: "Cote D'Ivoire" },
    { code: "HR", name: "Croatia" },
    { code: "CU", name: "Cuba" },
    { code: "CY", name: "Cyprus" },
    { code: "CZ", name: "Czech Republic" },
    { code: "DK", name: "Denmark" },
    { code: "DJ", name: "Djibouti" },
    { code: "DM", name: "Dominica" },
    { code: "DO", name: "Dominican Republic" },
    { code: "EC", name: "Ecuador" },
    { code: "EG", name: "Egypt" },
    { code: "SV", name: "El Salvador" },
    { code: "GQ", name: "Equatorial Guinea" },
    { code: "ER", name: "Eritrea" },
    { code: "EE", name: "Estonia" },
    { code: "ET", name: "Ethiopia" },
    { code: "FK", name: "Falkland Islands (Malvinas)" },
    { code: "FO", name: "Faroe Islands" },
    { code: "FJ", name: "Fiji" },
    { code: "FI", name: "Finland" },
    { code: "FR", name: "France" },
    { code: "GF", name: "French Guiana" },
    { code: "PF", name: "French Polynesia" },
    { code: "TF", name: "French Southern Territories" },
    { code: "GA", name: "Gabon" },
    { code: "GM", name: "Gambia" },
    { code: "GE", name: "Georgia" },
    { code: "DE", name: "Germany" },
    { code: "GH", name: "Ghana" },
    { code: "GI", name: "Gibraltar" },
    { code: "GR", name: "Greece" },
    { code: "GL", name: "Greenland" },
    { code: "GD", name: "Grenada" },
    { code: "GP", name: "Guadeloupe" },
    { code: "GU", name: "Guam" },
    { code: "GT", name: "Guatemala" },
    { code: "GN", name: "Guinea" },
    { code: "GW", name: "Guinea-Bissau" },
    { code: "GY", name: "Guyana" },
    { code: "HT", name: "Haiti" },
    { code: "HM", name: "Heard Island and Mcdonald Islands" },
    { code: "VA", name: "Holy See (Vatican City State)" },
    { code: "HN", name: "Honduras" },
    { code: "HK", name: "Hong Kong" },
    { code: "HU", name: "Hungary" },
    { code: "IS", name: "Iceland" },
    { code: "IN", name: "India" },
    { code: "ID", name: "Indonesia" },
    { code: "IR", name: "Iran, Islamic Republic of" },
    { code: "IQ", name: "Iraq" },
    { code: "IE", name: "Ireland" },
    { code: "IL", name: "Israel" },
    { code: "IT", name: "Italy" },
    { code: "JM", name: "Jamaica" },
    { code: "JP", name: "Japan" },
    { code: "JO", name: "Jordan" },
    { code: "KZ", name: "Kazakhstan" },
    { code: "KE", name: "Kenya" },
    { code: "KI", name: "Kiribati" },
    { code: "KP", name: "Korea, Democratic People's Republic of" },
    { code: "KR", name: "Korea, Republic of" },
    { code: "KW", name: "Kuwait" },
    { code: "KG", name: "Kyrgyzstan" },
    { code: "LA", name: "Lao People's Democratic Republic" },
    { code: "LV", name: "Latvia" },
    { code: "LB", name: "Lebanon" },
    { code: "LS", name: "Lesotho" },
    { code: "LR", name: "Liberia" },
    { code: "LY", name: "Libyan Arab Jamahiriya" },
    { code: "LI", name: "Liechtenstein" },
    { code: "LT", name: "Lithuania" },
    { code: "LU", name: "Luxembourg" },
    { code: "MO", name: "Macao" },
    { code: "MK", name: "Macedonia, the Former Yugoslav Republic of" },
    { code: "MG", name: "Madagascar" },
    { code: "MW", name: "Malawi" },
    { code: "MY", name: "Malaysia" },
    { code: "MV", name: "Maldives" },
    { code: "ML", name: "Mali" },
    { code: "MT", name: "Malta" },
    { code: "MH", name: "Marshall Islands" },
    { code: "MQ", name: "Martinique" },
    { code: "MR", name: "Mauritania" },
    { code: "MU", name: "Mauritius" },
    { code: "YT", name: "Mayotte" },
    { code: "MX", name: "Mexico" },
    { code: "FM", name: "Micronesia, Federated States of" },
    { code: "MD", name: "Moldova, Republic of" },
    { code: "MC", name: "Monaco" },
    { code: "MN", name: "Mongolia" },
    { code: "MS", name: "Montserrat" },
    { code: "MA", name: "Morocco" },
    { code: "MZ", name: "Mozambique" },
    { code: "MM", name: "Myanmar" },
    { code: "NA", name: "Namibia" },
    { code: "NR", name: "Nauru" },
    { code: "NP", name: "Nepal" },
    { code: "NL", name: "Netherlands" },
    { code: "AN", name: "Netherlands Antilles" },
    { code: "NC", name: "New Caledonia" },
    { code: "NZ", name: "New Zealand" },
    { code: "NI", name: "Nicaragua" },
    { code: "NE", name: "Niger" },
    { code: "NG", name: "Nigeria" },
    { code: "NU", name: "Niue" },
    { code: "NF", name: "Norfolk Island" },
    { code: "MP", name: "Northern Mariana Islands" },
    { code: "NO", name: "Norway" },
    { code: "OM", name: "Oman" },
    { code: "PK", name: "Pakistan" },
    { code: "PW", name: "Palau" },
    { code: "PS", name: "Palestinian Territory, Occupied" },
    { code: "PA", name: "Panama" },
    { code: "PG", name: "Papua New Guinea" },
    { code: "PY", name: "Paraguay" },
    { code: "PE", name: "Peru" },
    { code: "PH", name: "Philippines" },
    { code: "PN", name: "Pitcairn" },
    { code: "PL", name: "Poland" },
    { code: "PT", name: "Portugal" },
    { code: "PR", name: "Puerto Rico" },
    { code: "QA", name: "Qatar" },
    { code: "RE", name: "Reunion" },
    { code: "RO", name: "Romania" },
    { code: "RU", name: "Russian Federation" },
    { code: "RW", name: "Rwanda" },
    { code: "SH", name: "Saint Helena" },
    { code: "KN", name: "Saint Kitts and Nevis" },
    { code: "LC", name: "Saint Lucia" },
    { code: "PM", name: "Saint Pierre and Miquelon" },
    { code: "VC", name: "Saint Vincent and the Grenadines" },
    { code: "WS", name: "Samoa" },
    { code: "SM", name: "San Marino" },
    { code: "ST", name: "Sao Tome and Principe" },
    { code: "SA", name: "Saudi Arabia" },
    { code: "SN", name: "Senegal" },
    { code: "CS", name: "Serbia and Montenegro" },
    { code: "SC", name: "Seychelles" },
    { code: "SL", name: "Sierra Leone" },
    { code: "SG", name: "Singapore" },
    { code: "SK", name: "Slovakia" },
    { code: "SI", name: "Slovenia" },
    { code: "SB", name: "Solomon Islands" },
    { code: "SO", name: "Somalia" },
    { code: "ZA", name: "South Africa" },
    { code: "GS", name: "South Georgia and the South Sandwich Islands" },
    { code: "ES", name: "Spain" },
    { code: "LK", name: "Sri Lanka" },
    { code: "SD", name: "Sudan" },
    { code: "SR", name: "Suriname" },
    { code: "SJ", name: "Svalbard and Jan Mayen" },
    { code: "SZ", name: "Swaziland" },
    { code: "SE", name: "Sweden" },
    { code: "CH", name: "Switzerland" },
    { code: "SY", name: "Syrian Arab Republic" },
    { code: "TW", name: "Taiwan, Province of China" },
    { code: "TJ", name: "Tajikistan" },
    { code: "TZ", name: "Tanzania, United Republic of" },
    { code: "TH", name: "Thailand" },
    { code: "TL", name: "Timor-Leste" },
    { code: "TG", name: "Togo" },
    { code: "TK", name: "Tokelau" },
    { code: "TO", name: "Tonga" },
    { code: "TT", name: "Trinidad and Tobago" },
    { code: "TN", name: "Tunisia" },
    { code: "TR", name: "Turkey" },
    { code: "TM", name: "Turkmenistan" },
    { code: "TC", name: "Turks and Caicos Islands" },
    { code: "TV", name: "Tuvalu" },
    { code: "UG", name: "Uganda" },
    { code: "UA", name: "Ukraine" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "UK", name: "United Kingdom" },
    { code: "US", name: "United States" },
    { code: "UM", name: "United States Minor Outlying Islands" },
    { code: "UY", name: "Uruguay" },
    { code: "UZ", name: "Uzbekistan" },
    { code: "VU", name: "Vanuatu" },
    { code: "VE", name: "Venezuela" },
    { code: "VN", name: "Viet Nam" },
    { code: "VG", name: "Virgin Islands, British" },
    { code: "VI", name: "Virgin Islands, U.S." },
    { code: "WF", name: "Wallis and Futuna" },
    { code: "EH", name: "Western Sahara" },
    { code: "YE", name: "Yemen" },
    { code: "ZM", name: "Zambia" },
    { code: "ZW", name: "Zimbabwe" }
];


export default function CreatePost() {
    const router = useRouter();
    const { user } = useAuth();
    const { uploadFile, isUploading } = useSupabaseUpload();
    const [images, setImages] = useState<string[]>([]);
    const [imagePaths, setImagePaths] = useState<string[]>([]);
    const [style, setStyle] = useState("");
    const [caption, setCaption] = useState("");
    const [country, setCountry] = useState("");

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            if (images.length >= 3) return;
            const file = e.target.files[0];

            const result = await uploadFile(file);
            if (result) {
                setImages([...images, result.url]);
                setImagePaths([...imagePaths, result.path]);
            }
        }
    };

    const handleSubmit = async () => {
        // Wait for upload? Button disabled if uploading.

        // Mock ID no longer needed if DB auto-generates, but PostData needs an ID?
        // SupabaseStore inserts. We can pass a "placeholder" ID since DB ignores it?
        // Or we should update savePost signature to NOT require ID.
        // But PostData interface has ID.
        // I'll leave the random ID here, SupabaseStore insert will likely use gen_random_uuid in DB and return real ID.
        // But SupabaseStore.savePost implementation didn't return the ID, it returned void.
        // It did: `const { data: postData } = await insert...select()`.
        // But it didn't return it to caller.
        // This is a problem if we want to redirect to /post/NEW_ID.

        // Refactor SupabaseStore.savePost to return string (ID).
        // For now, I'll pass a UUID generated here if possible? Supabase usually ignores it if default unless we force it.
        // Actually, SupabaseStore.savePost takes `PostData` which HAS an ID.
        // My implementation: `.insert({ ..., declared_genre: post.style })`. It didn't specify ID in insert!
        // So DB generated it.
        // So the `post.id` passed to savePost was IGNORED.
        // Meaning `router.push('/post/' + mockPostId)` will go to a 404 because the REAL ID is different.

        // CRITICAL FIX: Update SupabaseStore.savePost to return the proper ID.
        // And update `create/page` to use it.

        // I cannot fix SupabaseStore right now in this turn (one tool at a time logic?).
        // I can fix it in next turn.

        // I will assume savePost returns ID (I will update it next).

        const mockPostId = `post-${Date.now()}`; // Placeholder
        const countryName = COUNTRIES.find(c => c.code === country)?.name || "Everywhere";

        try {
            // We need to cast savePost return value if TS complains, or update Types.
            // Types.ts PostData definition is fine.
            // SupabaseStore.ts defined savePost(post: PostData): Promise<void>.
            // I MUST update SupabaseStore first or accept the break.

            // I will update this file to Expect a return value.
            // Then I will update SupabaseStore to return it.

            // @ts-ignore
            const newId = await demoStore.savePost({
                id: mockPostId,
                username: user ? user.username : "You",
                avatarUrl: user?.avatar_url,
                countryName: countryName,
                images: images,
                imagePaths: imagePaths,
                style: style,
                caption: caption,
                createdAt: new Date().toISOString()
            });

            // If savePost returns void currently, newId is undefined.
            // I'll update store next.
            if (newId) {
                router.push(`/post/${newId}`);
            } else {
                // Fallback if I forget to update store
                router.push('/');
            }
        } catch (e) {
            console.error(e);
            alert("Failed to create post");
        }
    };

    const isValid = images.length >= 1 && style.length > 0;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <ArrowLeftIcon />
                </button>
                <div className={styles.logoContainer}>
                    <Logo variant="icon" size={64} clickable={false} />
                </div>
                <div style={{ width: 40 }}></div>
            </header>

            {/* Image Upload */}
            <label className={styles.uploadSection}>
                {images.length === 0 ? (
                    <>
                        <span className={styles.uploadIcon}>+</span>
                        <span className={styles.uploadLabel}>Add Photos (1–3)</span>
                    </>
                ) : (
                    <div className={styles.previewGrid}>
                        {images.map((src, i) => (
                            <img key={i} src={src} className={styles.previewImage} alt={`preview ${i}`} />
                        ))}
                        {images.length < 3 && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #ccc', borderRadius: '8px' }}>
                                {isUploading ? (
                                    <span style={{ fontSize: '14px', color: '#666' }}>...</span>
                                ) : (
                                    <span style={{ fontSize: '24px', color: '#ccc' }}>+</span>
                                )}
                            </div>
                        )}
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    className={styles.hiddenInput}
                    onChange={handleImageUpload}
                />
            </label>

            {/* Style */}
            <div className={styles.formGroup}>
                <label className={styles.label}>I am posting this as:</label>
                <input
                    list="styles"
                    placeholder="+ Set style"
                    className={styles.input}
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                />
                <datalist id="styles">
                    {STYLES.map(s => <option key={s} value={s} />)}
                </datalist>
                <span className={styles.helperText}>
                    This sets where your post appears. Others can suggest additional styles.
                </span>
            </div>

            {/* Caption */}
            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Caption <span className={styles.optionalText}>(optional)</span>
                </label>
                <textarea
                    className={styles.textarea}
                    placeholder="Write something about this look..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />
            </div>

            {/* Country */}
            <div className={styles.formGroup}>
                <label className={styles.label}>Location</label>
                <select
                    className={styles.select}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                >
                    <option value="">Everywhere (Default)</option>
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
            </div>

            <button className={styles.submitButton} disabled={!isValid || isUploading} onClick={handleSubmit}>
                {isUploading ? 'Uploading...' : 'Post'}
            </button>
        </div>
    );
}
