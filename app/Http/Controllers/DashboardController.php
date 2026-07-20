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
        $stats = [
            'total' => Rsvp::query()->count(),
            'attending' => Rsvp::query()->where('attending', true)->count(),
            'declined' => Rsvp::query()->where('attending', false)->count(),
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
