"use client";

import styles from "./profile.module.css";
import { PostData } from "../demo-store";

interface ProfilePostTileProps {
    post: PostData;
    onClick: () => void;
}

export default function ProfilePostTile({ post, onClick }: ProfilePostTileProps) {
    return (
        <div className={styles.tile} onClick={onClick}>
            <img src={post.images[0]} alt={`Post by ${post.username}`} />
            <div className={styles.tileOveraly} />
        </div>
    );
}
