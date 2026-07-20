import { Form } from '@inertiajs/react';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import WeddingOrnament from '@/components/wedding-ornament';
import WeddingPanel from '@/components/wedding-panel';
import WeddingReveal from '@/components/wedding-reveal';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

const fieldClassName =
    'w-full border border-wedding-sage/25 bg-wedding-cream px-4 py-3 font-sans text-base text-wedding-navy outline-none transition-colors placeholder:text-wedding-sage/50 focus:border-wedding-gold focus:ring-1 focus:ring-wedding-gold/40';

const REVEAL_EASE = 'cubic-bezier(0.45, 0.02, 0.2, 1)';

function AttendOption({
    value,
    label,
    selected,
    onSelect,
}: {
    value: '1' | '0';
    label: string;
    selected: boolean;
    onSelect: (value: '1' | '0') => void;
}) {
    return (
        <label
            className={`flex flex-1 cursor-pointer items-center justify-center border px-4 py-3 text-sm tracking-wide transition-colors ${
                selected
                    ? 'border-wedding-navy bg-wedding-navy text-wedding-ivory'
                    : 'border-wedding-sage/30 bg-wedding-cream text-wedding-forest hover:border-wedding-gold'
            }`}
        >
            <input
                type="radio"
                name="attending"
                value={value}
                checked={selected}
                onChange={() => onSelect(value)}
                className="sr-only"
                required
            />
            {label}
        </label>
    );
}

function ModalReveal({
    show,
    delayMs = 0,
    className,
    children,
}: {
    show: boolean;
    delayMs?: number;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className={cn(
                'transition-opacity duration-700',
                show ? 'opacity-100' : 'opacity-0',
                className,
            )}
            style={{
                transitionTimingFunction: REVEAL_EASE,
                transitionDelay: show ? `${delayMs}ms` : '0ms',
            }}
        >
            {children}
        </div>
    );
}

