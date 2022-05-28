<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use GoldSpecDigital\LaravelEloquentUUID\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    use HasFactory;

    public function getDateFormat()
    {
        return 'Y-m-d H:i:s.v';
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo('App\Models\User');
    }
    public function post(): BelongsTo
    {
        return $this->belongsTo('App\Models\Post');
    }
}
