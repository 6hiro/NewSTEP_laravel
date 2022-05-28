<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use GoldSpecDigital\LaravelEloquentUUID\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'content', 'is_public'
    ];
    // カラムの型を指定
    // protected $casts = [
    // ];
    public function getDateFormat()
    {
        return 'Y-m-d H:i:s.v';
    }
    
    public function user(): BelongsTo
    {
        return $this->belongsTo('App\Models\User');
    }
    public function parent(): BelongsTo
    {
        return $this->belongsTo('App\Models\Post', 'parent_id');
    }
    public function children(): HasMany
    {
        return $this->hasMany('App\Models\Post', 'parent_id');
    }
    public function likes(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\User', 'likes')->withTimestamps();
    }
    public function isLikedBy(?User $user): bool
    {
        return $user
            ? (bool)$this->likes->where('id', $user->id)->count()
            : false;
    }
    public function LikedAt(?User $user): string | null
    {        
        return $this->isLikedBy($user) 
            ? $this->likes->where('id', $user->id)->first()->pivot['created_at'] 
            : null;

    }
    public function getCountLikesAttribute(): int
    {
        return $this->likes->count();
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\Tag', 'post_tag')->withTimestamps();
    }

    public function comments(): HasMany
    // Postと、そのPostのCommentは1対多の関係
    {
        return $this->hasMany('App\Models\Comment')->orderBy('created_at', 'desc');
    }
    public function getCountCommentsAttribute(): int
    // このメソッドを使う時は、$post->count_comments
    {
        return $this->comments->count();
    }
}
