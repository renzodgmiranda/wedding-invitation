import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import WeddingAttireSection from '@/components/wedding-attire-section';
import WeddingCountdown from '@/components/wedding-countdown';
import WeddingEnvelopeIntro, {
    hasOpenedInvitation,
} from '@/components/wedding-envelope-intro';
import WeddingGallerySection from '@/components/wedding-gallery-section';
import WeddingMotifStripe from '@/components/wedding-motif-stripe';
import WeddingMusic from '@/components/wedding-music';
import WeddingOrnament from '@/components/wedding-ornament';
import WeddingRemindersSection from '@/components/wedding-reminders-section';
import WeddingRsvpSection from '@/components/wedding-rsvp-section';
import WeddingVenueSection from '@/components/wedding-venue-section';
import { cn } from '@/lib/utils';

const PAGE_BLUR_MS = 1800;
/** Let the curtains begin parting before the page begins to clear. */
const PAGE_UNBLUR_DELAY_MS = 700;
/** Soft beat after unblur starts — hero copy settles in. */
const HERO_REVEAL_DELAY_MS = PAGE_UNBLUR_DELAY_MS + 650;
const REVEAL_EASE = 'cubic-bezier(0.45, 0.02, 0.2, 1)';

export default function Welcome() {
    const [showIntro, setShowIntro] = useState(
        () => !hasOpenedInvitation(),
    );
    const [pageBlurred, setPageBlurred] = useState(
        () => !hasOpenedInvitation(),
    );
    const [showBlurOverlay, setShowBlurOverlay] = useState(
        () => !hasOpenedInvitation(),
    );
    const [heroVisible, setHeroVisible] = useState(() =>
        hasOpenedInvitation(),
    );
    const openTimersRef = useRef<number[]>([]);

    useEffect(() => {
        if (pageBlurred) {
            setShowBlurOverlay(true);
            return;
        }

        const timer = window.setTimeout(() => {
            setShowBlurOverlay(false);
        }, PAGE_BLUR_MS);

        return () => window.clearTimeout(timer);
    }, [pageBlurred]);

    useEffect(() => {
        return () => {
            openTimersRef.current.forEach((timer) => window.clearTimeout(timer));
        };
    }, []);

    const beginReveal = () => {
        openTimersRef.current.forEach((timer) => window.clearTimeout(timer));
        openTimersRef.current = [];

        openTimersRef.current.push(
            window.setTimeout(() => {
                setPageBlurred(false);
            }, PAGE_UNBLUR_DELAY_MS),
            window.setTimeout(() => {
                setHeroVisible(true);
            }, HERO_REVEAL_DELAY_MS),
        );
    };

    return (
        <>
            <Head title="" />
            <WeddingMusic enabled={!showIntro} />

            <div
                className="min-h-screen bg-wedding-cream"
                aria-hidden={showIntro ? true : undefined}
            >
                <WeddingMotifStripe />

                <section className="relative flex min-h-[calc(100vh-4px)] flex-col items-center justify-center overflow-hidden px-6 py-16">
                    <img
                        src="/images/background/bg-day.webp"
                        alt=""
                        className={cn(
                            'absolute inset-0 h-full w-full object-cover transition-[filter] duration-[1400ms]',
                            pageBlurred ? 'blur-[16px]' : 'blur-0',
                        )}
                        style={{ transitionTimingFunction: REVEAL_EASE }}
                    />
                    <div
                        className="pointer-events-none absolute inset-0 bg-wedding-navy/55"
                        aria-hidden="true"
                    />
                    <div
                        className="pointer-events-none absolute inset-0 bg-linear-to-b from-wedding-navy/40 via-wedding-forest/35 to-wedding-navy/70"
                        aria-hidden="true"
                    />

                    <div
                        className={cn(
                            'relative z-10 flex max-w-2xl flex-col items-center text-center transition-[opacity,transform] duration-[1100ms]',
                            heroVisible
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-5 opacity-0',
                        )}
                        style={{ transitionTimingFunction: REVEAL_EASE }}
                    >
                        <div className="mb-6 flex flex-col items-center gap-1.5">
                            <p className="text-sm tracking-[0.35em] text-wedding-gold uppercase sm:text-base">
                                December 21, 2026
                            </p>
                            <p className="text-sm tracking-[0.35em] text-wedding-gold uppercase sm:text-base">
                                2:00 PM
                            </p>
                        </div>

                        <WeddingOrnament variant="dark" />

                        <h1 className="mt-8 font-script text-7xl leading-tight text-wedding-ivory sm:text-8xl">
                            Via{' '}
                            <span className="text-wedding-gold">&amp;</span>{' '}
                            Renzo
                        </h1>

                        <div className="mt-10 space-y-2 font-sans text-lg leading-relaxed font-light text-wedding-ivory/90 sm:text-xl">
                            <p>request the pleasure of your company</p>
                            <p className="text-wedding-gold/90 italic">
                                as we celebrate our wedding
                            </p>
                        </div>

                        <div className="my-8">
                            <WeddingOrnament variant="dark" />
                        </div>

                        <p className="mb-8 text-xs tracking-[0.3em] text-wedding-ivory uppercase sm:text-sm">
                            Counting down to our special day
                        </p>

                        <WeddingCountdown variant="dark" />
                    </div>
                </section>

                <WeddingGallerySection />
                <WeddingVenueSection />
                <WeddingAttireSection />
                <WeddingRemindersSection />
                <WeddingRsvpSection />
            </div>

            {showBlurOverlay ? (
                <div
                    className={cn(
                        'pointer-events-none fixed inset-0 z-[55] transition-[opacity,backdrop-filter] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
                        pageBlurred
                            ? 'bg-wedding-navy/[0.06] opacity-100 backdrop-blur-[12px]'
                            : 'bg-transparent opacity-0 backdrop-blur-none',
                    )}
                    aria-hidden="true"
                />
            ) : null}

            {showIntro ? (
                <WeddingEnvelopeIntro
                    onOpenStart={beginReveal}
                    onOpen={() => setShowIntro(false)}
                />
            ) : null}
        </>
    );
}
