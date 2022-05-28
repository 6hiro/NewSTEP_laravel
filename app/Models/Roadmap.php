<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use GoldSpecDigital\LaravelEloquentUUID\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Roadmap extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'overview', 'is_public'
    ];

    public function getDateFormat()
    {
        return 'Y-m-d H:i:s.v';
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo('App\Models\User');
    }
    public function steps(): HasMany
    // ユーザーと、そのユーザーの投稿は1対多の関係
    {
        return $this->hasMany('App\Models\Step');
    }
    // belongsToManyメソッド
    public function saves(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\User', 'saves')
            ->withPivot(['created_at'])
            ->orderBy('pivot_created_at', 'desc')
            ->withTimestamps();
    }
    public function isSavedBy(?User $user): bool
    {
        return $user
            ? (bool)$this->saves->where('id', $user->id)->count()
            : false;
    }
    public function savedAt(?User $user): string | null
    {        
        return $this->isSavedBy($user) 
            ? $this->saves->where('id', $user->id)->first()->pivot['created_at'] 
            : null;

    }

    // // アクセサ(モデルに持たせるget...Attributeという形式の名前のメソッド)
    // public function getCountSavesAttribute(): int
    // // $post->count_likes で、このメソッドを使う（メソッドの呼び出し時に、()は不要）
    // {
    //     return $this->saves->count();
    // }
}
