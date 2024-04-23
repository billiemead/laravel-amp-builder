<?php

namespace Modules\Admin\Http\Controllers\rest;

use App\Models\Page;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use Auth;
use DB;
use Plupload;
use Hash;
use Illuminate\Http\Request;
use Datatables;
use File;
use \App\Models\SiteDomain;

/**
 * Class SiteDomainController
 * Controller to handle action in /admin%domains
 * @package App\Http\Controllers\rest
 */
class SiteDomainController extends Controller
{
    
    //Remove a Site domain
    public function destroy()
    {
        $id = request()->input('id');
        $validator = Validator::make(request()->all(), array(
            'id' => 'required',
        ));
        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        $model = SiteDomain::findOrFail($id);
        $model->delete();

        return response()->success(1);
    }
    
    // Render list of Site domain in Admin dasboard
    public function getPagedList()
    {
        $filters = request()->input('filters');
        $result = Datatables::of(SiteDomain::select('*'))
        ->editColumn('structure', function () {
            return null;
        })
        ->make(true)->getData();
        
        return response()->success($result);
    }
}
