"use client";

import styles from "./PostTile.module.css";
import { PostData } from "../demo-store";

interface PostTileProps {
    post: PostData;
    onClick: () => void;
}

export default function PostTile({ post, onClick }: PostTileProps) {
    return (
        <div className={styles.tile} onClick={onClick}>
            <div className={styles.imageContainer}>
                <img src={post.images[0]} alt={`${post.style} by ${post.username}`} />
            </div>
            <div className={styles.info}>
                <span className={styles.style}>{post.style}</span>
                <span className={styles.username}>@{post.username}</span>
            </div>
        </div>
    );
}
