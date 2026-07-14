import WeddingOrnament from '@/components/wedding-ornament';
import WeddingPanel from '@/components/wedding-panel';
import WeddingReveal from '@/components/wedding-reveal';

const MOTIF_COLORS = [
    { name: 'Midnight', hex: '#1a2437', className: 'bg-wedding-navy' },
    { name: 'Slate', hex: '#323b62', className: 'bg-wedding-slate' },
    { name: 'Forest', hex: '#2f443f', className: 'bg-wedding-forest' },
    { name: 'Sage', hex: '#53736e', className: 'bg-wedding-sage' },
    { name: 'Gold', hex: '#cbb079', className: 'bg-wedding-gold' },
] as const;

function MotifBand() {
    return (
        <ul className="grid w-full grid-cols-5">
            {MOTIF_COLORS.map((color) => (
                <li
                    key={color.name}
                    className={`flex min-h-28 flex-col items-center justify-end gap-2 px-2 pt-10 pb-5 sm:min-h-36 ${color.className}`}
                >
                    <span className="text-center text-[10px] tracking-[0.2em] text-wedding-ivory/95 uppercase sm:text-xs">
                        {color.name}
                    </span>
                    <span className="font-mono text-[10px] tracking-wide text-wedding-ivory/70 uppercase">
                        {color.hex}
                    </span>
                </li>
            ))}
        </ul>
    );
}

function AttireBlock({
    label,
    title,
    children,
}: {
    label?: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center text-center">
            {label ? (
                <p className="mb-2 text-[10px] tracking-[0.3em] text-wedding-gold uppercase sm:text-xs">
                    {label}
                </p>
            ) : null}
            <h3 className="mb-4 font-sans text-xl font-light tracking-wide text-wedding-navy sm:text-2xl">
                {title}
            </h3>
            <p className="max-w-md font-sans text-base leading-relaxed font-light text-wedding-slate/90">
                {children}
            </p>
        </div>
    );
}

export default function WeddingAttireSection() {
    return (
        <section className="overflow-hidden bg-wedding-cream py-20">
            <div className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
                <WeddingReveal>
                    <p className="mb-4 text-xs tracking-[0.35em] text-wedding-gold uppercase sm:text-sm">
                        Dress the palette
                    </p>

                    <h2 className="font-sans text-3xl font-light tracking-wide text-wedding-navy sm:text-4xl">
                        Attire &amp; Motif
                    </h2>

                    <div className="my-8">
                        <WeddingOrnament />
                    </div>

                    <p className="mb-12 max-w-xl font-sans text-base leading-relaxed font-light text-wedding-forest sm:text-lg">
                        Our celebration draws from a garden palette of midnight,
                        slate, forest, sage, and gold.
                    </p>
                </WeddingReveal>
            </div>

            <WeddingReveal delayMs={80}>
                <MotifBand />
            </WeddingReveal>

            <div className="mx-auto mt-12 max-w-3xl px-6">
                <WeddingReveal delayMs={140}>
                    <WeddingPanel className="space-y-12 px-6 py-12 sm:px-10 sm:py-14">
                        <AttireBlock label="Attire" title="Formal Garden attire">
                            An elevated look suited to an outdoor celebration —
                            polished, comfortable, and at home in the garden.
                        </AttireBlock>

                        <AttireBlock title="Our color story">
                            Deep blues, forest greens, sage, and soft gold
                            accents echo the mood of our day. You are warmly
                            invited to weave these tones into your outfit.
                        </AttireBlock>

                        <AttireBlock title="Kindly avoid">
                            White and ivory (reserved for the bride), loud
                            neons, and overly casual wear such as shorts,
                            flip-flops, or athletic attire.
                        </AttireBlock>
                    </WeddingPanel>
                </WeddingReveal>
            </div>
        </section>
    );
}
