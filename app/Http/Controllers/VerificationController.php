<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class VerificationController extends Controller
{
    //
    public function verify($user_id, Request $request) {
        // https://stackoverflow.com/questions/52866689/laravel-5-6-signed-url-wont-work-in-app-env-production
        // if (!$request->hasValidSignature()) {
        //     return response()->json(["msg" => "Invalid/Expired url provided."], 401);
        // }
    
        $user = User::findOrFail($user_id);
    
        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }
    
        return redirect()->to('/');
    }
    
    public function resend() {
        if (auth()->user()->hasVerifiedEmail()) {
            return response()->json(["msg" => "Email already verified."], 400);
        }
    
        auth()->user()->sendEmailVerificationNotification();
    
        return response()->json(["msg" => "Email verification link sent on your email id"]);
    }
}
