import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
    variant?: 'full' | 'icon';
    size?: number;
    clickable?: boolean;
    color?: string;
}

export default function Logo({ variant = 'full', size = 32, clickable = true, color = 'var(--text-primary)' }: LogoProps) {
    // Always use the icon image
    const logoSrc = '/logo/logo-transparent.png';
    const alt = 'Fashigram';

    // Check if we are in "white mode" (sidebar) based on the passed color prop
    const isWhite = color === 'white' || color === '#ffffff' || color === '#fff';

    const logoContent = (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
                position: 'relative',
                width: size,
                height: size,
                // Nudge icon down slightly to align its visual center (circle) with the text cap height
                transform: 'translateY(2px)'
            }}>
                <Image
                    src={logoSrc}
                    alt={alt}
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                />
            </div>
            {variant === 'full' && (
                <span style={{
                    fontFamily: 'var(--font-outfit)',
                    fontWeight: 800,
                    fontSize: Math.max(22, size * 0.55), // Reverted to smaller relative size
                    background: isWhite ? 'none' : 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
                    WebkitBackgroundClip: isWhite ? 'unset' : 'text',
                    WebkitTextFillColor: isWhite ? 'white' : 'transparent',
                    color: color,
                    letterSpacing: '-0.03em',
                    lineHeight: '1.2',
                    paddingBottom: '2px', // Reduced padding
                    textShadow: isWhite ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                    display: 'inline-block',
                    // Text is naturally centered by flex, but cap-height alignment often needs text to sit 'lower' or icon 'lower'
                    // We nudged icon down, so we keep text neutral or slight adjust
                    transform: 'translateY(0px)'
                }}>
                    Fashigram
                </span>
            )}
        </div>
    );

    if (clickable) {
        return (
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                {logoContent}
            </Link>
        );
    }

    return logoContent;
}
