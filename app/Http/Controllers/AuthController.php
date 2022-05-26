<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Events\Registered;

class AuthController extends Controller
{
    //
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'name'=>'required|max:40|unique:users,name',
            'email'=>'required|email|max:191|unique:users,email',
            'password'=>'required|min:8',
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
            $user = User::create([
                'name'=>$request->name,
                'email'=>$request->email,
                'nick_name'=>"ななしさん",
                'password'=>Hash::make($request->password),
            ])
            // ->sendEmailVerificationNotification()
            ;
            event(new Registered($user));
            
            return response()->json([
                'status'=>200,
                'message'=>'Registerd Successfully',
            ]);
        }
    }
    public function updateUserName(Request $request, User $user)
    {
        $validator = Validator::make($request->all(),[
            'name'=>'required|max:191',
        ]);
        if($validator->fails())
        {
            return response()->json([
                'status'=>419,
                'validation_errors'=>$validator->messages(),
            ]);
        }

        if($request->user()->id !== $user->id)
        {
            return response()->json([], 401);
        }
        else
        {
            $user->name = $request->name;
            $user->save();
    
            return $user
                ? response()->json([
                        'userName'=>$user->name,
                    ])
                : response()->json([], 500);
        }

    }
    public function updateProfile(Request $request, User $user)
    {
        $validator = Validator::make($request->all(),[
            'nick_name'=>'required|max:191',
        ]);
        if($validator->fails())
        {
            return response()->json([
                'status'=>419,
                'validation_errors'=>$validator->messages(),
            ]);
        }

        if($request->user()->id !== $user->id)
        {
            return response()->json([], 401);
        }
        else
        {
            $user->nick_name = $request->nick_name;
            $user->save();
    
            return $user
                ? response()->json([
                        'nick_name'=>$user->nick_name,
                    ])
                : response()->json([], 500);
        }


    }
    public function destroy(Request $request, User $user)
    {
        if($request->user()->id !== $user->id)
        {
            return response()->json([], 401);
        }
        else
        {
            return $user->delete()
                ? response()->json($user)
                : response()->json([], 500);
        }     
    }
}
