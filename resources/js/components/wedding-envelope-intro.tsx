import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type KeyboardEvent,
    type PointerEvent as ReactPointerEvent,
} from 'react';
import { cn } from '@/lib/utils';

const OPENED_KEY = 'invitation-opened';
const SETTLE_MS = 450;
const OPEN_MS = 700;
const THRESHOLD_RATIO = 0.22;
const FLICK_VELOCITY = 0.4; // px/ms

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
    cream: '#f9f7f3',
} as const;

const SEAL_SIZE = 'min(22vmin, 8.5rem)';

type WeddingEnvelopeIntroProps = {
    onOpen: () => void;
    onOpenStart?: () => void;
};

type Phase = 'idle' | 'dragging' | 'settling' | 'opening' | 'done';

function SealImage() {
    return (
        <picture>
            <source srcSet="/images/envelope/seal.webp" type="image/webp" />
            <img
                src="/images/envelope/seal.png"
                alt=""
                width={1000}
                height={1000}
                className="h-full w-full object-contain"
                draggable={false}
                decoding="async"
            />
        </picture>
    );
}

function SlideArrow() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5 shrink-0 animate-[envelope-nudge-right_1.8s_ease-in-out_infinite] opacity-70 sm:h-6 sm:w-6"
            style={{ color: COLORS.sage }}
        >
            <path
                d="M9.5 5.5 16 12l-6.5 6.5"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function applyResistance(dx: number, screenW: number): number {
    const clamped = Math.max(0, dx);
    const softZone = screenW * 0.4;
    const resisted =
        clamped <= softZone
            ? clamped
            : softZone + (clamped - softZone) * 0.5;

    return Math.min(resisted, screenW * 0.95);
}

