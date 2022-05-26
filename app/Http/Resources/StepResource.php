<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StepResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * @var bool
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    // public $preserveKeys = true;

    public function toArray($request)
    {
        // return parent::toArray($request);

        return [
            'id' => $this->id,
            'content' => $this->content,
            'state' => $this->state,
            'order' => $this->order,
            'memo' => $this->memo,

            // 'created_at' => $this->created_at->format('Y/m/d'),
            // 'updated_at' => $this->updated_at->format('Y/m/d'),

            // '_embedded' => [
                // whenLoadedは ::with()など でリレーションが既にロードされている場合にのみ、
                // リソースレスポンスへリレーションを含める。
                'roadmap' => new RoadmapResource($this->whenLoaded('roadmap')),

            // ]
        ];
    }
}
