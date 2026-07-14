import WeddingOrnament from '@/components/wedding-ornament';
import WeddingReveal from '@/components/wedding-reveal';

const REMINDERS = [
    {
        title: 'Just us and our favorite people!',
        body: 'We\u2019re keeping things small and intimate, so we can only accommodate those who received this invitation. No plus-ones, please\u2014just your lovely self!',
    },
    {
        title: 'Eyes up, hearts open!',
        body: 'Please put away your phones and cameras during the ceremony so we can all be fully present. (We promise to share our professional photos later!)',
    },
    {
        title: 'Parents, take the night off!',
        body: 'We love your little ones, but this is an adults-only celebration. We hope you can use this as the perfect excuse to let loose and party with us!',
    },
    {
        title: 'Beat the Tagaytay traffic!',
        body: 'Our ceremony starts right on time! Please give yourself plenty of extra travel time to beat the traffic and grab a seat before we say \u201cI do!\u201d',
    },
    {
        title: 'Park and party!',
        body: 'Free parking is available on-site at Savanna Farm. Just follow the venue signs when you roll in, and they\u2019ll lead you right to a spot.',
    },
    {
        title: 'Paws off the guest list!',
        body: 'We adore your furry friends, but Savanna Farm is strictly for humans for this occasion. Please leave your pets cozy at home for the day!',
    },
] as const;

export default function WeddingRemindersSection() {
    return (
        <section className="relative overflow-hidden bg-wedding-sage/15 px-6 py-20">
            <div
                className="pointer-events-none absolute inset-0 bg-linear-to-b from-wedding-forest/10 via-transparent to-wedding-forest/5"
                aria-hidden="true"
            />

            <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
                <WeddingReveal>
                    <p className="mb-4 text-xs tracking-[0.35em] text-wedding-gold uppercase sm:text-sm">
                        For our guests
                    </p>

                    <h2 className="font-sans text-3xl font-light tracking-wide text-wedding-navy sm:text-4xl">
                        A Few Gentle Reminders
                    </h2>

                    <div className="my-8">
                        <WeddingOrnament />
                    </div>
                </WeddingReveal>

                <ul className="grid w-full gap-5 text-left sm:grid-cols-2 sm:gap-6">
                    {REMINDERS.map((reminder, index) => (
                        <WeddingReveal
                            key={reminder.title}
                            delayMs={index * 60}
                            className="h-full"
                        >
                            <li className="flex h-full flex-col border border-wedding-sage/20 bg-wedding-ivory p-6 shadow-[0_16px_40px_-28px_rgba(26,36,55,0.3)] sm:p-7">
                                <span
                                    className="mb-4 font-sans text-sm tracking-[0.2em] text-wedding-gold tabular-nums"
                                    aria-hidden="true"
                                >
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <h3 className="mb-3 font-sans text-xl font-light text-wedding-navy">
                                    {reminder.title}
                                </h3>
                                <p className="font-sans text-base leading-relaxed font-light text-wedding-slate/90">
                                    {reminder.body}
                                </p>
                            </li>
                        </WeddingReveal>
                    ))}
                </ul>
            </div>
        </section>
    );
}
