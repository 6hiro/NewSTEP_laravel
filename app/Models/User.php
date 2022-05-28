<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Foundation\Auth\User as Authenticatable;
use GoldSpecDigital\LaravelEloquentUUID\Foundation\Auth\User as Authenticatable;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'nick_name'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function getDateFormat()
    {
        return 'Y-m-d H:i:s.v';
    }

    public function sendPasswordResetNotification($token)
    {

        $url = env('FRONTEND_URL') . '/auth/reset-password?token=' . $token;

        $this->notify(new ResetPasswordNotification($url));
    }

    public function roadmaps(): HasMany
    // ユーザーと、そのユーザーの投稿は1対多の関係
    {
        return $this->hasMany('App\Models\Roadmap');
    }
    // Step関係
    public function steps(): hasManyThrough
    {
        return $this->hasManyThrough('App\Models\Step', 'App\Models\Roadmap');
    }
    // Post関係
    public function posts(): HasMany
    // ユーザーと、そのユーザーの投稿は1対多の関係
    {
        return $this->hasMany('App\Models\Post');
    }
    public function comments(): HasMany
    {
        return $this->hasMany('App\Models\Comment');
    }
    public function likes(): BelongsToMany
    {
        return $this
            ->belongsToMany('App\Models\Post', 'likes')
            ->withPivot(['created_at'])
            ->orderBy('pivot_created_at', 'desc')
            ->withTimestamps();
    }
    public function saves(): BelongsToMany
    {
        return $this
            ->belongsToMany('App\Models\Roadmap', 'saves')
            ->withPivot(['created_at'])
            ->orderBy('pivot_created_at', 'desc')
            ->withTimestamps();
    }

    // Follow関係
    public function followers(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\User', 'follows', 'followee_id', 'follower_id')->withTimestamps();
    }
    public function followings(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\User', 'follows', 'follower_id', 'followee_id')->withTimestamps();
    }
    public function isFollowedBy(?User $user): bool
    {
        return $user
            ? (bool)$this->followers->where('id', $user->id)->count()
            : false;
    }
    public function getCountFollowersAttribute(): int
    // アクセサ（このメソッドを使う時は、$user->count_followers）
    {
        return $this->followers->count();
    }
    public function getCountFollowingsAttribute(): int
    // アクセサ（このメソッドを使う時は、$user->count_followings）
    {
        return $this->followings->count();
    }
    
}
