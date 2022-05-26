<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class ParentPostResource extends JsonResource
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
            // 'is_public' => $this->is_public,
            'created_at' => $this->created_at->format('Y/m/d H:i'),
            // '_embedded' => [
                // whenLoadedは ::with()など でリレーションが既にロードされている場合にのみ、
                // リソースレスポンスへリレーションを含める。
                'user' => new UserResource($this->user),
                'count_likes' => $this->count_likes,
                'is_liked' => $this->isLikedBy(Auth::user()),
                'tags' => TagResource::collection($this->tags),
                'comments'=> CommentResource::collection(
                    // https://github.com/laravel/framework/issues/27950
                    $this->whenLoaded('comments', function () {
                        return $this->comments->sortBy('created_at');
                    })
                ),
                // 'is_shared' => $this->parent_id,
                'is_shared' => $this->parent_id ? true : false,
                'count_comments' => $this->count_comments,    
                'parent' => $this->parent,    

            // ]
        ];
    }
}
