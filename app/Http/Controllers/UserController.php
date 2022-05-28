<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Roadmap;
use App\Models\Post;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Http\Resources\RoadmapResource;
use App\Http\Resources\PostResource;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class UserController extends Controller
{
    public function show(string $id)
    {
        $user = User::where('id', $id)->first();
        return new UserResource($user);
    }
    public function userRoadmaps(Request $request, string $id)
    {
        $since = $request->since;
        $per_page = 10;

        if($since){
            if($request->user()->id===$id)
            {   
                $roadmaps = Roadmap::with('user')
                    ->whereHas('user', function($q) use ($id){
                        $q->where('user_id', $id);
                    })
                    ->where('created_at', '<', $since)
                    ->latest('created_at')
                    ->take($per_page+1)
                    ->get();
            }
            else
            {
                $roadmaps = Roadmap::with('user')
                    ->whereHas('user', function($q) use ($id){
                        $q->where('user_id', $id);
                    })
                    ->where('is_public', true)
                    ->where('created_at', '<', $since)
                    ->latest('created_at')
                    ->take($per_page+1)
                    ->get();
            }
        }
        else
        {
            if($request->user()->id===$id)  
            {
                $roadmaps = Roadmap::with('user')
                ->whereHas('user', function($q) use ($id){
                    $q->where('user_id', $id);
                })
                ->orderByDesc('created_at')
                ->take($per_page+1)
                ->get();
            }
            else
            {
                $roadmaps = Roadmap::with('user')
                ->whereHas('user', function($q) use ($id){
                    $q->where('user_id', $id);
                })
                ->where('is_public', true)
                ->orderByDesc('created_at')
                ->take($per_page+1)
                ->get();
            }
        }
        return [
            'next_page_link'=>$roadmaps->count()>$per_page 
                ? $request->url()."?since=".$roadmaps[count($roadmaps)-2]["created_at"]->format('Y-m-d H:i:s.v') : null,
            'data' => RoadmapResource::collection($roadmaps->take($per_page)),
        ];
    }
    public function userPosts(Request $request, string $id)
    {
        $since = $request->since;
        $per_page = 10;
        if($request->since){
            $posts = Post::with(['tags', 'user'])
                ->whereHas('user', function($q) use ($id){
                    $q->where('user_id', $id);
                })
                ->where('created_at', '<', $since)
                ->latest('created_at')
                ->take($per_page+1)
                ->get();
        }else{
            $posts = Post::with(['tags', 'user'])
                ->whereHas('user', function($q) use ($id){
                    $q->where('user_id', $id);
                })
                ->orderByDesc('created_at')
                ->take($per_page+1)
                ->get();
        }
        
        return [
            'next_page_link' => $posts->count() > $per_page 
                ? $request->url()."?since=".$posts[count($posts)-2]["created_at"]->format('Y-m-d H:i:s.v')
                : null,
            'data' => PostResource::collection($posts->take($per_page)),
        ];
    }    
    public function likesUsers(string $id)
    {
        $post = Post::where('id', $id)->first();
        $likes = $post->likes->sortByDesc('created_at');
        return UserResource::collection($likes);
    }
    
    public function followings(string $id)
    {
        $user = User::where('id', $id)->first();

        $followings = $user->followings->sortByDesc('created_at');
        return UserResource::collection($followings);
    }
    
    public function followers(string $id)
    {
        $user = User::where('id', $id)->first();

        $followers = $user->followers->sortByDesc('created_at');
        return UserResource::collection($followers);
    }
    public function followUnfollow(Request $request, string $id)
    {
        $user = User::where('id', $id)->first();
        if ($user->id === $request->user()->id)
        {
            return abort('404', 'Cannot follow yourself.');
        }
        if($user->isFollowedBy(Auth::user()))
        {
            $request->user()->followings()->detach($user);
            return [
                'count_followers' => $user->count_followers-1,
                'result' => 'unfollow'
            ];
        }
        else
        {
            $request->user()->followings()->detach($user);
            $request->user()->followings()->attach($user);
            return [
                'count_followers' => $user->count_followers+1,
                'result' => 'follow'
            ];
        }
    }
}