export default function WeddingEnvelopeIntro({
    onOpen,
    onOpenStart,
}: WeddingEnvelopeIntroProps) {
    const [phase, setPhase] = useState<Phase>('idle');
    const [copyHidden, setCopyHidden] = useState(false);
    const phaseRef = useRef<Phase>('idle');
    const offsetRef = useRef(0);
    const hasFinishedRef = useRef(false);
    const timersRef = useRef<number[]>([]);
    const panelRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef({
        pointerId: -1,
        startX: 0,
        originOffset: 0,
        lastX: 0,
        lastT: 0,
        velocity: 0,
    });

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

    const paintOffset = useCallback((x: number, transitionMs: number | null) => {
        const panel = panelRef.current;
        offsetRef.current = x;

        if (!panel) {
            return;
        }

        if (transitionMs === null) {
            panel.style.transition = 'none';
        } else {
            panel.style.transition = `transform ${transitionMs}ms cubic-bezier(0.22, 1, 0.36, 1)`;
        }

        panel.style.transform = `translate3d(${x}px, 0, 0)`;
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
        if (phaseRef.current === 'opening' || phaseRef.current === 'done') {
            return;
        }

        const target = window.innerWidth + 48;

        setPhaseSafe('opening');
        setCopyHidden(true);
        onOpenStart?.();
        paintOffset(target, OPEN_MS);

        schedule(() => {
            finishIntro();
        }, OPEN_MS);
    }, [finishIntro, onOpenStart, paintOffset, schedule, setPhaseSafe]);

    const settleClosed = useCallback(() => {
        setPhaseSafe('settling');
        paintOffset(0, SETTLE_MS);

        schedule(() => {
            if (phaseRef.current === 'settling') {
                setCopyHidden(false);
                setPhaseSafe('idle');
            }
        }, SETTLE_MS);
    }, [paintOffset, schedule, setPhaseSafe]);

    const stopDragging = useCallback(() => {
        const drag = dragRef.current;
        const current = offsetRef.current;
        const threshold = window.innerWidth * THRESHOLD_RATIO;
        const flickedRight = drag.velocity > FLICK_VELOCITY;
        const passed = current >= threshold;

        if (passed || flickedRight) {
            completeOpen();
            return;
        }

        settleClosed();
    }, [completeOpen, settleClosed]);

    const onPointerDown = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>) => {
            if (
                phaseRef.current === 'opening' ||
                phaseRef.current === 'done' ||
                event.button !== 0
            ) {
                return;
            }

            event.preventDefault();
            setCopyHidden(true);
            setPhaseSafe('dragging');

            const now = performance.now();
            dragRef.current = {
                pointerId: event.pointerId,
                startX: event.clientX,
                originOffset: offsetRef.current,
                lastX: event.clientX,
                lastT: now,
                velocity: 0,
            };

            paintOffset(offsetRef.current, null);

            const onMove = (moveEvent: PointerEvent) => {
                if (moveEvent.pointerId !== dragRef.current.pointerId) {
                    return;
                }

                moveEvent.preventDefault();

                const nowMove = performance.now();
                const dt = nowMove - dragRef.current.lastT;
                if (dt > 0) {
                    dragRef.current.velocity =
                        (moveEvent.clientX - dragRef.current.lastX) / dt;
                }
                dragRef.current.lastX = moveEvent.clientX;
                dragRef.current.lastT = nowMove;

                const raw =
                    dragRef.current.originOffset +
                    (moveEvent.clientX - dragRef.current.startX);
                paintOffset(applyResistance(raw, window.innerWidth), null);
            };

            const onUp = (upEvent: PointerEvent) => {
                if (upEvent.pointerId !== dragRef.current.pointerId) {
                    return;
                }

                window.removeEventListener('pointermove', onMove);
                window.removeEventListener('pointerup', onUp);
                window.removeEventListener('pointercancel', onUp);
                stopDragging();
            };

            window.addEventListener('pointermove', onMove, { passive: false });
            window.addEventListener('pointerup', onUp);
            window.addEventListener('pointercancel', onUp);
        },
        [paintOffset, setPhaseSafe, stopDragging],
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
            clearTimers();
        };
    }, [clearTimers]);

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
                ref={panelRef}
                className="absolute inset-0 touch-none select-none will-change-transform"
                style={{ backgroundColor: COLORS.cream }}
            >
                <div
                    className="pointer-events-none absolute inset-x-0 z-10 flex flex-col items-center px-6 text-center transition-opacity duration-300 ease-out"
                    style={{
                        top: `calc(50% - (${SEAL_SIZE} / 2) - 0.75rem)`,
                        transform: 'translateY(-100%)',
                        opacity: copyHidden ? 0 : 1,
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

                <div
                    className="absolute top-1/2 left-1/2 z-20"
                    style={{
                        width: SEAL_SIZE,
                        height: SEAL_SIZE,
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <div
                        role="button"
                        tabIndex={0}
                        aria-label="Slide the seal right to open the invitation"
                        onPointerDown={onPointerDown}
                        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                            if (
                                event.key === 'Enter' ||
                                event.key === ' ' ||
                                event.key === 'ArrowRight'
                            ) {
                                event.preventDefault();
                                completeOpen();
                            }
                        }}
                        className={cn(
                            'relative h-full w-full touch-none outline-none focus-visible:ring-2 focus-visible:ring-[#53736e]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9f7f3]',
                            phase === 'opening'
                                ? 'cursor-default'
                                : 'cursor-grab active:cursor-grabbing',
                        )}
                    >
                        <SealImage />
                    </div>

                    <div
                        className="pointer-events-none absolute top-1/2 left-full ml-5 -translate-y-1/2 transition-opacity duration-300 ease-out sm:ml-8"
                        style={{ opacity: copyHidden ? 0 : 1 }}
                        aria-hidden="true"
                    >
                        <SlideArrow />
                    </div>
                </div>

                <p
                    className="pointer-events-none absolute inset-x-0 z-10 px-6 text-center font-sans text-[0.65rem] tracking-[0.2em] uppercase transition-opacity duration-300 ease-out sm:text-xs"
                    style={{
                        top: `calc(50% + (${SEAL_SIZE} / 2) + 0.75rem)`,
                        color: COLORS.sage,
                        opacity: copyHidden ? 0 : 1,
                    }}
                >
                    Slide the seal right to open
                </p>
            </div>
        </div>
    );
}
