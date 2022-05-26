<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;

use App\Models\User;
use App\Models\Roadmap;
use App\Models\Step;

use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Http\Resources\RoadmapResource;
use App\Http\Resources\StepResource;

use Illuminate\Support\Facades\Auth;
class StepController extends Controller
{
    // public function index(Request $request)
    // {

    // }

    public function show(Request $request, string $id)
    {
        $user_id = $request->user()->id;
        $roadmap_id = $id;

        $roadmap = Roadmap::with(['user', 'steps'])->where('id', $id)->first();

        return response()->json([
            'roadmap'=>new RoadmapResource($roadmap),
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'content'=>'required|max:100',
            'state'=>['required', 'regex:/(todo|inProgress|done)/'],
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

            $roadmap = Roadmap::with('steps')->find($request->roadmap);
            if($request->user()->id !== $roadmap->user_id)
            {
                return response()->json([], 401);
            }
            else{
                $steps = $roadmap->steps;
                $new_step = new Step;
                if($steps->count()===0){
                    $new_step->order = 0;
                }
                else{
                    foreach($steps as $step){
                        $order_list = array();
                        array_push($order_list, $step->order);
                    }
                    $max_order = max($order_list);

                    $new_step->order = $max_order+1;
                }
                $new_step->content = $request->content;
                $new_step->state = $request->state;
                // $step->order = $request->order;
                $new_step->roadmap_id = $request->roadmap;
                $new_step->save();

                return $roadmap
                ? response()->json([
                    'step'=>$new_step,
                ], 201)
                : response()->json([], 500);
            }
        }
    }

    public function update(Request $request, Step $step)
    {
        // $step = Step::where('id', $id)->first();
        // contentとstateの変更
        if($request->user()->id !== $step->roadmap->user->id)
        {
            return response()->json([$step->roadmap->user->id], 401);
        }
        else
        {
            $validator = Validator::make($request->all(),[
                'content'=>'required|max:100',
                'state'=>['required', 'regex:/(todo|inProgress|done)/'],
            ]);
    
            if($validator->fails())
            {
                return response()->json([
                    'status'=>419,
                    'validation_errors'=>$validator->messages(),
                ]);
            }

            $step->content = $request->content;
            $step->state = $request->state;
            $step->save();
            return $step
                ? response()->json(['step'=>new StepResource($step)])
                : response()->json([], 500);
        }
    }
    public function StepMemoUpdate(Request $request, Step $step)
    {
        // $step = Step::where('id', $id)->first();
        // contentとstateの変更
        if($request->user()->id !== $step->roadmap->user->id)
        {
            return response()->json([$step->roadmap->user->id], 401);
        }
        else
        {
            $validator = Validator::make($request->all(),[
                'memo'=>'required|max:2000',
            ]);
    
            if($validator->fails())
            {
                return response()->json([
                    'status'=>419,
                    'validation_errors'=>$validator->messages(),
                ]);
            }

            $step->memo = $request->memo;
            $step->save();
    
            return $step
                ? response()->json(['step'=>new StepResource($step)])
                : response()->json([], 500);
        }

    }

    public function destroy(Request $request, Step $step)
    {
        if($request->user()->id !== $step->roadmap->user->id)
        {
            return response()->json([], 401);
        }
        else
        {
            return $step->delete()
                ? response()->json($step)
                : response()->json([], 500);
        }     
    }

    public function changeOrder(Request $request)
    {
        $user_id = $request->user()->id;
        $roadmap_id = $request->roadmap;
        $old_steps = Step::with('roadmap')
            ->where('roadmap_id', $roadmap_id)
            // ->whereHas('roadmap', function($q) use ($user_id){
            //     $q->where('user_id', $user_id)
            // })
            ->get();
            // ->get(['id','order', 'roadmap'])
            // ->toArray()
        $new_steps = $request->steps;

        if($user_id !== $old_steps[0]["roadmap"]["user_id"]){
            return response()->json([], 401);
        }

        // $update_step_list = array();
        foreach($old_steps as $old_step){
            // 「$old_stepsのid」とidが同じ$new_stepsの、配列のキー値を返す
            // array_search( 検索文字列, array_column( 検索対象の配列, 検索する値))
            $new_step_key = array_search($old_step["id"], array_column( $new_steps, 'id'));
            $new_step = $new_steps[$new_step_key];
            if($new_step["order"] !== $old_step["order"]){
                // $update_step = ['id' => $new_step["id"], 'order' => $new_step["order"]];
                // array_push($update_step_list, $update_step);
                $old_step->order = $new_step["order"];
                $old_step->save();
            }
        }

        return response()->json([
            'id'=>$user_id === $old_steps[0]["roadmap"]["user_id"],
            // 'list'=>$update_step_list,
            // 'old'=>$old_steps,
            // 'new'=>$new_steps
        ], 200);
    }
}