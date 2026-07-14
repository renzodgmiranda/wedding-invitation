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
const SWIPE_THRESHOLD_PX = 40;

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
                'relative shrink-0 snap-center snap-always self-end overflow-hidden border border-wedding-sage/20 bg-wedding-ivory transition-[margin] duration-300 ease-out',
                featured && 'mb-3 sm:mb-5',
            )}
        >
            <img
                src={src}
                alt={alt}
                className={cn(
                    'block transition-[height] duration-300 ease-out max-lg:w-56 max-lg:object-cover sm:max-lg:w-64 lg:w-auto lg:max-w-none',
                    featured
                        ? 'h-96 sm:h-[28rem] lg:h-[32rem]'
                        : 'h-80 sm:h-96 lg:h-[28rem]',
                )}
                loading={featured ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
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
    const frameRefs = useRef<(HTMLElement | null)[]>([]);
    const activeIndexRef = useRef(MIDDLE_INDEX);
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
            scrollToIndex(MIDDLE_INDEX, 'auto');
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
    }, [isDesktop, scrollToIndex]);

    useEffect(() => {
        const scroller = scrollerRef.current;

        if (!scroller || isDesktop) {
            return;
        }

        let startX = 0;
        let startY = 0;
        let indexAtStart = MIDDLE_INDEX;
        let isHorizontal: boolean | null = null;
        let isPaging = false;

        const settleToIndex = (index: number) => {
            const next = Math.max(0, Math.min(GALLERY_ITEMS.length - 1, index));
            isPaging = true;
            scrollToIndex(next, 'smooth');
        };

        const onTouchStart = (event: TouchEvent) => {
            const touch = event.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            indexAtStart = activeIndexRef.current;
            isHorizontal = null;
            isPaging = false;
        };

        const onTouchMove = (event: TouchEvent) => {
            if (isHorizontal !== null || event.touches.length === 0) {
                return;
            }

            const touch = event.touches[0];
            const dx = Math.abs(touch.clientX - startX);
            const dy = Math.abs(touch.clientY - startY);

            if (dx < 8 && dy < 8) {
                return;
            }

            isHorizontal = dx > dy;
        };

        const onTouchEnd = (event: TouchEvent) => {
            const touch = event.changedTouches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;

            if (isHorizontal === false || Math.abs(dx) < Math.abs(dy)) {
                return;
            }

            if (Math.abs(dx) >= SWIPE_THRESHOLD_PX) {
                settleToIndex(indexAtStart + (dx < 0 ? 1 : -1));
                return;
            }

            const closest = getClosestIndex();

            if (
                closest !== indexAtStart &&
                Math.abs(closest - indexAtStart) === 1
            ) {
                settleToIndex(closest);
                return;
            }

            settleToIndex(indexAtStart);
        };

        const onScrollEnd = () => {
            if (isPaging) {
                isPaging = false;
                return;
            }

            const closest = getClosestIndex();

            if (closest !== activeIndexRef.current) {
                scrollToIndex(closest, 'smooth');
            }
        };

        scroller.addEventListener('touchstart', onTouchStart, {
            passive: true,
        });
        scroller.addEventListener('touchmove', onTouchMove, { passive: true });
        scroller.addEventListener('touchend', onTouchEnd, { passive: true });
        scroller.addEventListener('scrollend', onScrollEnd);

        return () => {
            scroller.removeEventListener('touchstart', onTouchStart);
            scroller.removeEventListener('touchmove', onTouchMove);
            scroller.removeEventListener('touchend', onTouchEnd);
            scroller.removeEventListener('scrollend', onScrollEnd);
        };
    }, [getClosestIndex, isDesktop, scrollToIndex]);

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
                        className="-mx-6 flex snap-x snap-mandatory items-end gap-4 overflow-x-auto overscroll-x-contain px-[max(1.5rem,calc(50%-7rem))] pb-4 [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x sm:gap-5 sm:px-[max(1.5rem,calc(50%-8rem))] lg:mx-0 lg:justify-center lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0 lg:overscroll-auto [&::-webkit-scrollbar]:hidden"
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
