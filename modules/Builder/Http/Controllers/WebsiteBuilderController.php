<?php

namespace Modules\Builder\Http\Controllers;

use File;
use DB;
use Validator;
use Zipper;
use Illuminate\Http\Request;
use Leafo\ScssPhp\Compiler;
use lessc;
use Sass;
use \App\Models\Site;
use \App\Models\Page;
use \App\Models\SiteDomain;

/**
 * Class WebsiteBuilderController
 * @package App\Http\Controllers
 */
class WebsiteBuilderController extends Controller
{
    public function __construct()
    {
        \Assets::addScripts(['builder_app', 'jquery_ui']);
        \Assets::addStyles(['builder']);
    }

    /**
     * Render page builder
     * @param $page_uuid
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function openVariantBuilder($page_uuid)
    {
        $page = Page::whereUuid($page_uuid)->first();
        if (empty($page)) {
            return response()->error("Site doesn't exitst.");
        }
        return $this->_openVariantBuilder($page);
    }

   
    protected function getProjectStructure(Site $site, Page $page)
    {
        $structure = array();
        $structure['theme'] = $site->theme;
        $structure['variant'] = (!empty($page->variant) ? $page->variant : (!empty($site->variant) ? $site->variant : 'default'));
        $structure['id'] = $site->id;
        $structure['variant_id'] = $page->id;
        $structure['main_domain'] = getMainDomain();
        $structure['use_css_variable'] = config('builder.use_css_variable');
        return $structure;
    }
    /**
     * Render page builder for first variant of a project
     * @param $site_uuid
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function openProjectBuilder($site_uuid)
    {
        $site = Site::whereUuid($site_uuid)->first();
        if (empty($site)) {
            return response()->error("Site doesn't exitst.");
        }
        $this->authorize('update', $site);
        $page = Page::where('site_id', $site->id)->firstOrFail();
        if (!empty($page)) {
            return $this->_openVariantBuilder($page);
        }
    }
    
    /**
     * Helper function to open builder for a specify variant
     * @param \App\Models\Page $page
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    protected function _openVariantBuilder(Page $page)
    {
        // Check if user is owner or granted permission with parent site
        $site = $page->parent_site;
        $this->authorize('update', $site);
        $structure = $this->getProjectStructure($site, $page);
        $themeObject = $this->checkThemeExists($site->theme);
        return view("builder::index", array('account'=>$page->id,'variant'=>$page, 'site'=>$site, 'structure'=>$structure, 'themeObject'=>$themeObject));
    }
    
    /**
     * Download  a whole project
     */
    public function download($site_uuid)
    {
        $site = Site::whereUuid($site_uuid)->first();
        if (empty($site)) {
            return response()->error("Site doesn't exitst.");
        }
        $this->authorize('update', $site);
        $pages = Page::where('site_id', $site->id)->get();
        if (empty($pages)) {
            return response()->error("This prject is empty. Please try to add more variant to this project");
        }
        $filePath = storage_path('/temp/' . $site->id.'.zip');
        $zipper = Zipper::make($filePath);
        foreach ($pages as $page) {
            $pageHtml = $this->runPage($page, $site);
            $zipper->add($page.'.html', $pageHtml);
        }
    }
   

    /**
     * Track visitors and pageviews for a AMP page
     */
    public function tracking($variant)
    {
        $type = request()->input('type', 'pageview');
        if (empty($variant)) {
            return;
        }
        $page = Page::whereUuid($variant)->firstOrFail();
        if (empty($page)) {
            return;
        }
        switch ($type) {
            case 'pageview':
                $visit = \App\Tracking\Tracker::recordVisit();
                if (!empty($visit)) {
                    $visit->site_id = $page->site_id;
                    $visit->page_id = $page->id;
                    $visit->save();
                }
                break;
            case 'conversion':
                $goal = request()->input('goal');
                $conversion_goal = \App\Tracking\Models\Goal::where('name', $goal)->first();
                if (!empty($conversion_goal)) {
                    $uniqueVistorId = \App\Tracking\Tracker::getUniqueVistor();
                    $existed = \App\Tracking\Models\Conversion::where('visitor_id', $uniqueVistorId)->where('goal_id', $conversion_goal->id)->exists();
                    if ($existed) {
                        return;
                    }
                    $conversion = \App\Tracking\Tracker::recordConversion($conversion_goal->id);
                    if (!empty($conversion)) {
                        $conversion->site_id = $page->site_id;
                        $conversion->page_id = $page->id;
                        $conversion->save();
                    }
                }
                break;
        }
    }
}
