"use client";

import styles from "./StyleChip.module.css";

interface StyleChipProps {
    label: string;
    count: number;
    isDeclared?: boolean;
    isVoted?: boolean;
    onClick?: () => void;
}

export default function StyleChip({ label, count, isDeclared = false, isVoted = false, onClick }: StyleChipProps) {
    // Bucketing logic
    let sizeClass = styles.sizeSmall;
    if (count > 50) sizeClass = styles.sizeLarge;
    else if (count > 10) sizeClass = styles.sizeMedium;

    return (
        <div
            className={`${styles.chipContainer} ${isDeclared ? styles.declared : ''} ${isVoted ? styles.voted : ''} ${sizeClass}`}
            onClick={onClick}
        >
            <div className={styles.styleBubble}>
                {label}
            </div>
            <div className={styles.voteBubble}>
                {count}
            </div>
        </div>
    );
}
