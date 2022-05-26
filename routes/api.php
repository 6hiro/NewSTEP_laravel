<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoadmapController;
use App\Http\Controllers\StepController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\NewPasswordController;

use App\Http\Resources\UserResource;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware(['verified'])->group(function(){
//     // メール
// });
Route::post('forgot-password', [NewPasswordController::class, 'forgotPassword']);
Route::post('reset-password', [NewPasswordController::class, 'reset']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('email/verify/{id}', [VerificationController::class, 'verify'])->name('verification.verify'); 
// Make sure to keep this as your route name
Route::get('email/resend', [VerificationController::class, 'resend'])->name('verification.resend');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout']);

Route::middleware(['auth:sanctum', 'verified'])->get('/user', function (Request $request) {
    return new UserResource($request->user());
});
Route::group(['middleware' => ['auth:sanctum', 'verified']], function(){
    // User
    Route::get('/user/{id}', [UserController::class, 'show'])->name('showUser');
    Route::patch('/user/{user}', [AuthController::class, 'updateUserName'])->name('updateUserName');
    Route::patch('/profile/{user}', [AuthController::class, 'updateProfile'])->name('updateProfile');

    Route::delete('/user/{user}', [AuthController::class, 'destroy'])->name('destroyUser');
    Route::put('/user/{id}/follow', [UserController::class, 'followUnfollow'])->name('followUnfollow');
    Route::get('/user/{id}/followings', [UserController::class, 'followings'])->name('followings');
    Route::get('/user/{id}/followers', [UserController::class, 'followers'])->name('followers');
    Route::get('/user/{id}/likes', [UserController::class, 'likesUsers'])->name('likesUsers');
    Route::get('/post/user/{id}', [UserController::class, 'userPosts'])->name('userPosts');
    // Post
    Route::get('/post/{id}', [PostController::class, 'show'])->name('postShow'); 
    Route::post('/post', [PostController::class, 'store'])->name('postStore');
    Route::delete('/post/{post}', [PostController::class, 'destroy'])->name('postDestroy');
    Route::get('/followings/post', [PostController::class, 'followingsPost'])->name('followingsPost');
    Route::get('/post/user/{id}', [UserController::class, 'userPosts'])->name('userPosts');
    Route::get('/post/user/{user}/like', [PostController::class, 'likedPosts'])->name('likedPosts');
    Route::put('/post/{post}/like', [PostController::class, 'likeUnlike'])->name('likeUnlike');
    Route::post('/post/{id}/share', [PostController::class, 'sharePost'])->name('sharePost');
    Route::post('/post/{post}/unshare', [PostController::class, 'unsharePost'])->name('unsharePost');
    Route::get('/post/hashtag/{id}', [PostController::class, 'hashtag'])->name('hashtag');
    Route::get('/post/hashtag/{id}/latest', [PostController::class, 'hashtagLatest'])->name('hashtagLatest');
    Route::get('/post/search/{word}', [PostController::class, 'searchPosts'])->name('searchPosts');
    Route::get('/post/search/{word}/latest', [PostController::class, 'searchLatestPosts'])->name('searchLatestPosts');
    // Post/Comment
    Route::post('/post/comment', [PostController::class, 'addComment'])->name('addComment');
    Route::delete('/post/comment/{comment}', [PostController::class, 'destroyComment'])->name('destroyComment');
    // Roadmap
    Route::get('/roadmap/{id}', [RoadmapController::class, 'show'])->name('roadmapShow'); 
    Route::get('/roadmap/user/{id}', [UserController::class, 'userRoadmaps'])->name('userRoadmaps');
    // Route::get('/roadmap/user/{id}', [RoadmapController::class, 'userRoadmap'])->name('userRoadmap'); 
    Route::post('/roadmap', [RoadmapController::class, 'store'])->name('roadmapStore');
    Route::patch('/roadmap/{roadmap}', [RoadmapController::class, 'update'])->name('roadmapUpdate');
    Route::delete('/roadmap/{roadmap}', [RoadmapController::class, 'destroy'])->name('roadmapDestroy');
    Route::put('/roadmap/{roadmap}/save', [RoadmapController::class, 'saveUnsave'])->name('saveUnsave');
    Route::get('/roadmap/user/{user}/save', [RoadmapController::class, 'savedRoadmaps'])->name('savedRoadmaps');
    Route::get('/roadmap/search/{word}', [RoadmapController::class, 'searchRoadmaps'])->name('searchRoadmaps');
    Route::get('/roadmap/search/{word}/latest', [RoadmapController::class, 'searchLatestRoadmaps'])->name('searchLatestRoadmaps');
    Route::get('/followings/roadmap', [RoadmapController::class, 'followingsRoadmap'])->name('followingsRoadmap');
    // Step
    Route::get('/step', [StepController::class, 'index'])->name('stepIndex'); 
    Route::get('/step/roadmap/{id}', [StepController::class, 'show'])->name('stepShow');  
    Route::post('/step', [StepController::class, 'store'])->name('stepStore');
    Route::patch('/step/{step}', [StepController::class, 'update'])->name('stepUpdate');
    Route::post('/change-order', [StepController::class, 'changeOrder'])->name('stepChangeOrder');
    Route::patch('/step/memo/{step}', [StepController::class, 'StepMemoUpdate'])->name('StepMemoUpdate');
    Route::delete('/step/{step}', [StepController::class, 'destroy'])->name('stepDestroy');

});
