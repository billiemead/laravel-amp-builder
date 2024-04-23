<?php

namespace Modules\Builder\Http\Controllers;

use File;
use DB;
use Validator;
use Zipper;
use Illuminate\Http\Request;
use Leafo\ScssPhp\Compiler;
use lessc;
use \App\Models\Site;
use \App\Models\Page;
use \App\Models\SiteDomain;

/**
 * Class ViewProjectController
 * @package App\Http\Controllers
 */
class ViewProjectController extends Controller
{
    
    /**
     * Render a project under a custom domain without path
     */
   
    public function viewDomainNonePath($domain, $name = null)
    {
        return $this->viewDomain($domain, null, $name);
    }
    
    /**
     * Render a project under a custom domain
     * @param null $path
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function viewDomain($domain, $path = null, $name = null)
    {
        $site_domain = SiteDomain::where('name', $domain)->where('subdomain', 0);
        if (!empty($path)) {
            $site_domain = $site_domain->where('path', $path);
        } else {
            $site_domain = $site_domain->where('path', null);
        }
        
        $site_domain = $site_domain->firstOrFail();
        if (empty($site_domain)) {
            return view('builder/404', [
                'account'=>$path,
                'view_mode'=>''
            ]);
        }
        $site = Site::where('id', $site_domain->site_id)->firstOrFail();
       
        return $this->view($site->uuid, $name, 'domain');
    }
    /**
     * Render the AMP page when running in a subdomain
     * @param string $name
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View|string|void
     */
    public function viewSubdomain($subdomain, $name = 'index')
    {
        $site_domain = SiteDomain::where('name', $subdomain)->where('subdomain', 1)->firstOrFail();
        $site = Site::findOrFail($site_domain->site_id);
        return $this->view($site->uuid, $name, 'subdomain');
    }
   

    /**
     * Track visitors and pageviews for a AMP page
     */
    public function tracking()
    {
        $type = request()->input('type', 'pageview');
        $page_id = request()->input('page_id');
        if (empty($page_id)) {
            return;
        }
        $page = Page::findOrFail($page_id);
        if (empty($page)) {
            return;
        }
        switch ($type) {
            case 'pageview':
                $visit = \App\Tracking\Tracker::recordVisit();
                if (!empty($visit)) {
                    $visit->site_id = $page->site_id;
                    $visit->page_id = $page_id;
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
                        $conversion->page_id = $page_id;
                        $conversion->save();
                    }
                }
                break;
        }
    }

    

    /**
     * @param $account
     * @param string $name
     * @param string $view_mode
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View|string|void
     * @throws \PhpAb\Exception\DuplicateVariantException
     * @throws \PhpAb\Exception\EngineLockedException
     * @throws \PhpAb\Exception\TestCollisionException
     */
    public function view($site_uuid, $name = "index")
    {
        $view_mode = '';
        if (is_null($name)) {
            $name = "index";
        }
        $site = Site::whereUuid($site_uuid)->firstOrFail();
        
        if ($site->isExpired()) {
            return view('builder/account_expired', [
                'account'=>$account,
                'view_mode'=>$view_mode
            ]);
        }
        if (empty($name)) {
            $page = Page::where('site_id', $site->id)->firstOrFail();
        } else {
            $page = Page::where('name', $name)->where('site_id', $site->id)->firstOrFail();
        }
        return $this->runPage($page, $site, $view_mode);
    }
    
    /**
     * Preview an amp site
     * @param $page
     * @param $site
     * @param string $view_mode
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function preview($site_id, $view_mode = 'subfolder')
    {
        \Assets::addScripts(['preview_app']);
        \Assets::addStyles(['preview']);
        $site = Site::whereUuid($site_id)->firstOrFail();
        
        if ($site->isExpired()) {
            return view('builder/account_expired', [
                'account'=>$site->id,
                'view_mode'=>$view_mode
            ]);
        }
        if (request()->has('variant')) {
            $variant = request()->get('variant');
            $page = Page::where('id', $variant)->first();
        }
        if (empty($page)) {
            $page = Page::where('site_id', $site->id)->firstOrFail();
        }
        $isMobile = isMobile();
        if ($isMobile) {
            return redirect($page->view_url);
        }
        return view('builder::preview_site', [
                'account'=>$site->uuid,
                'variant'=>$page,
                'view_mode'=>$view_mode
            ]);
    }
    /**
     * Handle GET request for rendering a single variant
     * @param $page_id
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function viewVariant($page_uuid)
    {
        $page = Page::whereUuid($page_uuid)->firstOrFail();
        $site = $page->parent_site;
        return $this->runPage($page, $site);
    }
}
