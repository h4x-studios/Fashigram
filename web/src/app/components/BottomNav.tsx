"use client";

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { HomeIcon, GlobeIcon, PlusIcon, UserIcon } from './Icons';
import CircleIcon from './CircleIcon';
import styles from './BottomNav.module.css';

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname?.startsWith(path)) return true;
        return false;
    };

    return (
        <nav className={styles.nav}>
            <div className={styles.navInner}>
                <Link href="/" className={`${styles.item} ${isActive('/') ? styles.active : ''}`}>
                    <HomeIcon className={styles.icon} filled={true} />
                </Link>

                <div className={styles.fabContainer} onClick={() => router.push('/create')}>
                    <div className={styles.fab}>
                        <PlusIcon className={styles.fabIcon} />
                    </div>
                </div>

                <Link href="/circles" className={`${styles.item} ${isActive('/circles') ? styles.active : ''}`}>
                    <div className={styles.circleIconContainer}>
                        <CircleIcon size={0} staticIcon={!isActive('/circles')} animateOnHover={true} />
                    </div>
                </Link>

                <Link href="/profile/you" className={`${styles.item} ${isActive('/profile') ? styles.active : ''}`}>
                    <UserIcon className={styles.icon} filled={true} />
                </Link>
            </div>
        </nav>
    );
}
