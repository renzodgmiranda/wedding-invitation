import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type WeddingRevealProps = {
    children: React.ReactNode;
    className?: string;
    delayMs?: number;
};

export default function WeddingReveal({
    children,
    className,
    delayMs = 0,
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
                'translate-y-6 opacity-0 transition-[opacity,transform] duration-700 ease-out',
                visible && 'translate-y-0 opacity-100',
                className,
            )}
            style={{ transitionDelay: visible ? `${delayMs}ms` : undefined }}
        >
            {children}
        </div>
    );
}
