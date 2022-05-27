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
    // use HasFactory;
    protected $fillable = [
        'title', 'overview', 'is_public'
    ];
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
            // 第１引数には関係するモデルのモデル名。
            // 第２引数は中間テーブルのテーブル名。
            // (第２引数を省略すると、中間テーブル名は2つのモデル名の単数形をアルファベット順に
            //  結合した名前であるという前提で処理される。)
            // post_userという中間テーブルが存在するという前提で処理される。
            return $this->belongsToMany('App\Models\User', 'saves')
                ->withPivot(['created_at'])
                ->orderBy('pivot_created_at', 'desc')
                ->withTimestamps();
        }
    
        // $post->isLikedBy(Auth::user())
        // ユーザーがログインしていなければAuth::user()の戻り値はnull
        // ?を付けると、その引数がnullであることも許容される。
        public function isSavedBy(?User $user): bool
        {
            return $user
            // (bool)とは、型キャストと呼ばれるPHPの機能
            // 変数の前に記述し、その変数をかっこ内に指定した型に変換
            // (bool)と記述することで変数を論理値(trueもしくはfalse)に変換
                ? (bool)$this->saves->where('id', $user->id)->count()
                : false;
        }
        public function savedAt(?User $user): string | null
        {        
            return $this->isSavedBy($user) 
                ? $this->saves->where('id', $user->id)->first()->pivot['created_at'] 
                : null;
    
        }
    
        // アクセサ(モデルに持たせるget...Attributeという形式の名前のメソッド)
        public function getCountSavesAttribute(): int
        // $post->count_likes で、このメソッドを使う（メソッドの呼び出し時に、()は不要）
        {
            return $this->saves->count();
        }
}
