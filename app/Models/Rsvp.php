<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rsvp extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'attending',
        'party',
        'message',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'attending' => 'boolean',
            'party' => 'array',
        ];
    }

    /**
     * People represented by this RSVP, including additional guests.
     */
    public function headcount(): int
    {
        if (! $this->attending) {
            return 1;
        }

        $additional = (int) data_get($this->party, 'size', 0);

        return 1 + max(0, $additional);
    }
}
