import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type WeddingRevealProps = {
    children: React.ReactNode;
    className?: string;
    delayMs?: number;
    /** Avoid transform when wrapping photos (transforms can soft-blur images). */
    fadeOnly?: boolean;
};

export default function WeddingReveal({
    children,
    className,
    delayMs = 0,
    fadeOnly = false,
}: WeddingRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;

        if (!node) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={cn(
                'opacity-0 ease-out',
                fadeOnly
                    ? 'transition-opacity duration-700'
                    : 'translate-y-6 transition-[opacity,transform] duration-700',
                visible && 'opacity-100',
                visible && !fadeOnly && 'translate-y-0',
                className,
            )}
            style={{ transitionDelay: visible ? `${delayMs}ms` : undefined }}
        >
            {children}
        </div>
    );
}
