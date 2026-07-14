import { cn } from '@/lib/utils';

type WeddingPanelProps = {
    children: React.ReactNode;
    className?: string;
    accent?: 'gold' | 'navy' | 'none';
};

export default function WeddingPanel({
    children,
    className,
    accent = 'gold',
}: WeddingPanelProps) {
    return (
        <div
            className={cn(
                'relative w-full border border-wedding-sage/20 bg-wedding-ivory shadow-[0_20px_50px_-30px_rgba(26,36,55,0.35)]',
                className,
            )}
        >
            {accent !== 'none' && (
                <span
                    className={cn(
                        'absolute top-0 left-0 h-0.5 w-full',
                        accent === 'gold' && 'bg-wedding-gold',
                        accent === 'navy' && 'bg-wedding-navy',
                    )}
                    aria-hidden="true"
                />
            )}
            {children}
        </div>
    );
}