function RsvpConfirmationModal({
    open,
    attending,
    onOpenChange,
}: {
    open: boolean;
    attending: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [contentReady, setContentReady] = useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        setContentReady(false);
        const frame = requestAnimationFrame(() => {
            setContentReady(true);
        });

        return () => cancelAnimationFrame(frame);
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="w-[calc(100%-2rem)] max-w-sm gap-0 overflow-hidden rounded-none border-wedding-sage/25 bg-wedding-ivory p-0 shadow-[0_24px_60px_-28px_rgba(26,36,55,0.45)] duration-300 sm:max-w-sm"
                overlayClassName="bg-wedding-navy/45 backdrop-blur-md duration-300"
            >
                <div className="flex flex-col items-center px-8 pt-10 pb-9 text-center">
                    <ModalReveal show={contentReady} delayMs={60}>
                        <div
                            aria-hidden="true"
                            className="mb-6 size-16 rounded-full bg-contain bg-center bg-no-repeat drop-shadow-[0_8px_20px_rgba(26,36,55,0.16)]"
                            style={{
                                backgroundImage: `image-set(
                                    url('/images/envelope/seal.webp') type('image/webp'),
                                    url('/images/envelope/seal.png') type('image/png')
                                )`,
                            }}
                        />
                    </ModalReveal>

                    <DialogHeader className="items-center gap-0 text-center sm:text-center">
                        <ModalReveal show={contentReady} delayMs={140}>
                            <p className="mb-3 text-[10px] tracking-[0.3em] text-wedding-gold uppercase">
                                RSVP received
                            </p>
                        </ModalReveal>
                        <ModalReveal show={contentReady} delayMs={220}>
                            <DialogTitle className="mb-3 font-sans text-2xl font-light tracking-wide text-wedding-navy">
                                Thank you
                            </DialogTitle>
                        </ModalReveal>
                        <ModalReveal show={contentReady} delayMs={300}>
                            <div className="mb-3 py-1">
                                <WeddingOrnament />
                            </div>
                        </ModalReveal>
                        <ModalReveal show={contentReady} delayMs={380}>
                            <DialogDescription className="max-w-[18rem] font-sans text-sm leading-relaxed text-wedding-slate">
                                {attending
                                    ? "Your RSVP is confirmed! Don't forget to head out early to beat that Tagaytay traffic, we can't wait to see your lovely self there!"
                                    : "Thanks for letting us know! We'll definitely feel your absence on the dance floor, but we totally get it. Sending you lots of love!"}
                            </DialogDescription>
                        </ModalReveal>
                    </DialogHeader>

                    <ModalReveal
                        show={contentReady}
                        delayMs={480}
                        className="w-full"
                    >
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="mt-8 border border-wedding-navy bg-wedding-navy px-8 py-2.5 text-xs tracking-[0.2em] text-wedding-ivory uppercase transition-colors hover:border-wedding-slate hover:bg-wedding-slate"
                        >
                            Close
                        </button>
                    </ModalReveal>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function WeddingRsvpSection() {
    const [attending, setAttending] = useState<'1' | '0' | ''>('');
    const [confirmedAttending, setConfirmedAttending] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [contactName, setContactName] = useState('');
    const [partySize, setPartySize] = useState(0);
    const [partyNames, setPartyNames] = useState<string[]>([]);

    const resetParty = () => {
        setContactName('');
        setPartySize(0);
        setPartyNames([]);
    };

    const updatePartySize = (size: number) => {
        const nextSize = Math.min(5, Math.max(0, size));
        setPartySize(nextSize);
        setPartyNames((current) => {
            if (nextSize === 0) {
                return [];
            }

            const next = [...current];

            while (next.length < nextSize) {
                next.push('');
            }

            return next.slice(0, nextSize);
        });
    };

    const updatePartyName = (index: number, value: string) => {
        setPartyNames((current) =>
            current.map((name, nameIndex) =>
                nameIndex === index ? value : name,
            ),
        );
    };

    return (
        <section id="rsvp" className="relative overflow-hidden bg-wedding-cream">
            <div className="px-6 py-20">
                <div className="mx-auto flex max-w-lg flex-col items-center text-center">
                    <WeddingReveal className="w-full">
                        <WeddingPanel
                            accent="navy"
                            className="px-6 py-10 sm:px-10 sm:py-12"
                        >
                            <h2 className="font-sans text-3xl font-light tracking-wide text-wedding-navy sm:text-4xl">
                                RSVP
                            </h2>

                            <div className="my-8">
                                <WeddingOrnament />
                            </div>

                            <Form
                                action="/rsvp"
                                method="post"
                                className="w-full space-y-6 text-left"
                                options={{ preserveScroll: true }}
                                resetOnSuccess
                                onSuccess={() => {
                                    setConfirmedAttending(attending === '1');
                                    setAttending('');
                                    resetParty();
                                    window.setTimeout(() => {
                                        setShowConfirmation(true);
                                    }, 220);
                                }}
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="name"
                                                className="text-xs tracking-[0.2em] text-wedding-slate uppercase"
                                            >
                                                Full Name
                                            </Label>
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                autoComplete="name"
                                                value={contactName}
                                                onChange={(event) =>
                                                    setContactName(
                                                        event.target.value,
                                                    )
                                                }
                                                className={fieldClassName}
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="email"
                                                className="text-xs tracking-[0.2em] text-wedding-slate uppercase"
                                            >
                                                Email
                                            </Label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                autoComplete="email"
                                                className={fieldClassName}
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-xs tracking-[0.2em] text-wedding-slate uppercase">
                                                Will you attend?
                                            </p>
                                            <div className="flex gap-3">
                                                <AttendOption
                                                    value="1"
                                                    label="Yes"
                                                    selected={attending === '1'}
                                                    onSelect={setAttending}
                                                />
                                                <AttendOption
                                                    value="0"
                                                    label="No"
                                                    selected={attending === '0'}
                                                    onSelect={setAttending}
                                                />
                                            </div>
                                            <InputError
                                                message={errors.attending}
                                            />
                                        </div>

                                        {attending === '1' && (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="party-size"
                                                        className="text-xs tracking-[0.2em] text-wedding-slate uppercase"
                                                    >
                                                        Additional Guests
                                                    </Label>
                                                    <select
                                                        id="party-size"
                                                        name="party[size]"
                                                        required
                                                        value={partySize}
                                                        onChange={(event) =>
                                                            updatePartySize(
                                                                Number(
                                                                    event.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                        className={`${fieldClassName} appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-12`}
                                                        style={{
                                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2353736e'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                                                        }}
                                                    >
                                                        <option value={0}>
                                                            Just me, myself, and
                                                            I
                                                        </option>
                                                        {Array.from(
                                                            { length: 5 },
                                                            (_, index) => {
                                                                const count =
                                                                    index + 1;

                                                                return (
                                                                    <option
                                                                        key={
                                                                            count
                                                                        }
                                                                        value={
                                                                            count
                                                                        }
                                                                    >
                                                                        {count}{' '}
                                                                        {count ===
                                                                        1
                                                                            ? 'additional guest'
                                                                            : 'additional guests'}
                                                                    </option>
                                                                );
                                                            },
                                                        )}
                                                    </select>
                                                    <p className="flex items-start gap-2.5 border-l-2 border-wedding-gold bg-wedding-gold/10 px-3 py-2.5 text-sm leading-relaxed text-wedding-navy">
                                                        <Info
                                                            className="mt-0.5 size-4 shrink-0 text-wedding-gold"
                                                            aria-hidden="true"
                                                        />
                                                        <span>
                                                            Bringing a guest?
                                                            Please check in with
                                                            the couple before
                                                            adding them.
                                                        </span>
                                                    </p>
                                                    <InputError
                                                        message={
                                                            errors[
                                                                'party.size'
                                                            ] || errors.party
                                                        }
                                                    />
                                                </div>

                                                {partySize > 0 && (
                                                    <div className="space-y-3">
                                                        <p className="text-xs tracking-[0.2em] text-wedding-slate uppercase">
                                                            Guest Names
                                                        </p>
                                                        {partyNames.map(
                                                            (
                                                                guestName,
                                                                index,
                                                            ) => (
                                                                <div
                                                                    key={`guest-${index}`}
                                                                    className="space-y-2"
                                                                >
                                                                    <Label
                                                                        htmlFor={`party-name-${index}`}
                                                                        className="text-[0.6875rem] tracking-[0.16em] text-wedding-sage uppercase"
                                                                    >
                                                                        Guest{' '}
                                                                        {index +
                                                                            1}
                                                                    </Label>
                                                                    <input
                                                                        id={`party-name-${index}`}
                                                                        name={`party[names][${index}]`}
                                                                        type="text"
                                                                        required
                                                                        value={
                                                                            guestName
                                                                        }
                                                                        onChange={(
                                                                            event,
                                                                        ) =>
                                                                            updatePartyName(
                                                                                index,
                                                                                event
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        className={
                                                                            fieldClassName
                                                                        }
                                                                    />
                                                                </div>
                                                            ),
                                                        )}
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    'party.names'
                                                                ] ||
                                                                errors[
                                                                    'party.names.0'
                                                                ]
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="message"
                                                className="text-xs tracking-[0.2em] text-wedding-slate uppercase"
                                            >
                                                Message
                                            </Label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                rows={4}
                                                required
                                                placeholder="A note for the couple"
                                                className={`${fieldClassName} resize-none`}
                                            />
                                            <InputError
                                                message={errors.message}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex w-full items-center justify-center gap-2 border border-wedding-navy bg-wedding-navy px-6 py-3 text-sm tracking-wide text-wedding-ivory transition-colors hover:border-wedding-slate hover:bg-wedding-slate disabled:opacity-60"
                                        >
                                            {processing && <Spinner />}
                                            Send RSVP
                                        </button>
                                    </>
                                )}
                            </Form>
                        </WeddingPanel>
                    </WeddingReveal>
                </div>
            </div>

            <footer className="bg-wedding-navy px-6 py-14 text-center">
                <WeddingReveal>
                    <p className="font-sans text-sm tracking-[0.2em] text-wedding-sage uppercase">
                        With love,
                    </p>
                    <p className="mt-3 font-script text-4xl text-wedding-ivory sm:text-5xl">
                        Via{' '}
                        <span className="text-wedding-gold">&amp;</span> Renzo
                    </p>
                </WeddingReveal>
            </footer>

            <RsvpConfirmationModal
                open={showConfirmation}
                attending={confirmedAttending}
                onOpenChange={setShowConfirmation}
            />
        </section>
    );
}
