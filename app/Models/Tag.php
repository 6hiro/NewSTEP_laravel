<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use GoldSpecDigital\LaravelEloquentUUID\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use HasFactory;

    public function getDateFormat()
    {
        return 'Y-m-d H:i:s.v';
    }
    // PostControllerのstoreメソッド内のfirstOrCreateを使うときに必要
    protected $fillable = [
        'name'
    ];
    
    public function posts(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\Post')->withTimestamps();        
    }
}
