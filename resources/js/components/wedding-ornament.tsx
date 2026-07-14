export default function WeddingOrnament({
    variant = 'light',
}: {
    variant?: 'light' | 'dark';
}) {
    const lineOuter =
        variant === 'dark' ? 'bg-wedding-ivory/35' : 'bg-wedding-navy/25';
    const lineInner =
        variant === 'dark' ? 'bg-wedding-sage/70' : 'bg-wedding-sage/50';

    return (
        <div className="flex items-center justify-center gap-3 sm:gap-4">
            <span className={`h-px w-8 sm:w-12 ${lineOuter}`} />
            <span className={`h-px w-6 sm:w-8 ${lineInner}`} />
            <span
                className="size-1.5 rotate-45 bg-wedding-gold"
                aria-hidden="true"
            />
            <span className={`h-px w-6 sm:w-8 ${lineInner}`} />
            <span className={`h-px w-8 sm:w-12 ${lineOuter}`} />
        </div>
    );
}
