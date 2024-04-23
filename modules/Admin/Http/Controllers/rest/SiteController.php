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
use \App\Models\Site;

/**
 * Class SiteController
 * Controller to handle action in /admin%pages
 * @package App\Http\Controllers\rest
 */
class SiteController extends Controller
{
    
    /**
     * Remove a AMP Project
     *
     * @return Boolean
     */
    public function destroy(Request $request)
    {
        $id = $request->input('id');
        $site = Site::findOrFail($id);

        $site->delete();
        return 1;
    }

    /**
     * Get list of AMP Project with pagination, used in admin#pages/list
     * @return mixed
     */
    public function getPagedList()
    {
        $response = Datatables::of(Site::select('*'))
            ->editColumn('structure', function () {
                return null;
            })
            ->editColumn('owner.name', function ($record) {
                if (config('app.demo_mode')) {
                    return config('app.demo_auth.anynomized_email');
                }
                if (!is_null($record->owner)) {
                    return $record->owner->email;
                }
                return "-";
            })
            ->addColumn('variants_count', function ($record) {
                return $record->variants->count();
            });
        $response = $response->make(true);
        return response()->success($response->getData());
    }
}
