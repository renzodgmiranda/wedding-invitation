export default function WeddingMotifStripe({
    className = '',
}: {
    className?: string;
}) {
    return (
        <div className={`flex h-1 w-full ${className}`} aria-hidden="true">
            <span className="flex-1 bg-wedding-navy" />
            <span className="flex-1 bg-wedding-slate" />
            <span className="flex-1 bg-wedding-forest" />
            <span className="flex-1 bg-wedding-sage" />
            <span className="flex-1 bg-wedding-gold" />
        </div>
    );
}
