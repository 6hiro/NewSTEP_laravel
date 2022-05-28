<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Post;
use App\Models\Tag;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\UserResource;
use App\Http\Resources\PostResource;
use App\Http\Resources\TagResource;
use App\Http\Resources\CommentResource;
use Illuminate\Support\Facades\Auth;

use Illuminate\Database\Eloquent\Builder;

class PostController extends Controller
{
    public function show(Request $request, string $id){
        // 個別のデータ Commentも一緒に
        $user_id = $request->user()->id;
        $post = Post::with(['tags', 'user', 'comments', 'comments.user'])
        ->find($id);
        return response()->json([
            'post'=>new PostResource($post),
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'content'=>'required|max:250',
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
            $post = new Post;
            $post->content = $request->content;
            $post->user_id = $request->user()->id;
            $post->save();

            //　contentを空白で分割し、リスト化
            $sentence_list = preg_split('/[\p{Z}\p{Cc}]++/u', $request->content, -1, PREG_SPLIT_NO_EMPTY);

            foreach ($sentence_list as $sentence) {
                // 1文字目が「#」であれば、以下の処理をする。
                // substr($tagName, 1) は、「#」より後の文字列
                if (substr($sentence, 0, 1) === "#") {
                    // firstOrCreateメソッドで、既にtagがテーブルに存在していれば、そのモデルを返し、
                    // テーブルに存在しなければ、そのレコードをテーブルに保存した上で、モデルを返す。
                    $tag = Tag::firstOrCreate(['name' => substr($sentence, 1)]);
                    $post->tags()->attach($tag);
                }
            }

            return $post
            ? response()->json([
                'post'=>$post,
                'tags'=>$post->tags
            ], 201)
            : response()->json([], 500);
        }
    }
    public function destroy(Request $request, Post $post)
    {
        if($request->user()->id !== $post->user_id)
        {
            return response()->json([], 401);
        }
        else
        {
            return $post->delete()
                ? response()->json($post)
                : response()->json([], 500);
        }     
    }
    public function hashtag(Request $request, string $name)
    {
        $user_id = $request->user()->id;
        $posts = Post::with(['tags', 'user'])
            ->whereHas('tags', function($query) use ($name)  {
                $query->where('name', $name);
            })
            ->withCount('likes')
            ->orderBy('likes_count', 'desc')
            ->orderByDesc('created_at')
            ->paginate(30);
    
        return PostResource::collection($posts);
    }
    public function hashtagLatest(Request $request, string $name)
    {
        $since = $request->since;
        $per_page = 10;

        if($request->since){
            $posts = Post::with(['tags', 'user'])
                ->whereHas('tags', function($query) use ($name)  {
                    $query->where('name', $name);
                })
                ->orderByDesc('created_at')
                ->where('created_at', '<', $since)
                ->latest('created_at')
                ->take($per_page+1)
                ->get();
        }else{
            $posts = Post::with(['tags', 'user'])
                ->whereHas('tags', function($query) use ($name)  {
                    $query->where('name', $name);
                })
                ->orderByDesc('created_at')
                ->take($per_page+1)
                ->get();
        }
        return [
            'next_page_link'=>$posts->count()>$per_page 
                ? $request->url()."?since=".$posts[count($posts)-2]["created_at"]->format('Y-m-d H:i:s.v') : null,
            'data' => PostResource::collection($posts->take($per_page)),
        ];
    }
    public function likedPosts(Request $request, string $id)
    {
        $since = $request->since;
        $per_page = 10;
        $user = User::where('id', $id)->first();
        if($request->since){
            $posts = $user->likes()
                ->where('likes.created_at',  '<', $since)
                ->with(['tags', 'user'])
                ->take($per_page+1)
                ->get();
        }else{
            $posts = $user->likes()->with(['tags', 'user'])
                ->take($per_page+1)
                ->get();
        }
        return [
            'next_page_link' => $posts->count()>$per_page
                ? $request->url()."?since=".$posts[count($posts)-2]["pivot"]["created_at"]->format('Y-m-d H:i:s.v') : null,
            'data' => PostResource::collection($posts->take($per_page)),
        ];
    }
    public function followingsPost(Request $request)
    {
        $since = $request->since;
        $per_page = 10;

        if($request->since){
            $posts = Post::with(['tags', 'user'])
                ->whereIn('user_id', Auth::user()->followings()->pluck('followee_id'))
                ->orderByDesc('created_at')
                ->where('created_at', '<', $since)
                ->latest('created_at')
                ->take($per_page+1)
                ->get();
        }else{
            $posts = Post::with(['tags', 'user'])
                ->whereIn('user_id', Auth::user()->followings()->pluck('followee_id'))
                ->orderByDesc('created_at')
                ->take($per_page+1)
                ->get();
            // ->paginate(10);
        }
        return [
            'next_page_link'=>$posts->count()>$per_page
                ? $request->url()."?since=".$posts[count($posts)-2]["created_at"]->format('Y-m-d H:i:s.v') : null,
            'data' => PostResource::collection($posts->take($per_page)),
        ];
    }
    public function likeUnlike(Request $request, Post $post)
    {
        if($post->isLikedBy(Auth::user()))
        {
            $post->likes()->detach($request->user()->id);
            return [
                'id' => $post->id,
                'count_likes' => $post->count_likes-1,
                'result' => 'unlike'
            ];
        }
        else
        {
            $post->likes()->detach($request->user()->id);
            $post->likes()->attach($request->user()->id);
            return [
                'id' => $post->id,
                'count_likes' => $post->count_likes+1,
                'result' => 'like'
            ];
        }

    }
    public function sharePost(Request $request, string $id)
    {
        $post = new Post;
        $post->parent_id = $id;
        $post->user_id = $request->user()->id;
        $post->save();

        return $post
        ? response()->json([
            'post'=>$post,
            'tags'=>$post->tags
        ], 201)
        : response()->json([], 500);
    }
    public function unsharePost(Request $request, Post $post)
    {
        if($request->user()->id !== $post->user_id)
        {
            return response()->json([], 401);
        }
        else
        {
            return $post->delete()
                ? response()->json($post)
                : response()->json([], 500);
        }  
    }
    public function searchPosts(Request $request, string $word)
    {
        $posts = Post::where('content', 'like', "%{$word}%")
            ->with(['tags', 'user'])
            ->withCount('likes')
            ->orderBy('likes_count', 'desc')
            ->orderByDesc('created_at')
            ->paginate(30);
        return PostResource::collection($posts);
    }
    public function searchLatestPosts(Request $request, string $word)
    {
        $since = $request->since;
        $per_page = 10;

        if($request->since){
            $posts = Post::where('content', 'like', "%{$word}%")
                ->with(['tags', 'user'])
                ->where('created_at', '<', $since)
                ->latest('created_at')
                ->take($per_page+1)
                ->get();
        }else{
            $posts = Post::where('content', 'like', "%{$word}%")
                ->with(['tags', 'user'])
                ->orderByDesc('created_at')
                ->take($per_page+1)
                ->get();
        }
        return [
            'next_page_link'=>$posts->count()>$per_page 
                ? $request->url()."?since=".$posts[count($posts)-2]["created_at"]->format('Y-m-d H:i:s.v') : null,
            'data' => PostResource::collection($posts->take($per_page)),
        ];
    }
    public function addComment(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'content'=>'required|max:250',
            'post_id'=>'required',
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
            $comment = new Comment;
            $comment->content = $request->content;
            $comment->user_id = $request->user()->id;
            $comment->post_id = $request->post_id;
            $comment->save();

            $comment_ = Comment::with(['user', 'post'])->find($comment->id);

            return $comment_
            ? response()->json([
                'comment'=>new CommentResource($comment_),
            ], 201)
            : response()->json([], 500);
        }
    }
    public function destroyComment(Request $request, Comment $comment)
    {
        if($request->user()->id !== $comment->user_id)
        {
            return response()->json([], 401);
        }
        else
        {
            return $comment->delete()
                ? response()->json($comment)
                : response()->json([], 500);
        }     
    }
}
