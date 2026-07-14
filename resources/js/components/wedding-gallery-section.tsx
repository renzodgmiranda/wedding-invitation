import { useEffect, useRef } from 'react';
import WeddingOrnament from '@/components/wedding-ornament';
import WeddingReveal from '@/components/wedding-reveal';
import { cn } from '@/lib/utils';

const GALLERY_ITEMS = [
    {
        id: 1,
        src: '/images/gallery/3.webp',
        alt: 'Favorite moment 1',
        size: 'md',
    },
    {
        id: 2,
        src: '/images/gallery/2.webp',
        alt: 'Favorite moment 2',
        size: 'md',
    },
    {
        id: 3,
        src: '/images/gallery/1.webp',
        alt: 'Favorite moment 3',
        size: 'lg',
    },
    {
        id: 4,
        src: '/images/gallery/4.webp',
        alt: 'Favorite moment 4',
        size: 'md',
    },
    {
        id: 5,
        src: '/images/gallery/5.webp',
        alt: 'Favorite moment 5',
        size: 'md',
    },
] as const;

const MIDDLE_INDEX = Math.floor(GALLERY_ITEMS.length / 2);

function GalleryFrame({
    src,
    alt,
    size,
    frameRef,
}: {
    src: string;
    alt: string;
    size: 'md' | 'lg';
    frameRef?: React.Ref<HTMLElement>;
}) {
    return (
        <figure
            ref={frameRef}
            className={cn(
                'relative shrink-0 snap-center self-end overflow-hidden border border-wedding-sage/20 bg-wedding-ivory',
                size === 'lg' && 'mb-3 sm:mb-5',
            )}
        >
            <img
                src={src}
                alt={alt}
                className={cn(
                    'block h-80 w-auto max-w-none sm:h-96 lg:h-[28rem]',
                    size === 'lg' && 'h-96 sm:h-[28rem] lg:h-[32rem]',
                )}
                loading={size === 'lg' ? 'eager' : 'lazy'}
                decoding="async"
            />
            <span
                className="absolute inset-x-0 top-0 h-0.5 bg-wedding-gold/70"
                aria-hidden="true"
            />
        </figure>
    );
}

export default function WeddingGallerySection() {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const middleRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const scroller = scrollerRef.current;
        const middle = middleRef.current;

        if (!scroller || !middle) {
            return;
        }

        const centerMiddle = () => {
            if (window.matchMedia('(min-width: 1024px)').matches) {
                return;
            }

            const left =
                middle.offsetLeft -
                (scroller.clientWidth - middle.offsetWidth) / 2;

            scroller.scrollTo({ left: Math.max(0, left), behavior: 'auto' });
        };

        centerMiddle();

        const img = middle.querySelector('img');

        if (img && !img.complete) {
            img.addEventListener('load', centerMiddle);
        }

        window.addEventListener('resize', centerMiddle);

        return () => {
            window.removeEventListener('resize', centerMiddle);
            img?.removeEventListener('load', centerMiddle);
        };
    }, []);

    return (
        <section className="overflow-hidden bg-wedding-ivory px-6 py-20">
            <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
                <WeddingReveal>
                    <p className="mb-4 text-xs tracking-[0.35em] text-wedding-gold uppercase sm:text-sm">
                        A glimpse of us
                    </p>

                    <h2 className="font-sans text-3xl font-light tracking-wide text-wedding-navy sm:text-4xl">
                        Our Favorite Moments
                    </h2>

                    <div className="my-8">
                        <WeddingOrnament />
                    </div>
                </WeddingReveal>

                <WeddingReveal fadeOnly delayMs={100} className="w-full">
                    <div
                        ref={scrollerRef}
                        className="-mx-6 flex snap-x snap-mandatory items-end gap-4 overflow-x-auto px-6 pb-4 sm:gap-5 lg:mx-0 lg:justify-center lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0"
                    >
                        {GALLERY_ITEMS.map((item, index) => (
                            <GalleryFrame
                                key={item.id}
                                src={item.src}
                                alt={item.alt}
                                size={item.size}
                                frameRef={
                                    index === MIDDLE_INDEX
                                        ? middleRef
                                        : undefined
                                }
                            />
                        ))}
                    </div>
                </WeddingReveal>
            </div>
        </section>
    );
}
