<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRsvpRequest;
use App\Models\Rsvp;
use Illuminate\Http\RedirectResponse;

class RsvpController extends Controller
{
    public function store(StoreRsvpRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Rsvp::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'attending' => $validated['attending'],
            'party' => [
                'size' => (int) $validated['party']['size'],
                'names' => array_values($validated['party']['names']),
            ],
            'message' => $validated['message'] ?? null,
        ]);

        return back();
    }
}
