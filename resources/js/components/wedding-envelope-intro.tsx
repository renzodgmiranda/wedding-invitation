import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type KeyboardEvent,
    type PointerEvent as ReactPointerEvent,
} from 'react';
import { cn } from '@/lib/utils';

const OPENED_KEY = 'invitation-opened';
const HOLD_MS = 1300;
const COPY_FADE_MS = 550;
const SEAL_FADE_MS = 700;
const OPEN_MS = 2200;
const OPEN_EASE = 'cubic-bezier(0.45, 0.02, 0.2, 1)';
const RING_LINE_WIDTH = 2.75;
const RING_INSET_RATIO = 0.03;

const COLORS = {
    navy: '#1a2437',
    slate: '#323b62',
    forest: '#2f443f',
    sage: '#53736e',
    gold: '#cbb079',
    cream: '#f9f7f3',
} as const;

/**
 * Full-circle motif loop in equal fifths (20% each), starting on gold:
 * gold → sage → forest → slate → midnight → gold
 */
function addMotifColorStops(gradient: CanvasGradient): void {
    const stops: Array<[number, string]> = [
        [0, COLORS.gold],
        [0.18, COLORS.gold],
        [0.2, COLORS.sage],
        [0.38, COLORS.sage],
        [0.4, COLORS.forest],
        [0.58, COLORS.forest],
        [0.6, COLORS.slate],
        [0.78, COLORS.slate],
        [0.8, COLORS.navy],
        [0.98, COLORS.navy],
        [1, COLORS.gold],
    ];

    for (const [t, color] of stops) {
        gradient.addColorStop(t, color);
    }
}

export function hasOpenedInvitation(): boolean {
    return (
        typeof window !== 'undefined' &&
        sessionStorage.getItem(OPENED_KEY) === '1'
    );
}

export function markInvitationOpened(): void {
    sessionStorage.setItem(OPENED_KEY, '1');
}

const SEAL_SIZE = 'min(28vmin, 10.5rem)';

type WeddingEnvelopeIntroProps = {
    onOpen: () => void;
    onOpenStart?: () => void;
};

type Phase = 'idle' | 'fading_copy' | 'fading_seal' | 'opening' | 'done';

function SealImage() {
    return (
        <div
            aria-hidden="true"
            className="h-full w-full bg-contain bg-center bg-no-repeat drop-shadow-[0_10px_24px_rgba(26,36,55,0.12)]"
            style={{
                backgroundImage: `image-set(
                    url('/images/envelope/seal.webp') type('image/webp'),
                    url('/images/envelope/seal.png') type('image/png')
                )`,
            }}
        />
    );
}

function HoldRing({ progress, active }: { progress: number; active: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const visible = active || progress > 0;

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const size = canvas.clientWidth;
        if (size <= 0) {
            return;
        }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const pixelSize = Math.round(size * dpr);
        if (canvas.width !== pixelSize || canvas.height !== pixelSize) {
            canvas.width = pixelSize;
            canvas.height = pixelSize;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, size, size);

        if (progress <= 0) {
            return;
        }

        const cx = size / 2;
        const cy = size / 2;
        const radius = size / 2 - RING_LINE_WIDTH / 2 - size * RING_INSET_RATIO;
        const drawnProgress = Math.min(Math.max(progress, 0), 1);
        const endAngle = -Math.PI / 2 + drawnProgress * Math.PI * 2;

        const gradient = ctx.createConicGradient(-Math.PI / 2, cx, cy);
        addMotifColorStops(gradient);

        ctx.beginPath();
        ctx.arc(cx, cy, radius, -Math.PI / 2, endAngle, false);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = RING_LINE_WIDTH;
        ctx.lineCap = 'butt';
        ctx.stroke();
    }, [progress]);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-300 ease-out"
            aria-hidden="true"
            style={{ opacity: visible ? 0.9 : 0 }}
        />
    );
}

