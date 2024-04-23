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
use \App\Models\PageHistory;

use \App\Models\SiteDomain;

/**
 * Class ViewHistoryController
 * @package App\Http\Controllers
 */
class ViewHistoryController extends Controller
{
    
    
    public function view($page_uuid)
    {
        $pageHistory = PageHistory::whereUuid($page_uuid)->firstOrFail();
        $page = $pageHistory->page;
		$page->structure = $pageHistory->structure;
		$site = $page->parent_site;
        return $this->runPage($page, $site);
    }
}
