import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const WEDDING_DATE = new Date('2026-12-21T00:00:00');

type TimeLeft = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

function getTimeLeft(): TimeLeft {
    const difference = WEDDING_DATE.getTime() - Date.now();

    if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
    };
}

const LIGHT_STYLES = [
    {
        label: 'Days',
        border: 'border-wedding-gold/40',
        accent: 'bg-wedding-gold',
        number: 'text-wedding-navy',
        box: 'bg-wedding-ivory',
        labelColor: 'text-wedding-slate/70',
    },
    {
        label: 'Hours',
        border: 'border-wedding-slate/30',
        accent: 'bg-wedding-slate',
        number: 'text-wedding-slate',
        box: 'bg-wedding-ivory',
        labelColor: 'text-wedding-slate/70',
    },
    {
        label: 'Minutes',
        border: 'border-wedding-sage/40',
        accent: 'bg-wedding-sage',
        number: 'text-wedding-sage',
        box: 'bg-wedding-ivory',
        labelColor: 'text-wedding-slate/70',
    },
    {
        label: 'Seconds',
        border: 'border-wedding-forest/30',
        accent: 'bg-wedding-forest',
        number: 'text-wedding-forest',
        box: 'bg-wedding-ivory',
        labelColor: 'text-wedding-slate/70',
    },
] as const;

const DARK_STYLES = [
    {
        label: 'Days',
        border: 'border-wedding-gold/40',
        accent: 'bg-wedding-gold',
        number: 'text-wedding-ivory',
        box: 'bg-wedding-navy/40',
        labelColor: 'text-wedding-gold/80',
    },
    {
        label: 'Hours',
        border: 'border-wedding-slate/50',
        accent: 'bg-wedding-slate',
        number: 'text-wedding-ivory',
        box: 'bg-wedding-navy/40',
        labelColor: 'text-wedding-gold/80',
    },
    {
        label: 'Minutes',
        border: 'border-wedding-sage/50',
        accent: 'bg-wedding-sage',
        number: 'text-wedding-ivory',
        box: 'bg-wedding-navy/40',
        labelColor: 'text-wedding-gold/80',
    },
    {
        label: 'Seconds',
        border: 'border-wedding-forest/50',
        accent: 'bg-wedding-forest',
        number: 'text-wedding-ivory',
        box: 'bg-wedding-navy/40',
        labelColor: 'text-wedding-gold/80',
    },
] as const;

function CountdownUnit({
    value,
    label,
    border,
    accent,
    number,
    box,
    labelColor,
}: {
    value: number;
    label: string;
    border: string;
    accent: string;
    number: string;
    box: string;
    labelColor: string;
}) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className={cn(
                    'relative flex h-16 w-16 items-center justify-center border backdrop-blur-sm sm:h-20 sm:w-20',
                    border,
                    box,
                )}
            >
                <span className={cn('absolute top-0 left-0 h-0.5 w-full', accent)} />
                <span
                    className={cn(
                        'font-sans text-2xl font-light tabular-nums sm:text-3xl',
                        number,
                    )}
                >
                    {String(value).padStart(2, '0')}
                </span>
            </div>
            <span
                className={cn(
                    'text-[10px] tracking-[0.25em] uppercase sm:text-xs',
                    labelColor,
                )}
            >
                {label}
            </span>
        </div>
    );
}

export default function WeddingCountdown({
    variant = 'light',
}: {
    variant?: 'light' | 'dark';
}) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft);
    const styles = variant === 'dark' ? DARK_STYLES : LIGHT_STYLES;
    const values = [
        timeLeft.days,
        timeLeft.hours,
        timeLeft.minutes,
        timeLeft.seconds,
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex gap-3 sm:gap-5">
            {styles.map((unit, index) => (
                <CountdownUnit
                    key={unit.label}
                    value={values[index]}
                    label={unit.label}
                    border={unit.border}
                    accent={unit.accent}
                    number={unit.number}
                    box={unit.box}
                    labelColor={unit.labelColor}
                />
            ))}
        </div>
    );
}
