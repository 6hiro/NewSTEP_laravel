<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Roadmap;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\UserResource;
use App\Http\Resources\RoadmapResource;
use Illuminate\Support\Facades\Auth;

class RoadmapController extends Controller
{
    public function show(Request $request, string $id){
        // 個別のデータ
        $user_id = $request->user()->id;
        $roadmaps = Roadmap::with(['user'])
        ->whereHas('user', function($q) use ($user_id){
            $q->where('user_id', $user_id)
            ->orWhere('is_public', true);
        })
        ->find($id);
        return response()->json([
            'roamap'=>new RoadmapResource($roadmaps),
        ]);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'title'=>'required|max:60',
            'overview'=>'required|max:250',
            'is_public'=>'required|boolean',
        ]);

        if($validator->fails())
        {
            return response()->json([
                'status'=>419,
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $roadmap = new Roadmap;
            $roadmap->title = $request->title;
            $roadmap->overview = $request->overview;
            $roadmap->is_public = $request->is_public;
            $roadmap->user_id = $request->user()->id;
            $roadmap->save();

            return $roadmap
            ? response()->json([
                'roadmap'=>$roadmap,
            ], 201)
            : response()->json([], 500);
        }
    }
    public function update(Request $request, Roadmap $roadmap)
    {
        // is_publicだけ変更できる
        if($request->user()->id !== $roadmap->user_id)
        {
            return response()->json([], 401);
        }
        else
        {
            $roadmap->title = $request->title;
            $roadmap->overview = $request->overview;
            $roadmap->is_public = $request->is_public;
            $roadmap->save();
    
            return $roadmap
                ? response()->json(['roadmap' => new RoadmapResource($roadmap)])
                : response()->json([], 500);
        }

    }
    public function destroy(Request $request, Roadmap $roadmap)
    {
        if($request->user()->id !== $roadmap->user_id)
        {
            return response()->json([], 401);
        }
        else
        {
            return $roadmap->delete()
                ? response()->json($roadmap)
                : response()->json([], 500);
        }     
    }
    public function savedRoadmaps(Request $request, User $user)
    {
        $since = $request->since;
        $per_page = 10;
        $user_id = $request->user()->id;

        if($request->since){
            $roadmaps = $user->saves()
                ->with(['user'])
                ->whereHas('saves', function($q) use ($user_id, $since){
                    $q->where('saves.user_id', $user_id)
                    ->Where('saves.created_at', '<', $since)
                    ->orWhere('is_public', true);
                })
                ->take($per_page+1)
                ->get();

        }else{
            $roadmaps = $user->saves()
                ->with(['user'])
                // ->whereHas('saves', function($q) use ($user_id){
                //     $q->where('user_id', $user_id)          
                //     ->orWhere('is_public', true);
                // })
                ->orWhere('is_public', true)
                // ->orderByDesc('created_at')
                ->take($per_page+1)
                ->get();

                $roadmaps = $user->saves()
                    ->Where('is_public', true)
                    ->with(['user'])
                    ->withPivot(['created_at'])
                    ->orderBy('pivot_created_at', 'desc')
                    ->take($per_page+1)
                    ->get();
            }
        return [
            'A'=> $user->saves,
            'next_page_link'=>$roadmaps->count()>$per_page 
                ? $request->url()."?since=".$roadmaps[count($roadmaps)-2]["created_at"] : null,
            'data' => RoadmapResource::collection($roadmaps->take($per_page)),
        ];

    }
    public function saveUnsave(Request $request, Roadmap $roadmap)
    {
        if($roadmap->isSavedBy(Auth::user()))
        {
            $roadmap->saves()->detach($request->user()->id);
            return [
                'id' => $roadmap->id,
                'count_saves' => $roadmap->count_saves-1,
                'result' => 'unsave'
            ];
        }
        else
        {
            $roadmap->saves()->detach($request->user()->id);
            $roadmap->saves()->attach($request->user()->id);
            return [
                'id' => $roadmap->id,
                'count_saves' => $roadmap->count_saves+1,
                'result' => 'save'
            ];
        }

    }
    public function searchRoadmaps(Request $request, string $word)
    {
        $since = $request->since;
        $per_page = 10;
        $user_id = $request->user()->id;

        $roadmaps = Roadmap::with(['user'])
            ->whereHas('user', function($q) use ($user_id){
                $q->where('user_id', $user_id)
                ->orWhere('is_public', true);
            })
            ->where('title', 'like', "%{$word}%")
            ->orWhere('overview', 'like', "%{$word}%")
            ->withCount('saves')
            ->orderBy('saves_count', 'desc')
            ->orderByDesc('created_at')
            ->paginate(30);

        return RoadmapResource::collection($roadmaps);
    }
    public function searchLatestRoadmaps(Request $request, string $word)
    {
        $user_id = $request->user()->id;
        $per_page = 10;
        $since = $request->since;

        if($request->since){
            $roadmaps = Roadmap::with(['user'])
                ->whereHas('user', function($q) use ($user_id){
                    $q->where('user_id', $user_id)
                    ->orWhere('is_public', true);
                })
                ->where('created_at', '<', $since)
                ->where('title', 'like', "%{$word}%")
                ->orWhere('overview', 'like', "%{$word}%")
                // ->latest('created_at')
                ->orderByDesc('created_at')
                ->take($per_page+1)
                ->get();
        }
        else{
            $roadmaps = Roadmap::with(['user'])
                ->whereHas('user', function($q) use ($user_id){
                    $q->where('user_id', $user_id)
                    ->orWhere('is_public', true);
                })
                ->where('title', 'like', "%{$word}%")
                ->orWhere('overview', 'like', "%{$word}%")
                ->orderByDesc('created_at')
                ->take($per_page+1)
                ->get();
        }

        return [
            'next_page_link'=>$roadmaps->count() > $per_page 
                ? $request->url()."?since=".$roadmaps[count($roadmaps)-2]["created_at"] : null,
            'data' => RoadmapResource::collection($roadmaps->take($per_page)),
        ];
    }
    public function followingsRoadmap(Request $request)
    {
        $user_id = $request->user()->id;
        $per_page = 10;
        $since = $request->since;
        if($request->since){
            $roadmaps = Roadmap::with(['user'])
                ->whereIn('user_id', Auth::user()->followings()->pluck('followee_id'))
                ->Where('is_public', true)
                ->where('created_at', '<', $since)
                ->orderByDesc('created_at')
                ->take($per_page+1)
                ->get();
        }
        else
        {
            $roadmaps = Roadmap::with(['user'])
                ->whereIn('user_id', Auth::user()->followings()->pluck('followee_id'))
                ->Where('is_public', true)
                ->orderByDesc('created_at')
                ->take($per_page+1)
                ->get();
        }

        return [
            'next_page_link'=>$roadmaps->count()>$per_page 
                ? $request->url()."?since=".$roadmaps[count($roadmaps)-2]["created_at"] : null,
            'data' => RoadmapResource::collection($roadmaps->take($per_page)),
        ];
    }
}
