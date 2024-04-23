<?php

namespace Modules\Profile\Http\Controllers\rest;

use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use Auth;
use DB;
use Plupload;
use Hash;
use Datatables;
use File;
use App\Models\SiteDomain;
use App\Models\Site;
use Illuminate\Validation\Rule;
use App\Rules\FQDN;
use App\Rules\ActiveUrl;

/**
 * Class DomainController
 * Handle some REST request related to landing page domain
 * @package App\Http\Controllers\rest\profile
 */
class DomainController extends Controller
{
    /**
     * Create new custom domain
     * @return mixed
     */
    public function store()
    {
        $domain = request()->input('name');
        $is_subdomain = (request()->input('subdomain', 0) == 1);
        $requests = request()->all();
        if (!$is_subdomain) {
            // Get domain information
            $url = $domain;
            $url = trim($url);
            // Normalize domain if needed
            if (!starts_with($url, '//') && !starts_with($url, 'http://') && !starts_with($url, 'https://')) {
                $url = '//'.$url;
            }
            $url = rtrim($url, '/');
            // Analyze domain
            $url_parts = parse_url($url);
            // Get domain name
            $requests['name'] = !empty($url_parts['host']) ? $url_parts['host'] : '';
            if (is_string($requests['name'])) {
                $requests['name'] = rtrim($requests['name'], '/');
            }
            // Get domain path
            $requests['path'] = !empty($url_parts['path']) ? $url_parts['path'] : null;
            if (is_string($requests['path'])) {
                $requests['path'] = ltrim($requests['path'], '/');
            }
        }
        
        $validator = Validator::make($requests, array(
            'name' => ['required','max:255', new FQDN($is_subdomain), new ActiveUrl($is_subdomain),
                Rule::unique('site_domains')->where(function ($query) use ($requests, $is_subdomain) {
                    $q = $query->where('subdomain', request()->input('subdomain'));
                    if (!$is_subdomain) {
                        $q = $q->where('path', $requests['path']);
                    }
                    return $q;
                })
            ],
            'site_id'=>'required'
        ));
        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        $model = new SiteDomain;
        $model->fill(
            [
            'name' => $requests['name'],
            'site_id' => request()->input('site_id'),
            'path' => !empty($requests['path']) ? $requests['path'] : null,
            'subdomain'=> request()->input('subdomain'),
            'secured'=> request()->input('secured', 0),
            'creator_id'=> auth()->user()->id,
            ]
        )->save();
        return response()->success($model);
    }

    /**
     * Delete a domain
     * @return mixed
     */
    public function destroy()
    {
        $id = request()->input('id');
        $domain = SiteDomain::findOrFail($id);
        $site = Site::findOrFail($domain->site_id);
        if ($site->owner_id != auth()->user()->id) {
            return response()->error('Permission denied');
        }
        $domain->delete();
        return response()->success(1);
    }
    
    // Render list of Site domain in Admin dasboard
    public function getPagedList()
    {
        $filters = request()->input('filters');
        $result = Datatables::of(SiteDomain::select('site_domains.*')->leftJoin('sites', 'sites.id', 'site_domains.site_id')->where('sites.owner_id', auth()->user()->id))
        ->editColumn('structure', function () {
            return null;
        })
        ->make(true)->getData();
        
        return response()->success($result);
    }
}
