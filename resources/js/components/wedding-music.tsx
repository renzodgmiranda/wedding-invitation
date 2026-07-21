import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const MUSIC_SRC = '/music/spring-rain.webm';
const MUSIC_VOLUME = 0.55;

const UNLOCK_EVENTS: Array<keyof DocumentEventMap> = [
    'pointerdown',
    'touchstart',
    'keydown',
];

type WeddingMusicProps = {
    /** When false, audio is held silent (e.g. seal intro still showing). */
    enabled?: boolean;
};

export default function WeddingMusic({ enabled = true }: WeddingMusicProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const enabledRef = useRef(enabled);
    const unlockedRef = useRef(false);
    const unlockingRef = useRef(false);
    const [playing, setPlaying] = useState(false);

    enabledRef.current = enabled;

    useEffect(() => {
        const audio = new Audio(MUSIC_SRC);
        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = MUSIC_VOLUME;
        audioRef.current = audio;

        const markPlaying = () => setPlaying(true);
        const markPaused = () => setPlaying(false);

        audio.addEventListener('play', markPlaying);
        audio.addEventListener('pause', markPaused);

        /**
         * Seal hold / curtain open happens via timers, so play() after the
         * intro often sits outside the browser's user-gesture window. Priming
         * on the first interaction unlocks later autoplay when curtains part.
         *
         * Keep volume at 0 during the prime so the first page never audibly
         * plays — only resume at normal volume once `enabled` is true.
         */
        const unlock = () => {
            if (unlockedRef.current || unlockingRef.current) {
                return;
            }

            unlockingRef.current = true;
            audio.volume = 0;

            void audio
                .play()
                .then(() => {
                    unlockedRef.current = true;
                    unlockingRef.current = false;

                    if (!enabledRef.current) {
                        audio.pause();
                        audio.currentTime = 0;
                        audio.volume = MUSIC_VOLUME;
                        return;
                    }

                    audio.volume = MUSIC_VOLUME;
                })
                .catch(() => {
                    unlockingRef.current = false;
                    audio.volume = MUSIC_VOLUME;
                    // Still blocked — keep listeners for a later gesture.
                });
        };

        UNLOCK_EVENTS.forEach((event) => {
            document.addEventListener(event, unlock);
        });

        return () => {
            UNLOCK_EVENTS.forEach((event) => {
                document.removeEventListener(event, unlock);
            });
            audio.removeEventListener('play', markPlaying);
            audio.removeEventListener('pause', markPaused);
            audio.pause();
            audio.src = '';
            audioRef.current = null;
        };
    }, []);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        if (!enabled) {
            audio.pause();
            return;
        }

        audio.volume = MUSIC_VOLUME;

        const tryPlay = () => {
            void audio
                .play()
                .then(() => {
                    unlockedRef.current = true;
                    audio.volume = MUSIC_VOLUME;
                })
                .catch(() => {
                    // Browsers often block autoplay until a user gesture.
                });
        };

        tryPlay();

        const unlock = () => {
            if (audio.paused) {
                tryPlay();
            }

            UNLOCK_EVENTS.forEach((event) => {
                document.removeEventListener(event, unlock);
            });
        };

        UNLOCK_EVENTS.forEach((event) => {
            document.addEventListener(event, unlock, { once: true });
        });

        return () => {
            UNLOCK_EVENTS.forEach((event) => {
                document.removeEventListener(event, unlock);
            });
        };
    }, [enabled]);

    const toggle = () => {
        const audio = audioRef.current;

        if (!audio || !enabled) {
            return;
        }

        if (audio.paused) {
            void audio.play().catch(() => {});
        } else {
            audio.pause();
        }
    };

    if (!enabled) {
        return null;
    }

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={playing ? 'Mute music' : 'Play music'}
            className="fixed right-4 bottom-4 z-50 flex size-11 items-center justify-center rounded-full border border-wedding-gold/40 bg-wedding-navy/85 text-wedding-gold shadow-lg backdrop-blur-sm transition hover:bg-wedding-navy hover:text-wedding-ivory focus-visible:ring-2 focus-visible:ring-wedding-gold focus-visible:outline-none sm:right-6 sm:bottom-6"
        >
            {playing ? (
                <Volume2 className="size-5" aria-hidden="true" />
            ) : (
                <VolumeX className="size-5" aria-hidden="true" />
            )}
        </button>
    );
}
