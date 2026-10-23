<?php

namespace App\Http\Controllers;

use App\Models\Rsvp;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    private const PER_PAGE = 10;

    public function __invoke(): Response
    {
        $responses = Rsvp::query()->get(['attending', 'party']);

        $attending = (int) $responses
            ->filter(fn (Rsvp $rsvp): bool => $rsvp->attending)
            ->sum(fn (Rsvp $rsvp): int => $rsvp->headcount());

        $declined = (int) $responses
            ->reject(fn (Rsvp $rsvp): bool => $rsvp->attending)
            ->sum(fn (Rsvp $rsvp): int => $rsvp->headcount());

        $stats = [
            'total' => $attending + $declined,
            'attending' => $attending,
            'declined' => $declined,
        ];

        $rsvps = Rsvp::query()
            ->latest()
            ->paginate(self::PER_PAGE)
            ->withQueryString()
            ->through(fn (Rsvp $rsvp): array => [
                'id' => $rsvp->id,
                'name' => $rsvp->name,
                'email' => $rsvp->email,
                'attending' => $rsvp->attending,
                'party' => $rsvp->party,
                'message' => $rsvp->message,
                'created_at' => $rsvp->created_at?->toIso8601String(),
            ]);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'rsvps' => $rsvps,
        ]);
    }
}
