<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class RoadmapResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {

        // return parent::toArray($request);
        return [
            'id' => $this->id,
            'title' => $this->title,
            'overview' => $this->overview,
            'is_public' => $this->is_public,
            'created_at' => $this->created_at->format('Y/m/d'),
            // 'created' => $this->created_at,
            'updated_at' => $this->updated_at->format('Y/m/d'),

            // '_embedded' => [
                // whenLoadedは ::with()など でリレーションが既にロードされている場合にのみ、
                // リソースレスポンスへリレーションを含める。
                'count_saves' => $this->count_saves,
                // 'savedAt' => $this->savedAt(Auth::user()),
                'is_saved' => $this->isSavedBy(Auth::user()),
                'user' => new UserResource($this->whenLoaded('user')),
                'steps'=> StepResource::collection(
                    // $this->whenloaded('steps')
                    // https://github.com/laravel/framework/issues/27950
                    $this->whenLoaded('steps', function () {
                        return $this->steps->sortBy('order');
                        // ->keyBy('order');
                    })
                ),

            // ]
        ];
    }
}
