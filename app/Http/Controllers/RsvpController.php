<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRsvpRequest;
use App\Models\Rsvp;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class RsvpController extends Controller
{
    public function store(StoreRsvpRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Rsvp::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'attending' => $validated['attending'],
            'message' => $validated['message'] ?? null,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Thank you! Your RSVP has been received.',
        ]);

        return back();
    }
}
