<?php

namespace App\Http\Controllers;

use App\Models\Errors;
use Illuminate\Http\Request;

class ErrorController extends Controller
{
    //
    public function errorCount(Request $request){
        $errors = Errors::all();
        $count = $errors->count();
        $types = $errors->pluck("type");
        $typeList = [];
        foreach($types as $type){            
            $typeList[$type] = $errors->where("type", $type)->count();

        }
        error_log($request->user()->name);
        return [
            "total" => $count,
            "types" => $typeList
            
        ];
    }
    public function index(Request $request){
        $errors = Errors::orderBy($request->orderBy, $request->order)->select("id","type")->paginate(10);
        return $errors;
    }
    public function show($id){
        $error = Errors::findOrFail($id);
        return $error;
    }
}
