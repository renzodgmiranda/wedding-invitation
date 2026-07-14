import { MapPin } from 'lucide-react';
import WeddingMotifStripe from '@/components/wedding-motif-stripe';
import WeddingOrnament from '@/components/wedding-ornament';
import WeddingPanel from '@/components/wedding-panel';
import WeddingReveal from '@/components/wedding-reveal';

const VENUE = {
    name: 'Savanna Farm',
    address: '007, Alfonso, Tagaytay',
    googleMapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Savanna+Farm+007+Alfonso+Tagaytay',
    wazeUrl:
        'https://www.waze.com/live-map/directions?to=place.w.79233165.792266114.17175303',
};

function NavButton({
    href,
    label,
    icon,
    variant = 'secondary',
}: {
    href: string;
    label: string;
    icon: React.ReactNode;
    variant?: 'primary' | 'secondary';
}) {
    const styles =
        variant === 'primary'
            ? 'border-wedding-navy bg-wedding-navy text-wedding-ivory hover:bg-wedding-slate hover:border-wedding-slate'
            : 'border-wedding-sage bg-transparent text-wedding-forest hover:border-wedding-gold hover:bg-wedding-gold/15 hover:text-wedding-navy';

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 border px-5 py-2.5 text-sm tracking-wide transition-colors ${styles}`}
        >
            {icon}
            {label}
        </a>
    );
}

function GoogleMapsIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            aria-hidden="true"
            fill="currentColor"
        >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
        </svg>
    );
}

function WazeIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            aria-hidden="true"
            fill="currentColor"
        >
            <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 2a5 5 0 015 5c0 3.5-3.5 8.5-5 10.5-1.5-2-5-7-5-10.5a5 5 0 015-5zm0 2.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" />
        </svg>
    );
}

export default function WeddingVenueSection() {
    return (
        <section className="relative overflow-hidden bg-wedding-forest px-6 py-20 text-wedding-ivory">
            <div
                className="pointer-events-none absolute inset-0 bg-linear-to-b from-wedding-navy/30 via-transparent to-wedding-navy/20"
                aria-hidden="true"
            />
            <WeddingMotifStripe className="absolute inset-x-0 top-0" />

            <div className="relative mx-auto flex max-w-3xl flex-col items-center pt-8 text-center">
                <WeddingReveal>
                    <p className="mb-4 text-xs tracking-[0.35em] text-wedding-gold uppercase sm:text-sm">
                        Where we&apos;ll say I do
                    </p>

                    <h2 className="font-sans text-3xl font-light tracking-wide text-wedding-ivory sm:text-4xl">
                        The Venue
                    </h2>

                    <div className="my-8">
                        <WeddingOrnament variant="dark" />
                    </div>
                </WeddingReveal>

                <WeddingReveal delayMs={120} className="w-full">
                    <WeddingPanel className="p-6 text-wedding-forest sm:p-8">
                        <div className="mb-8 w-full overflow-hidden border border-wedding-slate/15 bg-wedding-cream">
                            <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-linear-to-br from-wedding-sage/10 via-wedding-ivory to-wedding-gold/15 p-8">
                                <div className="flex size-14 items-center justify-center rounded-full bg-wedding-navy/5 ring-1 ring-wedding-gold/40">
                                    <MapPin
                                        className="h-7 w-7 text-wedding-slate"
                                        strokeWidth={1.25}
                                    />
                                </div>
                                <p className="text-sm tracking-wide text-wedding-slate/70">
                                    Map embed coming soon
                                </p>
                            </div>
                        </div>

                        <h3 className="font-sans text-2xl font-light text-wedding-slate sm:text-3xl">
                            {VENUE.name}
                        </h3>
                        <p className="mt-2 font-sans text-lg text-wedding-forest/80">
                            {VENUE.address}
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <NavButton
                                href={VENUE.googleMapsUrl}
                                label="Google Maps"
                                icon={<GoogleMapsIcon />}
                                variant="primary"
                            />
                            <NavButton
                                href={VENUE.wazeUrl}
                                label="Waze"
                                icon={<WazeIcon />}
                                variant="secondary"
                            />
                        </div>
                    </WeddingPanel>
                </WeddingReveal>
            </div>
        </section>
    );
}
