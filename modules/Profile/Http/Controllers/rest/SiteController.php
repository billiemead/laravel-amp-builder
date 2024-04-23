<?php

namespace Modules\Profile\Http\Controllers\rest;

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
 * Controller to handle action in /profile%pages
 * @package App\Http\Controllers\rest\profile
 */
class SiteController extends Controller
{
    /**
     * Get list of AMP Project belongs to current user
     * @return mixed
     */
    public function index()
    {
        $sites = Site::where('owner_id', auth()->user()->id)->withCount(['conversions', 'visits'])->orderBy('created_at', 'desc')->get();
        return response()->success($sites);
    }

    /**
     * Retrieve details of a AMP Project
     * @param $site_id
     * @return mixed
     */
    public function show($site_id)
    {
        $site = Site::where('id', $site_id)->with(['domains'])->withCount(['conversions', 'visits'])->firstOrFail();

        return response()->success($site);
    }
    /**
     * Add a new AMP Project
     *
     * @return Boolean
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), array(
            'name' => 'required|max:255',
            'template' => 'required',
        ));
        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        $template_id = $request->input('template');
        $templateStructure = [];
        if ($template_id != 'blank') {
            // Get template structure
            $template = \App\Models\Template::where('id', $template_id)->first();
            $templateStructure = $template->getTemplateStructure();
        }
        $site = Site::create([
            'name' => $request->input('name'),
            'theme' => 0,
            'owner_id' => auth()->user()->id
        ]);
        // Creating new variant for this AMP Project
        Page::create(
            [
            'name' => 'index',
            'site_id' => $site->id,
            'content'=> '',
            'structure'=>serialize($templateStructure),
            'title'=>"",
            'description'=>"",
            'keywords'=>"",
            'weight'=>100,
            ]
        );

        return 1;
    }
    /**
     * Remove a AMP Project
     *
     * @return Boolean
     */
    public function destroy(Request $request)
    {
        $id = $request->input('id');
        $site = Site::where('id', $id)->firstOrFail();
        $this->authorize('delete', $site);
        $site->delete();
        return 1;
    }
	
	/**
     * Clear a AMP Project Analytic Data
     *
     * @return Boolean
     */
    public function clearAnalytic(Request $request)
    {
        $id = $request->input('id');
        $site = Site::where('id', $id)->firstOrFail();
        $this->authorize('delete', $site);
		$site->clearAnalyticData();
		return 1;
    }
}
