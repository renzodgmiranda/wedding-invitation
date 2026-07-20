<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RsvpController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::post('/rsvp', [RsvpController::class, 'store'])->name('rsvp.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
});

require __DIR__.'/settings.php';
