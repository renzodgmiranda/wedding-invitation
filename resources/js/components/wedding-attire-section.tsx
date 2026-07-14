import { useState } from 'react';
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
import { cn } from '@/lib/utils';

const MOTIF_COLORS = [
    {
        name: 'Midnight',
        hex: '#1a2437',
        className: 'bg-wedding-navy',
        sampleSrc: '/images/attires/midnight.webp',
    },
    {
        name: 'Slate',
        hex: '#323b62',
        className: 'bg-wedding-slate',
        sampleSrc: '/images/attires/slate.webp',
    },
    {
        name: 'Forest',
        hex: '#2f443f',
        className: 'bg-wedding-forest',
        sampleSrc: '/images/attires/forest.webp',
    },
    {
        name: 'Sage',
        hex: '#53736e',
        className: 'bg-wedding-sage',
        sampleSrc: '/images/attires/sage.webp',
    },
    {
        name: 'Gold',
        hex: '#cbb079',
        className: 'bg-wedding-gold',
        sampleSrc: '/images/attires/gold.webp',
    },
] as const;

type MotifColor = (typeof MOTIF_COLORS)[number];

function MotifBand({ onSelect }: { onSelect: (color: MotifColor) => void }) {
    return (
        <ul className="grid w-full grid-cols-5">
            {MOTIF_COLORS.map((color) => (
                <li key={color.name}>
                    <button
                        type="button"
                        onClick={() => onSelect(color)}
                        aria-label={`View ${color.name} attire sample`}
                        className={cn(
                            'flex min-h-28 w-full flex-col items-center justify-end gap-2 px-2 pt-10 pb-5 transition-[filter] duration-300 sm:min-h-36',
                            color.className,
                            'cursor-pointer hover:brightness-110 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-wedding-gold',
                        )}
                    >
                        <span className="text-center text-[10px] tracking-[0.2em] text-wedding-ivory/95 uppercase sm:text-xs">
                            {color.name}
                        </span>
                        <span className="font-mono text-[10px] tracking-wide text-wedding-ivory/70 uppercase">
                            {color.hex}
                        </span>
                    </button>
                </li>
            ))}
        </ul>
    );
}

function AttireSampleDialog({
    color,
    open,
    onOpenChange,
}: {
    color: MotifColor | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="w-[calc(100%-2rem)] max-w-3xl gap-0 overflow-hidden rounded-none border-wedding-sage/25 bg-wedding-ivory p-0 shadow-[0_24px_60px_-28px_rgba(26,36,55,0.45)] sm:max-w-3xl"
                overlayClassName="bg-wedding-navy/40 backdrop-blur-md"
            >
                {color ? (
                    <>
                        <DialogHeader className="gap-1 border-b border-wedding-sage/15 px-6 py-5 text-center sm:text-center">
                            <p className="text-[10px] tracking-[0.3em] text-wedding-gold uppercase">
                                Sample attire
                            </p>
                            <DialogTitle className="font-sans text-2xl font-light tracking-wide text-wedding-navy">
                                {color.name}
                            </DialogTitle>
                            <DialogDescription className="font-mono text-xs tracking-wide text-wedding-slate/70 uppercase">
                                {color.hex}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="bg-wedding-cream px-4 py-4 sm:px-6 sm:py-6">
                            <img
                                src={color.sampleSrc}
                                alt={`Sample attire in ${color.name}`}
                                width={1536}
                                height={1024}
                                className="aspect-3/2 w-full object-cover"
                                decoding="async"
                            />
                        </div>
                    </>
                ) : null}
            </DialogContent>
        </Dialog>
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
    const [selected, setSelected] = useState<MotifColor | null>(null);
    const [open, setOpen] = useState(false);

    const handleSelect = (color: MotifColor) => {
        setSelected(color);
        setOpen(true);
    };

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

                    <p className="mb-4 max-w-xl font-sans text-base leading-relaxed font-light text-wedding-forest sm:text-lg">
                        Our celebration draws from a garden palette of midnight,
                        slate, forest, sage, and gold.
                    </p>
                    <p className="mb-12 text-[10px] tracking-[0.25em] text-wedding-sage uppercase sm:text-xs">
                        Tap a color for sample attire
                    </p>
                </WeddingReveal>
            </div>

            <WeddingReveal delayMs={80}>
                <MotifBand onSelect={handleSelect} />
            </WeddingReveal>

            <AttireSampleDialog
                color={selected}
                open={open}
                onOpenChange={setOpen}
            />

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
