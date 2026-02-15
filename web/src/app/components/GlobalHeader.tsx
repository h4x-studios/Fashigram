"use client";

import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';
import styles from './GlobalHeader.module.css';
import { MenuIcon, ArrowLeftIcon } from './Icons';
import { useState } from 'react';
import Sidebar from './Sidebar';

export default function GlobalHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isHome = pathname === '/';

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <header className={styles.header}>
                <div className={styles.actionLeft}>
                    {isHome ? (
                        <button className={styles.iconButton} onClick={() => setIsSidebarOpen(true)}>
                            <MenuIcon />
                        </button>
                    ) : (
                        <button className={styles.iconButton} onClick={() => router.back()}>
                            <ArrowLeftIcon />
                        </button>
                    )}
                </div>

                <div className={styles.logoContainer}>
                    <Logo variant="full" size={40} clickable={true} />
                </div>

                <div className={styles.actionRight}>
                    {/* Placeholder for symmetry or Search icon if desired */}
                </div>
            </header>
        </>
    );
}
