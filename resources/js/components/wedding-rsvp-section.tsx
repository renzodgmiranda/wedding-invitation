import { Form } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import WeddingOrnament from '@/components/wedding-ornament';
import WeddingPanel from '@/components/wedding-panel';
import WeddingReveal from '@/components/wedding-reveal';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

const fieldClassName =
    'w-full border border-wedding-sage/25 bg-wedding-cream px-4 py-3 font-sans text-base text-wedding-navy outline-none transition-colors placeholder:text-wedding-sage/50 focus:border-wedding-gold focus:ring-1 focus:ring-wedding-gold/40';

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

export default function WeddingRsvpSection() {
    const [attending, setAttending] = useState<'1' | '0' | ''>('');

    return (
        <section id="rsvp" className="relative overflow-hidden bg-wedding-cream">
            <div className="px-6 py-20">
                <div className="mx-auto flex max-w-lg flex-col items-center text-center">
                    <WeddingReveal className="w-full">
                        <WeddingPanel accent="navy" className="px-6 py-10 sm:px-10 sm:py-12">
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
                                onSuccess={() => setAttending('')}
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
        </section>
    );
}
