import { useCallback, useEffect, useRef, useState } from 'react';
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
const SCROLL_SETTLE_MS = 120;

function GalleryFrame({
    src,
    alt,
    featured,
    frameRef,
}: {
    src: string;
    alt: string;
    featured: boolean;
    frameRef?: React.Ref<HTMLElement>;
}) {
    return (
        <figure
            ref={frameRef}
            className={cn(
                'relative shrink-0 snap-center self-end',
                featured && 'max-lg:z-10',
            )}
        >
            <div
                className={cn(
                    'relative origin-bottom overflow-hidden border border-wedding-sage/20 bg-wedding-ivory transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform',
                    featured
                        ? 'max-lg:scale-[1.12] lg:mb-5'
                        : 'max-lg:scale-100',
                )}
            >
                <img
                    src={src}
                    alt={alt}
                    className={cn(
                        'block object-cover object-center',
                        'aspect-[2/3] h-auto w-56 sm:w-64',
                        featured
                            ? 'lg:aspect-auto lg:h-[32rem] lg:w-auto'
                            : 'lg:aspect-auto lg:h-[28rem] lg:w-auto',
                    )}
                    loading={featured ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                />
                <span
                    className="absolute inset-x-0 top-0 h-0.5 bg-wedding-gold/70"
                    aria-hidden="true"
                />
            </div>
        </figure>
    );
}

export default function WeddingGallerySection() {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const frameRefs = useRef<(HTMLElement | null)[]>([]);
    const activeIndexRef = useRef(MIDDLE_INDEX);
    const settleTimerRef = useRef(0);
    const isScrollingRef = useRef(false);
    const [activeIndex, setActiveIndex] = useState(MIDDLE_INDEX);
    const [isDesktop, setIsDesktop] = useState(false);

    const getClosestIndex = useCallback(() => {
        const scroller = scrollerRef.current;

        if (!scroller) {
            return MIDDLE_INDEX;
        }

        const scrollerCenter = scroller.scrollLeft + scroller.clientWidth / 2;
        let closestIndex = MIDDLE_INDEX;
        let closestDistance = Number.POSITIVE_INFINITY;

        frameRefs.current.forEach((frameEl, index) => {
            if (!frameEl) {
                return;
            }

            const frameCenter = frameEl.offsetLeft + frameEl.offsetWidth / 2;
            const distance = Math.abs(frameCenter - scrollerCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        return closestIndex;
    }, []);

    const scrollToIndex = useCallback(
        (index: number, behavior: ScrollBehavior = 'smooth') => {
            const scroller = scrollerRef.current;
            const frame = frameRefs.current[index];

            if (!scroller || !frame) {
                return;
            }

            const left =
                frame.offsetLeft -
                (scroller.clientWidth - frame.offsetWidth) / 2;

            scroller.scrollTo({ left: Math.max(0, left), behavior });
            activeIndexRef.current = index;
            setActiveIndex(index);
        },
        [],
    );

    const commitActiveIndex = useCallback(() => {
        const closest = getClosestIndex();

        if (closest === activeIndexRef.current) {
            return;
        }

        activeIndexRef.current = closest;
        setActiveIndex(closest);
    }, [getClosestIndex]);

    useEffect(() => {
        const media = window.matchMedia('(min-width: 1024px)');
        const syncDesktop = () => setIsDesktop(media.matches);

        syncDesktop();
        media.addEventListener('change', syncDesktop);

        return () => media.removeEventListener('change', syncDesktop);
    }, []);

    useEffect(() => {
        const scroller = scrollerRef.current;
        const middle = frameRefs.current[MIDDLE_INDEX];

        if (!scroller || !middle || isDesktop) {
            return;
        }

        const centerMiddle = () => {
            if (isScrollingRef.current) {
                return;
            }

            scrollToIndex(MIDDLE_INDEX, 'auto');
        };

        centerMiddle();

        const img = middle.querySelector('img');

        if (img && !img.complete) {
            img.addEventListener('load', centerMiddle);
        }

        let resizeTimer = 0;
        const onResize = () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(centerMiddle, 150);
        };

        window.addEventListener('resize', onResize);

        return () => {
            window.clearTimeout(resizeTimer);
            window.removeEventListener('resize', onResize);
            img?.removeEventListener('load', centerMiddle);
        };
    }, [isDesktop, scrollToIndex]);

    useEffect(() => {
        const scroller = scrollerRef.current;

        if (!scroller || isDesktop) {
            return;
        }

        const settleActive = () => {
            isScrollingRef.current = false;
            commitActiveIndex();
        };

        const onScroll = () => {
            isScrollingRef.current = true;
            window.clearTimeout(settleTimerRef.current);
            settleTimerRef.current = window.setTimeout(
                settleActive,
                SCROLL_SETTLE_MS,
            );
        };

        const onScrollEnd = () => {
            window.clearTimeout(settleTimerRef.current);
            settleActive();
        };

        scroller.addEventListener('scroll', onScroll, { passive: true });
        scroller.addEventListener('scrollend', onScrollEnd);

        return () => {
            window.clearTimeout(settleTimerRef.current);
            scroller.removeEventListener('scroll', onScroll);
            scroller.removeEventListener('scrollend', onScrollEnd);
        };
    }, [commitActiveIndex, isDesktop]);

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
                        className="-mx-6 flex h-[27rem] snap-x snap-mandatory items-end gap-7 overflow-x-auto overscroll-x-contain px-[max(1.5rem,calc(50%-7rem))] pb-2 [scrollbar-width:none] [-ms-overflow-style:none] touch-pan-x sm:h-[31rem] sm:gap-8 sm:px-[max(1.5rem,calc(50%-8rem))] lg:mx-0 lg:h-auto lg:justify-center lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0 lg:overscroll-auto [&::-webkit-scrollbar]:hidden"
                        style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                        {GALLERY_ITEMS.map((item, index) => {
                            const featured = isDesktop
                                ? item.size === 'lg'
                                : index === activeIndex;

                            return (
                                <GalleryFrame
                                    key={item.id}
                                    src={item.src}
                                    alt={item.alt}
                                    featured={featured}
                                    frameRef={(el) => {
                                        frameRefs.current[index] = el;
                                    }}
                                />
                            );
                        })}
                    </div>
                </WeddingReveal>
            </div>
        </section>
    );
}
