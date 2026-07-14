import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const MUSIC_SRC = '/music/spring-waltz.webm';

export default function WeddingMusic() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        const audio = new Audio(MUSIC_SRC);
        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = 0.55;
        audioRef.current = audio;

        const markPlaying = () => setPlaying(true);
        const markPaused = () => setPlaying(false);

        audio.addEventListener('play', markPlaying);
        audio.addEventListener('pause', markPaused);

        const tryPlay = () => {
            void audio.play().catch(() => {
                // Browsers often block autoplay until a user gesture.
            });
        };

        tryPlay();

        const unlockEvents: Array<keyof DocumentEventMap> = [
            'pointerdown',
            'touchstart',
            'keydown',
        ];

        const unlock = () => {
            if (audio.paused) {
                tryPlay();
            }

            unlockEvents.forEach((event) => {
                document.removeEventListener(event, unlock);
            });
        };

        unlockEvents.forEach((event) => {
            document.addEventListener(event, unlock, { once: true });
        });

        return () => {
            unlockEvents.forEach((event) => {
                document.removeEventListener(event, unlock);
            });
            audio.removeEventListener('play', markPlaying);
            audio.removeEventListener('pause', markPaused);
            audio.pause();
            audio.src = '';
            audioRef.current = null;
        };
    }, []);

    const toggle = () => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        if (audio.paused) {
            void audio.play().catch(() => {});
        } else {
            audio.pause();
        }
    };

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
