<?php

use App\Models\Rsvp;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('dashboard shows rsvp entries and stats', function () {
    $user = User::factory()->create();

    Rsvp::create([
        'name' => 'Alex Rivera',
        'email' => 'alex@example.com',
        'attending' => true,
        'party' => [
            'size' => 1,
            'names' => ['Sam Rivera'],
        ],
        'message' => 'Looking forward to it!',
    ]);

    Rsvp::create([
        'name' => 'Jordan Lee',
        'email' => 'jordan@example.com',
        'attending' => false,
        'party' => [
            'size' => 0,
            'names' => [],
        ],
        'message' => null,
    ]);

    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->where('stats.total', 2)
        ->where('stats.attending', 1)
        ->where('stats.declined', 1)
        ->has('rsvps.data', 2)
        ->where('rsvps.data.0.name', 'Jordan Lee')
        ->where('rsvps.data.1.name', 'Alex Rivera')
        ->where('rsvps.per_page', 10)
        ->where('rsvps.current_page', 1)
    );
});

test('dashboard paginates rsvps ten per page', function () {
    $user = User::factory()->create();

    foreach (range(1, 12) as $index) {
        Rsvp::create([
            'name' => "Guest {$index}",
            'email' => "guest{$index}@example.com",
            'attending' => $index % 2 === 0,
            'party' => [
                'size' => 0,
                'names' => [],
            ],
            'message' => null,
        ]);
    }

    $this->actingAs($user);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('rsvps.data', 10)
            ->where('rsvps.total', 12)
            ->where('rsvps.last_page', 2)
            ->where('stats.total', 12)
        );

    $this->get(route('dashboard', ['page' => 2]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('rsvps.data', 2)
            ->where('rsvps.current_page', 2)
        );
});

test('authenticated users can bulk delete rsvps', function () {
    $user = User::factory()->create();

    $keep = Rsvp::create([
        'name' => 'Keep Me',
        'email' => 'keep@example.com',
        'attending' => true,
        'party' => ['size' => 0, 'names' => []],
        'message' => 'Still coming',
    ]);

    $remove = Rsvp::create([
        'name' => 'Remove Me',
        'email' => 'remove@example.com',
        'attending' => false,
        'party' => ['size' => 0, 'names' => []],
        'message' => 'Bye',
    ]);

    $this->actingAs($user);

    $this->delete(route('rsvps.destroy'), [
        'ids' => [$remove->id],
    ])->assertRedirect();

    expect(Rsvp::query()->whereKey($remove->id)->exists())->toBeFalse();
    expect(Rsvp::query()->whereKey($keep->id)->exists())->toBeTrue();
});
