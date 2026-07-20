import { Head, useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { store } from '@/routes/login';

const PIN_LENGTH = 6;
const ADMIN_EMAIL = 'admin@viaandrenzo.co';

type Props = {
    status?: string;
};

export default function Login({ status }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const submittingRef = useRef(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: ADMIN_EMAIL,
        password: '',
    });

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (
            data.password.length !== PIN_LENGTH ||
            processing ||
            submittingRef.current
        ) {
            return;
        }

        const timer = window.setTimeout(() => {
            submittingRef.current = true;
            post(store.url(), {
                onFinish: () => {
                    submittingRef.current = false;
                    reset('password');
                    requestAnimationFrame(() => inputRef.current?.focus());
                },
            });
        }, 160);

        return () => window.clearTimeout(timer);
    }, [data.password, processing, post, reset]);

    const handleChange = (value: string) => {
        setData('password', value.replace(/\D/g, '').slice(0, PIN_LENGTH));
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-wedding-cream px-6 py-12">
            <Head title="Log in" />

            <div className="flex w-full max-w-[20rem] flex-col items-center">
                <div
                    aria-hidden="true"
                    className="mb-10 size-28 rounded-full bg-contain bg-center bg-no-repeat drop-shadow-[0_12px_28px_rgba(26,36,55,0.14)]"
                    style={{
                        backgroundImage: `image-set(
                            url('/images/envelope/seal.webp') type('image/webp'),
                            url('/images/envelope/seal.png') type('image/png')
                        )`,
                    }}
                />

                <h1 className="mb-1 text-center font-sans text-[1.375rem] font-medium tracking-[-0.02em] text-wedding-navy">
                    Enter Passcode
                </h1>
                <p className="mb-10 text-center font-sans text-[0.8125rem] text-wedding-sage">
                    Use your 6-digit code to continue
                </p>

                <div className="flex w-full flex-col items-center">
                    <label htmlFor="password" className="sr-only">
                        Passcode
                    </label>

                    <button
                        type="button"
                        className="relative mb-8 flex cursor-text gap-3.5 rounded-full px-2 py-3 outline-none focus-visible:ring-2 focus-visible:ring-wedding-sage/30"
                        onClick={() => inputRef.current?.focus()}
                        aria-hidden="true"
                        tabIndex={-1}
                    >
                        {Array.from({ length: PIN_LENGTH }, (_, index) => {
                            const filled = index < data.password.length;
                            const active =
                                index === data.password.length && !processing;

                            return (
                                <span
                                    key={index}
                                    className={cn(
                                        'size-3.5 rounded-full border transition-all duration-200',
                                        filled
                                            ? 'scale-100 border-wedding-navy bg-wedding-navy'
                                            : 'border-wedding-navy/25 bg-transparent',
                                        active &&
                                            'border-wedding-navy/50 shadow-[0_0_0_3px_rgba(83,115,110,0.12)]',
                                    )}
                                />
                            );
                        })}
                    </button>

                    <input
                        ref={inputRef}
                        id="password"
                        type="text"
                        name="password"
                        inputMode="numeric"
                        autoComplete="current-password"
                        pattern="[0-9]*"
                        maxLength={PIN_LENGTH}
                        value={data.password}
                        onChange={(event) => handleChange(event.target.value)}
                        disabled={processing}
                        autoFocus
                        className="sr-only"
                        data-test="login-password"
                    />

                    <InputError
                        message={errors.password || errors.email}
                        className="mb-6 text-center"
                    />

                    {processing && (
                        <div className="flex items-center gap-2 text-wedding-sage">
                            <Spinner />
                            <span className="text-sm tracking-wide">
                                Signing in…
                            </span>
                        </div>
                    )}
                </div>

                {status && (
                    <p className="mt-6 text-center text-sm font-medium text-wedding-sage">
                        {status}
                    </p>
                )}
            </div>
        </div>
    );
}
