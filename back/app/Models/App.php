<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class App extends Model
{
    protected $fillable = [
        'candidate_id',
        'offer_id',
        'cv',
        'letter',
        'status',
    ];

    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }
    
    public function offer()
    {
        return $this->belongsTo(Offer::class);
    }
}
