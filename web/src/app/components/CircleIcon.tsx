"use client";

import { motion } from "framer-motion";

interface CircleIconProps {
    onClick?: () => void;
    animateOnHover?: boolean;
    size?: number;
    staticIcon?: boolean;
    className?: string; // Support className prop
}

export default function CircleIcon({ onClick, animateOnHover = false, size = 40, staticIcon = false, className }: CircleIconProps) {
    // If size is 0 or 'auto', use 100% to inherit from parent
    const isResponsive = size === 0;
    const actualSize = isResponsive ? '100%' : size;

    return (
        <motion.div
            className={className}
            style={{
                width: actualSize,
                height: actualSize,
                cursor: onClick ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            }}
            onClick={onClick}
            whileHover={animateOnHover ? "hover" : undefined}
            whileTap={onClick ? { scale: 0.95 } : undefined}
            initial="idle"
        >
            <svg
                width={actualSize}
                height={actualSize}
                viewBox="0 0 100 100"
                style={{ overflow: 'visible', transform: 'rotate(-90deg)' }} // Start at Top
            >
                <defs>
                    <filter id="sumiFilter" x="-50%" y="-50%" width="200%" height="200%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
                    </filter>
                </defs>

                {/* Base Dark Sumi Circle (Updated Color to Match Primary Pink) */}
                <motion.circle
                    cx="50"
                    cy="50"
                    r="35"
                    stroke="#E91E63" // Primary Pink (Darker, Matching Styling)
                    strokeWidth="8" // Thick enough to be visible but "sketchy"
                    fill="none"
                    filter="url(#sumiFilter)"
                    style={{ opacity: 0.8, strokeLinecap: 'round' }}
                />

                {/* Animation: Core Highlight */}
                <motion.circle
                    cx="50"
                    cy="50"
                    r="35"
                    stroke="#F8BBD0" // Lighter pink/white core for contrast
                    strokeWidth="3"
                    fill="none"
                    filter="url(#sumiFilter)"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    variants={{
                        hover: { pathLength: 1, opacity: 1 },
                        idle: { pathLength: 0, opacity: 0 }
                    }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                />
            </svg>
        </motion.div>
    );
}
