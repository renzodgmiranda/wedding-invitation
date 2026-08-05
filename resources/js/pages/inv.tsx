import { Head } from '@inertiajs/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import WeddingMotifStripe from '@/components/wedding-motif-stripe';
import WeddingOrnament from '@/components/wedding-ornament';
import { cn } from '@/lib/utils';

const DIGITAL_URL = 'https://viaandrenzo.co';
const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(DIGITAL_URL)}`;

const REVEAL_EASE = 'cubic-bezier(0.45, 0.02, 0.2, 1)';

const PRINCIPAL_SPONSORS_A: [string, string][] = [
    ['Cecille Egurube', 'Stevie Egurube'],
    ['Lenny O. Rañeses', 'Dominador B. Rañeses'],
    ['Marie Angeli D. Jocson', 'Marc Steven S. Hidalgo'],
    ['Violeta M. Miranda', 'Rodolfo D. Miranda'],
];

const PRINCIPAL_SPONSORS_B: [string, string][] = [
    ['Tusswany D. Decipeda', 'Jan Lanzer A. Decipeda'],
    ['Nelia B. Hernandez', 'Louie H. Espiritu'],
    ['Sheryl D. Feliciano', 'Bernard Dave M. Feliciano'],
    ['Maria Asuncion M. Hizon', 'Edward Hizon'],
];

function CardShell({
    children,
    label,
    className,
    tall = false,
}: {
    children: React.ReactNode;
    label: string;
    className?: string;
    tall?: boolean;
}) {
    return (
        <figure
            className={cn(
                'flex w-[min(100%,5in)] flex-col gap-3 print:w-[3.4in]',
                tall && 'print:w-[5in]',
                className,
            )}
        >
            <figcaption className="print:hidden text-center text-xs tracking-[0.25em] text-wedding-ivory/70 uppercase">
                {label}
            </figcaption>
            <div
                data-tall-panel={tall ? '' : undefined}
                className={cn(
                    'relative w-full overflow-hidden bg-wedding-ivory text-wedding-navy shadow-[0_24px_60px_-20px_rgba(26,36,55,0.55)]',
                    tall ? 'min-h-[7in]' : 'aspect-[5/7]',
                    'print:shadow-none print:ring-1 print:ring-wedding-navy/15',
                )}
            >
                <WeddingMotifStripe className="absolute inset-x-0 top-0 z-10 h-1.5" />
                {children}
            </div>
        </figure>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[0.55rem] tracking-[0.28em] text-wedding-gold uppercase">
            {children}
        </p>
    );
}

function NameList({
    names,
    className,
}: {
    names: string[];
    className?: string;
}) {
    return (
        <ul
            className={cn(
                'mt-1 space-y-0.5 font-sans text-[0.7rem] leading-snug font-light text-wedding-forest',
                className,
            )}
        >
            {names.map((name) => (
                <li key={name}>{name}</li>
            ))}
        </ul>
    );
}

function SponsorPairs({ pairs }: { pairs: [string, string][] }) {
    return (
        <ul className="mt-1.5 space-y-1">
            {pairs.map(([left, right]) => (
                <li
                    key={`${left}-${right}`}
                    className="grid grid-cols-2 gap-x-3 font-sans text-[0.62rem] leading-snug font-light text-wedding-forest"
                >
                    <span className="text-right">{left}</span>
                    <span className="text-left">{right}</span>
                </li>
            ))}
        </ul>
    );
}

function FrontCard() {
    return (
        <CardShell label="Front">
            <div className="flex h-full flex-col items-center justify-center px-8 py-10 text-center sm:px-10">
                <p className="font-invite text-3xl leading-none text-wedding-forest sm:text-4xl">
                    You&rsquo;re Invited
                </p>

                <div className="mt-6">
                    <WeddingOrnament variant="light" />
                </div>

                <h1 className="mt-7 font-script text-6xl leading-none text-wedding-navy sm:text-7xl">
                    Via{' '}
                    <span className="text-wedding-gold">&amp;</span> Renzo
                </h1>

                <div className="mt-8 space-y-1.5 font-sans text-sm leading-relaxed font-light text-wedding-forest sm:text-[0.95rem]">
                    <p>request the pleasure of your company</p>
                    <p className="text-wedding-sage italic">
                        as we celebrate our wedding
                    </p>
                </div>

                <div className="my-7">
                    <WeddingOrnament variant="light" />
                </div>

                <div className="space-y-2">
                    <p className="text-[0.7rem] tracking-[0.32em] text-wedding-navy uppercase sm:text-xs">
                        December 21, 2026
                    </p>
                    <p className="text-[0.7rem] tracking-[0.32em] text-wedding-gold uppercase sm:text-xs">
                        2:00 PM
                    </p>
                    <p className="pt-3 font-sans text-sm tracking-wide text-wedding-forest">
                        Savanna Farm
                    </p>
                </div>
            </div>
        </CardShell>
    );
}

function BackCard() {
    return (
        <CardShell label="Back">
            <img
                src="/images/background/bg-day.webp"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div
                className="pointer-events-none absolute inset-0 bg-wedding-navy/55"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute inset-0 bg-linear-to-b from-wedding-navy/40 via-wedding-forest/35 to-wedding-navy/70"
                aria-hidden="true"
            />

            <div className="relative z-10 flex h-full flex-col items-center px-8 py-10 text-center sm:px-10">
                <div className="flex flex-1 flex-col items-center justify-center">
                    <p className="text-[0.65rem] tracking-[0.35em] text-wedding-gold uppercase">
                        The Celebration
                    </p>

                    <h2 className="mt-4 font-script text-5xl leading-none text-wedding-ivory sm:text-6xl">
                        Savanna Farm
                    </h2>

                    <p className="mt-4 font-sans text-sm font-light tracking-wide text-wedding-ivory/90">
                        007, Alfonso, Tagaytay
                    </p>

                    <div className="my-7">
                        <WeddingOrnament variant="dark" />
                    </div>

                    <p className="max-w-[16rem] font-sans text-sm leading-relaxed font-light text-wedding-ivory/85">
                        Formal attire in our motif colors — Midnight, Slate,
                        Forest, Sage &amp; Gold.
                    </p>

                    <p className="mt-6 text-[0.65rem] tracking-[0.28em] text-wedding-gold/90 uppercase">
                        If there are inquiries
                    </p>
                    <a
                        href="tel:09173066895"
                        className="mt-1.5 font-sans text-sm tracking-wide text-wedding-ivory"
                    >
                        0917 306 6895
                    </a>
                </div>

                <div className="mt-auto flex flex-col items-center gap-3 border-t border-wedding-gold/40 pt-7">
                    <img
                        src={QR_SRC}
                        alt={`QR code linking to ${DIGITAL_URL}`}
                        width={112}
                        height={112}
                        className="size-28 bg-wedding-ivory p-1.5"
                    />
                    <div className="space-y-1">
                        <p className="text-[0.65rem] tracking-[0.28em] text-wedding-ivory uppercase">
                            RSVP &amp; details online
                        </p>
                        <p className="font-sans text-xs tracking-wide text-wedding-gold">
                            viaandrenzo.co
                        </p>
                    </div>
                </div>
            </div>
        </CardShell>
    );
}

const MOTIF_SWATCHES = [
    { name: 'Midnight', className: 'bg-wedding-navy' },
    { name: 'Slate', className: 'bg-wedding-slate' },
    { name: 'Forest', className: 'bg-wedding-forest' },
    { name: 'Sage', className: 'bg-wedding-sage' },
    { name: 'Gold', className: 'bg-wedding-gold' },
] as const;

const VENUE = {
    name: 'Savanna Farm',
    address: '007, Alfonso, Tagaytay',
    mapSrc: '/images/map/savanna-farm.webp',
};

function DetailBody({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <p
            className={cn(
                'mt-1 font-sans text-[0.68rem] leading-relaxed font-light text-wedding-forest',
                className,
            )}
        >
            {children}
        </p>
    );
}

function EntourageCard() {
    return (
        <CardShell label="Page 3 · Entourage" tall className="print:break-before-page">
            <div className="flex flex-col items-center px-5 py-8 text-center sm:px-6">
                <p className="font-invite text-3xl leading-none text-wedding-forest">
                    Entourage
                </p>

                <div className="mt-4 mb-5">
                    <WeddingOrnament variant="light" />
                </div>

                <div className="grid w-full grid-cols-2 gap-x-4 gap-y-4">
                    <div>
                        <SectionLabel>Groom</SectionLabel>
                        <NameList names={['Renzo Andre DG. Miranda']} />
                    </div>
                    <div>
                        <SectionLabel>Bride</SectionLabel>
                        <NameList names={['Vianca D. Hernandez']} />
                    </div>
                    <div>
                        <SectionLabel>Groom&rsquo;s Parents</SectionLabel>
                        <NameList
                            names={[
                                'Vivian DG. Miranda',
                                'Felix DG. Miranda Jr. †',
                            ]}
                        />
                    </div>
                    <div>
                        <SectionLabel>Bride&rsquo;s Parents</SectionLabel>
                        <NameList
                            names={[
                                'Adelfa D. Hernandez',
                                'Victor B. Hernandez †',
                            ]}
                        />
                    </div>
                </div>

                <div className="mt-5 w-full">
                    <SectionLabel>Principal Sponsors</SectionLabel>
                    <SponsorPairs pairs={PRINCIPAL_SPONSORS_A} />
                    <div
                        className="mx-auto my-2.5 h-px w-16 bg-wedding-gold/45"
                        aria-hidden="true"
                    />
                    <SponsorPairs pairs={PRINCIPAL_SPONSORS_B} />
                </div>

                <div className="mt-5 grid w-full grid-cols-2 gap-x-4 gap-y-4">
                    <div>
                        <SectionLabel>Best Men</SectionLabel>
                        <NameList
                            names={['Nico Rañeses & Nathaniel Egurube']}
                        />
                    </div>
                    <div>
                        <SectionLabel>Maid of Honor</SectionLabel>
                        <NameList names={['Princess Del D. Hernandez']} />
                    </div>
                </div>

                <div className="mt-5 grid w-full grid-cols-3 gap-x-2 gap-y-3">
                    <div>
                        <SectionLabel>Cord</SectionLabel>
                        <NameList
                            names={[
                                'Kaina Brittney G. De Cadiz',
                                'James Wendel M. Decipeda',
                            ]}
                        />
                    </div>
                    <div>
                        <SectionLabel>Veil</SectionLabel>
                        <NameList
                            names={[
                                'Alexis Joyce M. Soriano',
                                'Jay Wesley M. Decipeda',
                            ]}
                        />
                    </div>
                    <div>
                        <SectionLabel>Candle</SectionLabel>
                        <NameList
                            names={[
                                'Joyce Wendy M. Decipeda',
                                'Lourdes Ellise P. Jocson',
                            ]}
                        />
                    </div>
                </div>

                <div className="mt-5 w-full">
                    <SectionLabel>Bridesmaids</SectionLabel>
                    <NameList
                        className="mx-auto max-w-xs"
                        names={[
                            'Mary Jhossan D. Sonico',
                            'Reina Mari DG. Miranda',
                            'Serenity Sellen J. Hernandez',
                            'Vivienne Vielle J. Hernandez',
                        ]}
                    />
                </div>

                <div className="mt-5 grid w-full grid-cols-3 gap-x-2 gap-y-3">
                    <div>
                        <SectionLabel>Coin Bearer</SectionLabel>
                        <NameList names={['Elior Grant A. Armea']} />
                    </div>
                    <div>
                        <SectionLabel>Bible Bearer</SectionLabel>
                        <NameList names={['Tyler Rafael J. Hidalgo']} />
                    </div>
                    <div>
                        <SectionLabel>Ring Bearer</SectionLabel>
                        <NameList names={['Gabriel Mikael J. San Juan']} />
                    </div>
                </div>

                <div className="mt-5 w-full">
                    <SectionLabel>Flower Girls</SectionLabel>
                    <NameList
                        names={[
                            'Sofia Arabella D. Decipeda',
                            'Isabella Egurube',
                        ]}
                    />
                </div>
            </div>
        </CardShell>
    );
}

function DetailsCard() {
    return (
        <CardShell label="Page 4 · Details" tall className="print:break-before-page">
            <div className="flex h-full flex-col items-center justify-center px-5 py-6 text-center sm:px-6">
                <p className="font-invite text-3xl leading-none text-wedding-forest">
                    Details
                </p>

                <div className="mt-3 mb-4">
                    <WeddingOrnament variant="light" />
                </div>

                <div className="w-full space-y-3.5">
                    <div>
                        <SectionLabel>Attire &amp; Motif</SectionLabel>

                        <p className="mt-2 text-[0.58rem] tracking-[0.22em] text-wedding-sage uppercase">
                            Principal Sponsors
                        </p>
                        <DetailBody>
                            <span className="font-medium text-wedding-navy">
                                Ninong:
                            </span>{' '}
                            Formal suit — bottle green ties (bride), midnight
                            blue ties (groom)
                        </DetailBody>
                        <DetailBody>
                            <span className="font-medium text-wedding-navy">
                                Ninang:
                            </span>{' '}
                            Formal gowns — bottle green for the bride side
                        </DetailBody>

                        <p className="mt-2.5 text-[0.58rem] tracking-[0.22em] text-wedding-sage uppercase">
                            Guests
                        </p>
                        <DetailBody>
                            <span className="font-medium text-wedding-navy">
                                Gentlemen:
                            </span>{' '}
                            Suit and tie
                            <span className="mx-1.5 text-wedding-gold/60">
                                ·
                            </span>
                            <span className="font-medium text-wedding-navy">
                                Ladies:
                            </span>{' '}
                            Garden formal
                        </DetailBody>
                        <DetailBody className="mt-2 italic text-wedding-sage">
                            We would love to see you in these colors:
                        </DetailBody>
                        <ul className="mt-2 flex flex-wrap items-center justify-center gap-2">
                            {MOTIF_SWATCHES.map((swatch) => (
                                <li
                                    key={swatch.name}
                                    className="flex flex-col items-center gap-0.5"
                                >
                                    <span
                                        className={cn(
                                            'size-4 rounded-full ring-1 ring-wedding-navy/15',
                                            swatch.className,
                                        )}
                                        aria-hidden="true"
                                    />
                                    <span className="text-[0.5rem] tracking-[0.18em] text-wedding-forest uppercase">
                                        {swatch.name}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div
                        className="mx-auto h-px w-16 bg-wedding-gold/45"
                        aria-hidden="true"
                    />

                    <div>
                        <SectionLabel>Venue</SectionLabel>
                        <p className="mt-1.5 font-script text-2xl leading-none text-wedding-navy">
                            {VENUE.name}
                        </p>
                        <DetailBody>
                            {VENUE.address}
                            <span className="mx-1.5 text-wedding-gold/60">
                                ·
                            </span>
                            December 21, 2026 · 2:00 PM
                        </DetailBody>
                        <div className="mt-2.5 overflow-hidden ring-1 ring-wedding-navy/10">
                            <img
                                src={VENUE.mapSrc}
                                alt={`Map to ${VENUE.name}`}
                                className="aspect-[2/1] w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </CardShell>
    );
}

export default function Inv() {
    const [visible, setVisible] = useState(false);
    const tallPairRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => setVisible(true));
        return () => window.cancelAnimationFrame(frame);
    }, []);

    useLayoutEffect(() => {
        const root = tallPairRef.current;
        if (!root) {
            return;
        }

        const panels = () =>
            Array.from(
                root.querySelectorAll<HTMLElement>('[data-tall-panel]'),
            );

        const syncHeight = () => {
            const nodes = panels();
            if (nodes.length < 2) {
                return;
            }

            nodes.forEach((node) => {
                node.style.height = 'auto';
            });

            const height = Math.max(
                ...nodes.map((node) => node.scrollHeight),
            );

            nodes.forEach((node) => {
                node.style.height = `${height}px`;
            });
        };

        syncHeight();

        window.addEventListener('resize', syncHeight);
        const images = Array.from(root.querySelectorAll('img'));
        images.forEach((img) => {
            if (!img.complete) {
                img.addEventListener('load', syncHeight);
            }
        });

        return () => {
            window.removeEventListener('resize', syncHeight);
            images.forEach((img) => {
                img.removeEventListener('load', syncHeight);
            });
        };
    }, []);

    return (
        <>
            <Head title="Physical Invitation Sample">
                <style>{`
                    @media print {
                        @page {
                            size: landscape;
                            margin: 0.4in;
                        }
                        html, body {
                            background: white !important;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    }
                `}</style>
            </Head>

            <div className="relative min-h-screen overflow-hidden bg-wedding-navy print:bg-white print:min-h-0">
                <div
                    className="pointer-events-none absolute inset-0 print:hidden"
                    aria-hidden="true"
                >
                    <div className="absolute inset-0 bg-linear-to-br from-wedding-navy via-wedding-forest to-wedding-slate" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(203,176,121,0.18),transparent_55%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(83,115,110,0.25),transparent_50%)]" />
                    <div
                        className="absolute inset-0 opacity-[0.07]"
                        style={{
                            backgroundImage:
                                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
                        }}
                    />
                </div>

                <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-5 py-10 sm:px-8 sm:py-14 print:max-w-none print:p-0">
                    <header
                        className={cn(
                            'print:hidden mb-10 flex max-w-xl flex-col items-center text-center transition-[opacity,transform] duration-1000',
                            visible
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-4 opacity-0',
                        )}
                        style={{ transitionTimingFunction: REVEAL_EASE }}
                    >
                        <WeddingMotifStripe className="mb-6 h-1 w-40" />
                        <h1 className="font-sans text-2xl tracking-wide text-wedding-ivory sm:text-3xl">
                            Physical invitation sample
                        </h1>
                        <p className="mt-3 font-sans text-sm font-light text-wedding-ivory/75">
                            5 × 7 in · front, back, entourage &amp; details —
                            for print shops to copy
                        </p>
                        <div className="mt-8 w-full max-w-lg space-y-4 border border-wedding-gold/30 bg-wedding-navy/40 px-5 py-5 text-left sm:px-6">
                            <p className="text-center text-[0.6rem] tracking-[0.28em] text-wedding-gold uppercase">
                                Font styles to use
                            </p>
                            <ul className="space-y-4">
                                <li className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                                    <div className="sm:w-36 sm:shrink-0">
                                        <p className="font-sans text-xs tracking-wide text-wedding-ivory">
                                            Alex Brush
                                        </p>
                                        <p className="font-sans text-[0.65rem] font-light text-wedding-ivory/50">
                                            Script · Names
                                        </p>
                                    </div>
                                    <p className="font-script text-3xl leading-none text-wedding-ivory">
                                        Via &amp; Renzo
                                    </p>
                                </li>
                                <li className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                                    <div className="sm:w-36 sm:shrink-0">
                                        <p className="font-sans text-xs tracking-wide text-wedding-ivory">
                                            Allura
                                        </p>
                                        <p className="font-sans text-[0.65rem] font-light text-wedding-ivory/50">
                                            Calligraphy · Headings
                                        </p>
                                    </div>
                                    <p className="font-invite text-2xl leading-none text-wedding-ivory">
                                        You&rsquo;re Invited
                                    </p>
                                </li>
                                <li className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                                    <div className="sm:w-36 sm:shrink-0">
                                        <p className="font-sans text-xs tracking-wide text-wedding-ivory">
                                            Nunito Light
                                        </p>
                                        <p className="font-sans text-[0.65rem] font-light text-wedding-ivory/50">
                                            Sans-serif · Body
                                        </p>
                                    </div>
                                    <p className="font-sans text-sm font-light leading-snug tracking-wide text-wedding-ivory">
                                        request the pleasure of your company
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </header>

                    <div
                        className={cn(
                            'flex w-full flex-col flex-wrap items-center justify-center gap-10 transition-[opacity,transform] duration-1100 lg:flex-row lg:items-start lg:gap-12',
                            'print:flex-row print:flex-wrap print:items-start print:justify-center print:gap-8 print:opacity-100 print:translate-y-0',
                            visible
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-5 opacity-0',
                        )}
                        style={{
                            transitionTimingFunction: REVEAL_EASE,
                            transitionDelay: visible ? '120ms' : '0ms',
                        }}
                    >
                        <FrontCard />
                        <BackCard />
                        <div
                            ref={tallPairRef}
                            className="flex w-full flex-col items-center gap-10 lg:w-auto lg:flex-row lg:items-start lg:gap-12 print:w-auto print:flex-row print:items-start print:gap-8"
                        >
                            <EntourageCard />
                            <DetailsCard />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
