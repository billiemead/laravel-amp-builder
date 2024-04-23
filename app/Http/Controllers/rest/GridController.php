<?php

namespace App\Http\Controllers\rest;

use Validator;
use App\Http\Controllers\Controller;
use Auth;
use DB;
use Hash;
use File;
use Datatables;
use Illuminate\Support\Facades\Storage;

/**
 * Class GridController
 * @package App\Http\Controllers\rest
 */
class GridController extends Controller
{

    /**
     * Common functions to get list of a table and seperate to multi page
     * @param $name
     * @return mixed
     */
    protected function _getDatatable($name)
    {
        $modelClassName = '\App\Models\\'. ucfirst($name);
        if (class_exists($modelClassName)) {
            $result = Datatables::eloquent($modelClassName::query())->toArray();
        } else {
            $result = Datatables::of(DB::table($name));
        }
        return $result;
    }

    /**
     * Get list of a specify model in pagination
     * @param $name
     * @return mixed
     */
    public function getPagedList($name)
    {
        $result = $this->_getDatatable($name);
        if (!is_array($result)) {
            $result = $result->make(true)->getData();
        }
        
        return response()->success($result);
    }
}
