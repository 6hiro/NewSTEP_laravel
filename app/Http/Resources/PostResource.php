<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public static $wrap = '';

    public function toArray($request)
    {
        // return parent::toArray($request);
        return [
            'id' => $this->id,
            'content' => $this->content,
            'created_at' => $this->created_at->format('Y/m/d H:i'),
            // 'a' => $this->created_at->format('Y-m-d H:i:s.v'),

            // '_embedded' => [
                // whenLoadedは ::with()など でリレーションが既にロードされている場合にのみ、
                // リソースレスポンスへリレーションを含める。
                'user' => new UserResource($this->whenLoaded('user')),
                'count_likes' => $this->count_likes,
                'is_liked' => $this->isLikedBy(Auth::user()),
                // 'LikedAt' => $this->LikedAt(Auth::user()),
                'tags' => TagResource::collection($this->whenLoaded('tags')),
                'comments'=> CommentResource::collection(
                    // https://github.com/laravel/framework/issues/27950
                    $this->whenLoaded('comments', function () {
                        return $this->comments->sortBy('created_at');
                    })
                ),
                'count_comments' => $this->count_comments,    
                'is_shared' => $this->parent_id ? true : false,
                // 'parent' => $this->parent,
                'parent' => new ParentPostResource($this->parent),


            // ]
        ];
    }
}
