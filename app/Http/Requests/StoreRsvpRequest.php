<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreRsvpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'attending' => ['required', 'boolean'],
            'party' => ['required', 'array'],
            'party.size' => ['required', 'integer', 'min:0', 'max:5'],
            'party.names' => ['present', 'array', 'max:5'],
            'party.names.*' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'attending.required' => 'Please let us know if you will attend.',
            'party.size.required' => 'Please tell us how many additional guests are coming.',
            'party.names.*.required' => 'Please enter a name for each additional guest.',
            'message.required' => 'Please leave a short message for the couple.',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $size = (int) $this->input('party.size');
            $names = $this->input('party.names');

            if (! is_array($names)) {
                return;
            }

            $filledNames = array_values(array_filter(
                $names,
                fn (mixed $name): bool => is_string($name) && filled(trim($name)),
            ));

            if (count($filledNames) !== $size) {
                $validator->errors()->add(
                    'party.names',
                    $size === 0
                        ? 'Additional guest names should be empty when party size is 0.'
                        : 'Please provide a name for each additional guest.',
                );
            }
        });
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('attending')) {
            $this->merge([
                'attending' => filter_var(
                    $this->input('attending'),
                    FILTER_VALIDATE_BOOLEAN,
                    FILTER_NULL_ON_FAILURE,
                ),
            ]);
        }

        if ($this->boolean('attending') === false) {
            $this->merge([
                'party' => [
                    'size' => 0,
                    'names' => [],
                ],
            ]);

            return;
        }

        $party = $this->input('party', []);
        $size = isset($party['size']) ? (int) $party['size'] : null;
        $names = is_array($party['names'] ?? null) ? array_values($party['names']) : [];

        if ($size === null) {
            return;
        }

        if ($size === 0) {
            $this->merge([
                'party' => [
                    'size' => 0,
                    'names' => [],
                ],
            ]);

            return;
        }

        $names = array_slice(array_pad($names, $size, ''), 0, $size);

        $this->merge([
            'party' => [
                'size' => $size,
                'names' => array_map(
                    fn (mixed $name): string => trim((string) $name),
                    $names,
                ),
            ],
        ]);
    }
}
