<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('index');
});
// auth
Route::get('/auth/register', function () {
    return view('index');
});
Route::get('/auth/login', function () {
    return view('index');
})->name('login');
Route::get('/auth/forgot-password', function () {
    return view('index');
});
Route::get('/auth/reset-password', function () {
    return view('index');
});
Route::get('/settings', function () {
    return view('index');
});
// profile
Route::get('/prof/{id}', function () {
    return view('index');
});
//  post
Route::get('/post/{id}', function () {
    return view('index');
});
Route::get('/post/user/{id}', function () {
    return view('index');
});
Route::get('/post/add', function () {
    return view('index');
});
Route::get('/post/hashtag/{id}', function () {
    return view('index');
});
Route::get('/search', function () {
    return view('index');
});
Route::get('/search/post/', function () {
    return view('index');
});
// roadmap
Route::get('/roadmap/add', function () {
    return view('index');
});
Route::get('/step/roadmap/{id}', function () {
    return view('index');
});
Route::get('search/roadmap/', function () {
    return view('index');
});
Route::get('/following/roadmap', function () {
    return view('index');
});
Route::get('/step/roadmap/{roadmap}', function (){
    return view('index');
});