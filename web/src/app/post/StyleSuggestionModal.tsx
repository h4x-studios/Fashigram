"use client";

import { useState } from "react";
import styles from "./StyleSuggestionModal.module.css";

import { STYLES } from "../data/styles";

interface StyleSuggestionModalProps {
    existingStyles: string[];
    onSelect: (style: string) => void;
    onClose: () => void;
}

export default function StyleSuggestionModal({ existingStyles, onSelect, onClose }: StyleSuggestionModalProps) {
    const [search, setSearch] = useState("");

    const filteredStyles = STYLES
        .filter(s => !existingStyles.includes(s))
        .filter(s => s.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <header className={styles.header}>
                    <span className={styles.title}>Suggest a Style</span>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </header>

                <div className={styles.searchSection}>
                    <input
                        autoFocus
                        className={styles.searchInput}
                        placeholder="Search styles..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className={styles.list}>
                    {filteredStyles.length === 0 ? (
                        <div style={{ padding: 16, textAlign: 'center', color: '#888' }}>No matching styles found</div>
                    ) : (
                        filteredStyles.map(s => (
                            <div key={s} className={styles.option} onClick={() => onSelect(s)}>
                                <span>{s}</span>
                                <span style={{ fontSize: 20, color: '#ccc' }}>+</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
