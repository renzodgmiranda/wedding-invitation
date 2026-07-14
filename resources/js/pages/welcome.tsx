import { Head } from '@inertiajs/react';
import WeddingAttireSection from '@/components/wedding-attire-section';
import WeddingCountdown from '@/components/wedding-countdown';
import WeddingGallerySection from '@/components/wedding-gallery-section';
import WeddingMotifStripe from '@/components/wedding-motif-stripe';
import WeddingMusic from '@/components/wedding-music';
import WeddingOrnament from '@/components/wedding-ornament';
import WeddingRemindersSection from '@/components/wedding-reminders-section';
import WeddingReveal from '@/components/wedding-reveal';
import WeddingRsvpSection from '@/components/wedding-rsvp-section';
import WeddingVenueSection from '@/components/wedding-venue-section';

export default function Welcome() {
    return (
        <>
            <Head title="" />
            <WeddingMusic />
            <div className="min-h-screen bg-wedding-cream">
                <WeddingMotifStripe />

                <section className="relative flex min-h-[calc(100vh-4px)] flex-col items-center justify-center overflow-hidden px-6 py-16">
                    <img
                        src="/images/background/bg-day.webp"
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div
                        className="pointer-events-none absolute inset-0 bg-wedding-navy/55"
                        aria-hidden="true"
                    />
                    <div
                        className="pointer-events-none absolute inset-0 bg-linear-to-b from-wedding-navy/40 via-wedding-forest/35 to-wedding-navy/70"
                        aria-hidden="true"
                    />

                    <WeddingReveal className="relative z-10 flex max-w-2xl flex-col items-center text-center">
                        <p className="mb-6 text-sm tracking-[0.35em] text-wedding-gold uppercase sm:text-base">
                            December 21, 2026
                        </p>

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
                    </WeddingReveal>
                </section>

                <WeddingGallerySection />
                <WeddingVenueSection />
                <WeddingAttireSection />
                <WeddingRemindersSection />
                <WeddingRsvpSection />
            </div>
        </>
    );
}
