import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { dashboard } from '@/routes';
import { cn } from '@/lib/utils';

type Party = {
    size: number;
    names: string[];
};

type RsvpEntry = {
    id: number;
    name: string;
    email: string;
    attending: boolean;
    party: Party | null;
    message: string | null;
    created_at: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedRsvps = {
    data: RsvpEntry[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
};

type Props = {
    stats: {
        total: number;
        attending: number;
        declined: number;
    };
    rsvps: PaginatedRsvps;
};

function formatDate(value: string | null): string {
    if (!value) {
        return '—';
    }

    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(value));
}

function getInitials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

function Stat({
    label,
    value,
    accent,
}: {
    label: string;
    value: number;
    accent?: 'attending' | 'declined';
}) {
    return (
        <div className="flex flex-col gap-1 sm:gap-1.5">
            <span
                className={cn(
                    'text-[1.75rem] font-semibold tracking-tight tabular-nums sm:text-[2.25rem]',
                    accent === 'attending' &&
                        'text-emerald-600 dark:text-emerald-400',
                    accent === 'declined' && 'text-muted-foreground',
                    !accent && 'text-foreground',
                )}
            >
                {value}
            </span>
            <span className="text-[0.75rem] font-medium text-muted-foreground sm:text-[0.8125rem]">
                {label}
            </span>
        </div>
    );
}

function StatusBadge({ attending }: { attending: boolean }) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 text-[0.8125rem] font-medium',
                attending
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-muted-foreground',
            )}
        >
            <span
                className={cn(
                    'size-1.5 rounded-full',
                    attending ? 'bg-emerald-500' : 'bg-muted-foreground/40',
                )}
                aria-hidden="true"
            />
            {attending ? 'Attending' : 'Declined'}
        </span>
    );
}

function PartyDetails({ party }: { party: Party | null }) {
    if (!party) {
        return (
            <span className="text-[0.8125rem] text-muted-foreground/60">—</span>
        );
    }

    const names = Array.isArray(party.names)
        ? party.names.filter(Boolean)
        : [];

    if (party.size === 0) {
        return (
            <p className="text-[0.8125rem] text-muted-foreground">
                Just me, myself, and I
            </p>
        );
    }

    return (
        <div className="min-w-0">
            <p className="text-[0.8125rem] font-medium text-foreground tabular-nums">
                +{party.size}{' '}
                {party.size === 1 ? 'guest' : 'guests'}
            </p>
            {names.length > 0 && (
                <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {names.join(', ')}
                </p>
            )}
        </div>
    );
}

function GuestAvatar({ name }: { name: string }) {
    return (
        <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-[0.6875rem] font-semibold tracking-wide text-muted-foreground sm:size-9"
            aria-hidden="true"
        >
            {getInitials(name)}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="px-6 py-20 text-center">
            <p className="text-[0.9375rem] font-medium text-foreground">
                No responses yet
            </p>
            <p className="mt-1 text-[0.8125rem] text-muted-foreground">
                Guest RSVPs will show up here as they come in
            </p>
        </div>
    );
}

function Pagination({ rsvps }: { rsvps: PaginatedRsvps }) {
    if (rsvps.last_page <= 1) {
        return null;
    }

    const pageLinks = rsvps.links.filter(
        (link) =>
            !link.label.includes('Previous') && !link.label.includes('Next'),
    );

    return (
        <div className="flex flex-col gap-3 border-t border-border/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-center text-[0.8125rem] text-muted-foreground sm:text-left">
                {rsvps.from && rsvps.to ? (
                    <>
                        Showing{' '}
                        <span className="font-medium text-foreground tabular-nums">
                            {rsvps.from}–{rsvps.to}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium text-foreground tabular-nums">
                            {rsvps.total}
                        </span>
                    </>
                ) : (
                    'No results'
                )}
            </p>

            <div className="flex items-center justify-center gap-1">
                <PaginationButton
                    href={rsvps.prev_page_url}
                    label="Previous"
                    icon="prev"
                />

                <div className="mx-1 hidden items-center gap-1 sm:flex">
                    {pageLinks.map((link, index) => (
                        <PaginationPage
                            key={`${link.label}-${index}`}
                            link={link}
                        />
                    ))}
                </div>

                <span className="mx-2 text-[0.8125rem] text-muted-foreground tabular-nums sm:hidden">
                    {rsvps.current_page} / {rsvps.last_page}
                </span>

                <PaginationButton
                    href={rsvps.next_page_url}
                    label="Next"
                    icon="next"
                />
            </div>
        </div>
    );
}

function PaginationButton({
    href,
    label,
    icon,
}: {
    href: string | null;
    label: string;
    icon: 'prev' | 'next';
}) {
    const className = cn(
        'inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors',
        href
            ? 'hover:bg-muted hover:text-foreground'
            : 'cursor-not-allowed opacity-35',
    );

    if (!href) {
        return (
            <span className={className} aria-disabled="true">
                {icon === 'prev' ? (
                    <ChevronLeft className="size-4" />
                ) : (
                    <ChevronRight className="size-4" />
                )}
                <span className="sr-only">{label}</span>
            </span>
        );
    }

    return (
        <Link
            href={href}
            preserveScroll
            className={className}
            aria-label={label}
        >
            {icon === 'prev' ? (
                <ChevronLeft className="size-4" />
            ) : (
                <ChevronRight className="size-4" />
            )}
        </Link>
    );
}

