import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const OPENED_KEY = 'invitation-opened';
const TEXT_MS = 800;
const SEAL_MS = 900;
const FLAP_MS = 700;
const SPLIT_MS = 1100;

export function hasOpenedInvitation(): boolean {
    return (
        typeof window !== 'undefined' &&
        sessionStorage.getItem(OPENED_KEY) === '1'
    );
}

export function markInvitationOpened(): void {
    sessionStorage.setItem(OPENED_KEY, '1');
}

const COLORS = {
    sage: '#53736e',
    gold: '#cbb079',
} as const;

const ENVELOPE = {
    body: '#ebe4d4',
    flap: '#e6ddc9',
    flapTop: '#f1ead8',
    lining: '#d8c8a2',
    liningDeep: '#c9b487',
    foldLeft: '#efe8d6',
    foldRight: '#e6ddc9',
} as const;

type WeddingEnvelopeIntroProps = {
    onOpen: () => void;
    onOpenStart?: () => void;
};

type Phase = 'idle' | 'fadingText' | 'cracking' | 'opening' | 'splitting' | 'done';

/**
 * Full-viewport closed envelope: flap from the top edge, pocket to the bottom edge.
 */
function EnvelopeFace({ flapOpen }: { flapOpen: boolean }) {
    return (
        <div
            className="relative h-full w-full overflow-hidden"
            style={{
                perspective: '1400px',
                transformStyle: 'preserve-3d',
                background: ENVELOPE.body,
            }}
        >
            {/* Lining visible in the center diamond opening */}
            <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    background: `linear-gradient(180deg, ${ENVELOPE.liningDeep} 0%, ${ENVELOPE.lining} 55%, ${ENVELOPE.liningDeep} 100%)`,
                }}
                aria-hidden
            />

            {/* Top flap — opens with rotateX after the seal fades */}
            <div
                className={cn(
                    'pointer-events-none absolute inset-x-0 top-0 z-40 h-1/2 origin-top [transform-style:preserve-3d]',
                    'transition-[transform,z-index] duration-700 ease-in-out',
                    flapOpen && 'z-[1] [transform:rotateX(-180deg)]',
                )}
                style={{
                    transitionDelay: flapOpen ? '0ms, 0ms' : '0ms, 350ms',
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(180deg, ${ENVELOPE.flapTop} 0%, ${ENVELOPE.flap} 100%)`,
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        filter: 'drop-shadow(0 8px 6px rgba(26, 36, 55, 0.14))',
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(180deg, ${ENVELOPE.lining} 0%, ${ENVELOPE.liningDeep} 100%)`,
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                        transform: 'rotateX(180deg)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                    }}
                    aria-hidden
                />
            </div>

            {/* Bottom pocket + side folds — fills lower half to bottom edge */}
            <div
                className="pointer-events-none absolute inset-0 z-[2]"
                style={{
                    filter: 'drop-shadow(0 -6px 3px rgba(26, 36, 55, 0.1))',
                }}
            >
                <div
                    className="relative h-full w-full"
                    style={{
                        background: ENVELOPE.body,
                        clipPath:
                            'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0)',
                    }}
                >
                    <div
                        className="absolute top-0 left-0 h-full w-1/2"
                        style={{
                            background: ENVELOPE.foldLeft,
                            clipPath: 'polygon(100% 50%, 0 0, 0 100%)',
                        }}
                    />
                    <div
                        className="absolute top-0 right-0 h-full w-1/2"
                        style={{
                            background: ENVELOPE.foldRight,
                            clipPath: 'polygon(0 50%, 100% 0, 100% 100%)',
                        }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(to top right, transparent calc(50% - 0.5px), ${COLORS.gold}40 50%, transparent calc(50% + 0.5px)), linear-gradient(to top left, transparent calc(50% - 0.5px), ${COLORS.gold}40 50%, transparent calc(50% + 0.5px))`,
                            clipPath:
                                'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0)',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

/** Full-bleed viewport face for the envelope + curtain halves. */
function CoverScreen({ flapOpen }: { flapOpen: boolean }) {
    return (
        <div className="absolute inset-0">
            <EnvelopeFace flapOpen={flapOpen} />
        </div>
    );
}

function CurtainHalf({
    side,
    isSplitting,
    flapOpen,
}: {
    side: 'left' | 'right';
    isSplitting: boolean;
    flapOpen: boolean;
}) {
    return (
        <div
            className={cn(
                'pointer-events-none absolute inset-y-0 z-10 h-full w-1/2 overflow-hidden transition-transform duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)] will-change-transform',
                side === 'left' ? 'left-0' : 'right-0',
                isSplitting &&
                    (side === 'left' ? '-translate-x-full' : 'translate-x-full'),
            )}
        >
            {/* Full-viewport width inside the half so both halves share one face */}
            <div
                className={cn(
                    'absolute inset-y-0 h-full w-[200%]',
                    side === 'left' ? 'left-0' : 'right-0',
                )}
            >
                <CoverScreen flapOpen={flapOpen} />
            </div>
        </div>
    );
}

export default function WeddingEnvelopeIntro({
    onOpen,
    onOpenStart,
}: WeddingEnvelopeIntroProps) {
    const [phase, setPhase] = useState<Phase>('idle');
    const phaseRef = useRef<Phase>('idle');
    const hasFinishedRef = useRef(false);
    const timersRef = useRef<number[]>([]);

    const setPhaseSafe = useCallback((next: Phase) => {
        phaseRef.current = next;
        setPhase(next);
    }, []);

    const clearTimers = useCallback(() => {
        timersRef.current.forEach((timer) => window.clearTimeout(timer));
        timersRef.current = [];
    }, []);

    const schedule = useCallback((fn: () => void, delay: number) => {
        const timer = window.setTimeout(fn, delay);
        timersRef.current.push(timer);
    }, []);

    const finishIntro = useCallback(() => {
        if (hasFinishedRef.current) {
            return;
        }

        hasFinishedRef.current = true;
        markInvitationOpened();
        setPhaseSafe('done');
        onOpen();
    }, [onOpen, setPhaseSafe]);

    const startSplit = useCallback(() => {
        if (phaseRef.current !== 'opening') {
            return;
        }

        setPhaseSafe('splitting');
        onOpenStart?.();

        schedule(() => {
            finishIntro();
        }, SPLIT_MS);
    }, [finishIntro, onOpenStart, schedule, setPhaseSafe]);

    const startFlap = useCallback(() => {
        if (phaseRef.current !== 'cracking') {
            return;
        }

        setPhaseSafe('opening');

        schedule(() => {
            startSplit();
        }, FLAP_MS);
    }, [schedule, setPhaseSafe, startSplit]);

    const startSealFade = useCallback(() => {
        if (phaseRef.current !== 'fadingText') {
            return;
        }

        setPhaseSafe('cracking');

        schedule(() => {
            startFlap();
        }, SEAL_MS);
    }, [schedule, setPhaseSafe, startFlap]);

    const openInvitation = useCallback(() => {
        if (phaseRef.current !== 'idle') {
            return;
        }

        setPhaseSafe('fadingText');

        schedule(() => {
            startSealFade();
        }, TEXT_MS);
    }, [schedule, setPhaseSafe, startSealFade]);

    useEffect(() => {
        const previousHtml = document.documentElement.style.overflow;
        const previousBody = document.body.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        return () => {
            document.documentElement.style.overflow = previousHtml;
            document.body.style.overflow = previousBody;
            clearTimers();
        };
    }, [clearTimers]);

    if (phase === 'done') {
        return null;
    }

    const isOpening = phase === 'opening' || phase === 'splitting';
    const isSplitting = phase === 'splitting';
    const textHidden = phase !== 'idle';
    const sealHidden =
        phase === 'cracking' || phase === 'opening' || isSplitting;

    return (
        <div
            className="fixed inset-0 z-[60] h-[100dvh] w-screen overflow-hidden"
            style={{
                backgroundColor: isSplitting ? 'transparent' : ENVELOPE.body,
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Open wedding invitation"
        >
            <button
                type="button"
                onClick={openInvitation}
                disabled={phase !== 'idle'}
                aria-label="Tap the envelope to open"
                className={cn(
                    'absolute inset-0 h-full w-full appearance-none border-0 bg-transparent p-0 touch-manipulation select-none',
                    phase === 'idle' ? 'cursor-pointer' : 'cursor-default',
                )}
            >
                <CurtainHalf
                    side="left"
                    isSplitting={isSplitting}
                    flapOpen={isOpening}
                />
                <CurtainHalf
                    side="right"
                    isSplitting={isSplitting}
                    flapOpen={isOpening}
                />

                {/* Seal where the flap tip meets the pocket */}
                <div
                    className="pointer-events-none absolute z-30 transition-opacity duration-[900ms] ease-out"
                    style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: sealHidden ? 0 : 1,
                    }}
                >
                    <picture>
                        <source
                            srcSet="/images/envelope/seal.webp"
                            type="image/webp"
                        />
                        <img
                            src="/images/envelope/seal.png"
                            alt=""
                            width={1000}
                            height={1000}
                            className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.28)]"
                            style={{
                                width: 'min(22vmin, 8.5rem)',
                                height: 'min(22vmin, 8.5rem)',
                            }}
                            draggable={false}
                            decoding="async"
                        />
                    </picture>
                </div>
            </button>

            {/* Titles sit just above the seal */}
            <div
                className="pointer-events-none absolute inset-x-0 z-40 flex flex-col items-center px-6 text-center transition-opacity duration-[800ms] ease-out"
                style={{
                    top: 'calc(50% - min(11vmin, 4.25rem) - 0.75rem)',
                    transform: 'translateY(-100%)',
                    opacity: textHidden ? 0 : 1,
                }}
            >
                <p
                    className="mb-1.5 font-sans text-[0.7rem] tracking-[0.45em] uppercase sm:mb-2 sm:text-xs"
                    style={{ color: COLORS.sage }}
                >
                    Save the Date
                </p>
                <h1 className="font-script text-7xl leading-tight text-wedding-navy sm:text-8xl">
                    You&apos;re Invited!
                </h1>
            </div>

            <p
                className="pointer-events-none absolute inset-x-0 bottom-8 z-40 text-center font-sans text-[0.65rem] tracking-[0.2em] uppercase transition-opacity duration-[800ms] ease-out sm:bottom-10 sm:text-xs"
                style={{
                    color: COLORS.sage,
                    opacity: textHidden ? 0 : 1,
                }}
            >
                Tap to open
            </p>
        </div>
    );
}
