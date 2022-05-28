<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use GoldSpecDigital\LaravelEloquentUUID\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\hasOneThrough;

class Step extends Model
{
    use HasFactory;

    public function getDateFormat()
    {
        return 'Y-m-d H:i:s.v';
    }

    public function roadmap(): BelongsTo
    {
        return $this->belongsTo('App\Models\Roadmap');
    }
    // public function user(): hasOneThrough
    // {
    //     return $this->hasOneThrough('App\Models\User', 'App\Models\Roadmap');
    // }
}