function PaginationPage({ link }: { link: PaginationLink }) {
    const className = cn(
        'inline-flex size-9 items-center justify-center rounded-lg text-[0.8125rem] font-medium tabular-nums transition-colors',
        link.active
            ? 'bg-foreground text-background'
            : link.url
              ? 'text-muted-foreground hover:bg-muted hover:text-foreground'
              : 'cursor-default text-muted-foreground/50',
    );

    if (!link.url) {
        return <span className={className}>{link.label}</span>;
    }

    return (
        <Link
            href={link.url}
            preserveScroll
            className={className}
            aria-current={link.active ? 'page' : undefined}
        >
            {link.label}
        </Link>
    );
}

function RsvpMobileList({ rsvps }: { rsvps: RsvpEntry[] }) {
    return (
        <ul className="divide-y divide-border/50 md:hidden">
            {rsvps.map((rsvp) => (
                <li key={rsvp.id} className="px-4 py-4">
                    <div className="flex items-start gap-3.5">
                        <GuestAvatar name={rsvp.name} />
                        <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="truncate text-[0.9375rem] font-medium tracking-tight text-foreground">
                                        {rsvp.name}
                                    </p>
                                    <p className="mt-0.5 truncate text-[0.8125rem] text-muted-foreground">
                                        {rsvp.email}
                                    </p>
                                </div>
                                <time
                                    dateTime={rsvp.created_at ?? undefined}
                                    className="shrink-0 pt-0.5 text-[0.75rem] text-muted-foreground tabular-nums"
                                >
                                    {formatDate(rsvp.created_at)}
                                </time>
                            </div>

                            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                                <StatusBadge attending={rsvp.attending} />
                            </div>

                            <div className="mt-3">
                                <PartyDetails party={rsvp.party} />
                            </div>

                            {rsvp.message && (
                                <p className="mt-3 text-[0.875rem] leading-relaxed text-foreground/80">
                                    {rsvp.message}
                                </p>
                            )}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

function RsvpDesktopTable({ rsvps }: { rsvps: RsvpEntry[] }) {
    return (
        <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="border-b border-border/60 bg-muted/40">
                        <th className="px-6 py-3.5 text-[0.6875rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                            Guest
                        </th>
                        <th className="px-6 py-3.5 text-[0.6875rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                            Status
                        </th>
                        <th className="px-6 py-3.5 text-[0.6875rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                            Party
                        </th>
                        <th className="px-6 py-3.5 text-[0.6875rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                            Message
                        </th>
                        <th className="px-6 py-3.5 text-right text-[0.6875rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                            Received
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rsvps.map((rsvp) => (
                        <tr
                            key={rsvp.id}
                            className="border-b border-border/50 transition-colors last:border-b-0 hover:bg-muted/30"
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3.5">
                                    <GuestAvatar name={rsvp.name} />
                                    <div className="min-w-0">
                                        <p className="truncate text-[0.9375rem] font-medium tracking-tight text-foreground">
                                            {rsvp.name}
                                        </p>
                                        <p className="mt-0.5 truncate text-[0.8125rem] text-muted-foreground">
                                            {rsvp.email}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge attending={rsvp.attending} />
                            </td>
                            <td className="max-w-xs px-6 py-4">
                                <PartyDetails party={rsvp.party} />
                            </td>
                            <td className="max-w-md px-6 py-4">
                                {rsvp.message ? (
                                    <p className="line-clamp-2 text-[0.875rem] leading-relaxed text-foreground/80">
                                        {rsvp.message}
                                    </p>
                                ) : (
                                    <span className="text-[0.8125rem] text-muted-foreground/60">
                                        —
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                <time
                                    dateTime={rsvp.created_at ?? undefined}
                                    className="text-[0.8125rem] text-muted-foreground tabular-nums"
                                >
                                    {formatDate(rsvp.created_at)}
                                </time>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function Dashboard({ stats, rsvps }: Props) {
    const entries = rsvps.data;

    return (
        <>
            <Head title="RSVPs" />

            <div className="w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <header className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-[1.75rem] font-semibold tracking-tight text-foreground">
                            RSVPs
                        </h1>
                        <p className="mt-1 text-[0.9375rem] text-muted-foreground">
                            Responses from your invitation
                        </p>
                    </div>

                    <div className="flex gap-8 sm:gap-14">
                        <Stat label="Total" value={stats.total} />
                        <Stat
                            label="Attending"
                            value={stats.attending}
                            accent="attending"
                        />
                        <Stat
                            label="Declined"
                            value={stats.declined}
                            accent="declined"
                        />
                    </div>
                </header>

                <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                    {entries.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            <RsvpMobileList rsvps={entries} />
                            <RsvpDesktopTable rsvps={entries} />
                            <Pagination rsvps={rsvps} />
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'RSVPs',
            href: dashboard(),
        },
    ],
};