export default function WeddingEnvelopeIntro({
    onOpen,
    onOpenStart,
}: WeddingEnvelopeIntroProps) {
    const [phase, setPhase] = useState<Phase>('idle');
    const [copyHidden, setCopyHidden] = useState(false);
    const [sealHidden, setSealHidden] = useState(false);
    const [holdProgress, setHoldProgress] = useState(0);
    const [holding, setHolding] = useState(false);
    const phaseRef = useRef<Phase>('idle');
    const hasFinishedRef = useRef(false);
    const holdCompletedRef = useRef(false);
    const holdRafRef = useRef<number | null>(null);
    const holdStartRef = useRef<number | null>(null);
    const timersRef = useRef<number[]>([]);
    const leftPanelRef = useRef<HTMLDivElement>(null);
    const rightPanelRef = useRef<HTMLDivElement>(null);

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

    const cancelHoldAnimation = useCallback(() => {
        if (holdRafRef.current !== null) {
            window.cancelAnimationFrame(holdRafRef.current);
            holdRafRef.current = null;
        }
        holdStartRef.current = null;
    }, []);

    const paintPart = useCallback((x: number, transitionMs: number) => {
        const left = leftPanelRef.current;
        const right = rightPanelRef.current;
        const transition = `transform ${transitionMs}ms ${OPEN_EASE}`;

        if (left) {
            left.style.transition = transition;
            left.style.transform = `translate3d(${-x}px, 0, 0)`;
        }

        if (right) {
            right.style.transition = transition;
            right.style.transform = `translate3d(${x}px, 0, 0)`;
        }
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

    const completeOpen = useCallback(() => {
        if (phaseRef.current !== 'idle') {
            return;
        }

        holdCompletedRef.current = true;
        cancelHoldAnimation();
        setHolding(false);
        setHoldProgress(1);
        setPhaseSafe('fading_copy');
        setCopyHidden(true);

        schedule(() => {
            if (phaseRef.current !== 'fading_copy') {
                return;
            }

            setPhaseSafe('fading_seal');
            setSealHidden(true);

            schedule(() => {
                if (phaseRef.current !== 'fading_seal') {
                    return;
                }

                const target = window.innerWidth * 0.55 + 24;

                setPhaseSafe('opening');
                onOpenStart?.();
                paintPart(target, OPEN_MS);

                schedule(() => {
                    finishIntro();
                }, OPEN_MS);
            }, SEAL_FADE_MS);
        }, COPY_FADE_MS);
    }, [
        cancelHoldAnimation,
        finishIntro,
        onOpenStart,
        paintPart,
        schedule,
        setPhaseSafe,
    ]);

    const stopHold = useCallback(() => {
        if (holdCompletedRef.current || phaseRef.current !== 'idle') {
            return;
        }

        cancelHoldAnimation();
        setHolding(false);
        setHoldProgress(0);
    }, [cancelHoldAnimation]);

    const startHold = useCallback(() => {
        if (phaseRef.current !== 'idle' || holdCompletedRef.current) {
            return;
        }

        cancelHoldAnimation();
        setHolding(true);
        holdStartRef.current = performance.now();

        const tick = (now: number) => {
            if (holdStartRef.current === null) {
                return;
            }

            const progress = Math.min(1, (now - holdStartRef.current) / HOLD_MS);
            setHoldProgress(progress);

            if (progress >= 1) {
                holdRafRef.current = null;
                completeOpen();
                return;
            }

            holdRafRef.current = window.requestAnimationFrame(tick);
        };

        holdRafRef.current = window.requestAnimationFrame(tick);
    }, [cancelHoldAnimation, completeOpen]);

    const onPointerDown = useCallback(
        (event: ReactPointerEvent<HTMLButtonElement>) => {
            if (phaseRef.current !== 'idle' || event.button !== 0) {
                return;
            }

            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
            startHold();
        },
        [startHold],
    );

    const onPointerUp = useCallback(() => {
        stopHold();
    }, [stopHold]);

    const onKeyDown = useCallback(
        (event: KeyboardEvent<HTMLButtonElement>) => {
            if (
                phaseRef.current !== 'idle' ||
                (event.key !== 'Enter' && event.key !== ' ') ||
                event.repeat
            ) {
                return;
            }

            event.preventDefault();
            startHold();
        },
        [startHold],
    );

    const onKeyUp = useCallback(
        (event: KeyboardEvent<HTMLButtonElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                stopHold();
            }
        },
        [stopHold],
    );

    useEffect(() => {
        const previousHtml = document.documentElement.style.overflow;
        const previousBody = document.body.style.overflow;
        const previousTouchAction = document.body.style.touchAction;
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';

        return () => {
            document.documentElement.style.overflow = previousHtml;
            document.body.style.overflow = previousBody;
            document.body.style.touchAction = previousTouchAction;
            cancelHoldAnimation();
            clearTimers();
        };
    }, [cancelHoldAnimation, clearTimers]);

    if (phase === 'done') {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[60] h-[100dvh] w-screen overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Open wedding invitation"
        >
            <div
                ref={leftPanelRef}
                className="absolute inset-y-0 left-0 w-[calc(50%+2px)] select-none will-change-transform"
                style={{ backgroundColor: COLORS.cream }}
                aria-hidden="true"
            />
            <div
                ref={rightPanelRef}
                className="absolute inset-y-0 right-0 w-[calc(50%+2px)] select-none will-change-transform"
                style={{ backgroundColor: COLORS.cream }}
                aria-hidden="true"
            />

            <div
                className="pointer-events-none absolute inset-x-0 z-10 flex flex-col items-center px-6 text-center transition-opacity duration-[550ms] ease-out"
                style={{
                    top: `calc(50% - (${SEAL_SIZE} / 2) - 1.25rem)`,
                    transform: 'translateY(-100%)',
                    opacity: copyHidden ? 0 : 1,
                }}
            >
                <p
                    className="mb-3 font-sans text-xs tracking-[0.4em] uppercase sm:text-sm"
                    style={{ color: COLORS.sage }}
                >
                    Save the Date
                </p>
                <span
                    className="mb-5 block h-px w-10 sm:mb-6 sm:w-12"
                    style={{ backgroundColor: COLORS.gold }}
                    aria-hidden="true"
                />
                <h1
                    className="font-invite overflow-visible px-3 py-4 text-[4.25rem] leading-none tracking-wide sm:px-4 sm:py-5 sm:text-8xl"
                    style={{
                        backgroundImage: `linear-gradient(
                            115deg,
                            ${COLORS.navy} 0%,
                            ${COLORS.slate} 28%,
                            ${COLORS.forest} 52%,
                            ${COLORS.sage} 80%,
                            ${COLORS.gold} 100%
                        )`,
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent',
                    }}
                >
                    You&apos;re Invited!
                </h1>
            </div>

            <div
                className="absolute top-1/2 left-1/2 z-20 transition-opacity duration-700 ease-out"
                style={{
                    width: SEAL_SIZE,
                    height: SEAL_SIZE,
                    transform: 'translate(-50%, -50%)',
                    opacity: sealHidden ? 0 : 1,
                }}
            >
                <button
                    type="button"
                    aria-label="Hold the seal to open the invitation"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(holdProgress * 100)}
                    onPointerDown={onPointerDown}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                    onLostPointerCapture={onPointerUp}
                    onContextMenu={(event) => event.preventDefault()}
                    onKeyDown={onKeyDown}
                    onKeyUp={onKeyUp}
                    onBlur={stopHold}
                    className={cn(
                        'relative h-full w-full touch-none rounded-full outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#53736e]/35',
                        phase === 'idle' ? 'cursor-pointer' : 'cursor-default',
                    )}
                >
                    <HoldRing progress={holdProgress} active={holding} />
                    <div
                        className="absolute inset-[8%] transition-transform duration-300 ease-out"
                        style={{
                            transform: holding ? 'scale(0.96)' : 'scale(1)',
                        }}
                    >
                        <SealImage />
                    </div>
                </button>
            </div>

            <p
                className="pointer-events-none absolute inset-x-0 z-10 px-6 text-center font-sans text-xs tracking-[0.28em] uppercase transition-opacity duration-[550ms] ease-out sm:text-sm"
                style={{
                    top: `calc(50% + (${SEAL_SIZE} / 2) + 1.1rem)`,
                    color: COLORS.sage,
                    opacity: copyHidden ? 0 : 1,
                }}
            >
                Hold the seal to open
            </p>
        </div>
    );
}
