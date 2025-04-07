<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Offer extends Model
{
    protected $fillable = [
        'title',
        'description',
        'location',
        'requirements',
        'recruiter_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recruiter_id');
    }
}
