<?php

namespace Modules\Builder\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use App\Http\Controllers\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Page;
use App\Models\Site;

class Controller extends BaseController
{
    
    /**
     * Render a AMP page
     * @param $page
     * @param $site
     * @param string $view_mode
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function runPage($page, $site)
    {
        $view_mode = "";
        $content = $this->getPageHtml($site, $page);
        $title = $page->title;
        
        $description = $page->description;
        $keywords = $page->keywords;
        
        $structure = $page->getPageStructure();
		\Assets::removeAllStyles();
        \Assets::addStyles(['boilerplate']);
		\Assets::addStyles(['boilerplate_noscript']);
        
        return view("builder::view_site", array(
            'account'=>$site->id,
            'site'=>$site,
            'page'=>$page,
            'content'=>$content,
            'title'=>$title,
            'description'=>$description,
            'keywords'=>$keywords,
            
            'tracking_code'=>false,
            'view_mode'=>$view_mode
        ));
    }
    /**
     * @param $site
     * @param $page
     * @return string
     */
    public function getPageHtml($site, $page)
    {
        app('app.widget')->setVariant($page);
        $pageStructure = $page->getPageStructure();
        $content = $this->compilePageContentFromStructure($pageStructure);
        return $content;
    }

    /**
     * Convert an array content of a variant to html
     * @param Array $structure
     * @return string
     */
    protected function compilePageContentFromStructure($structure)
    {
        $content = '';
        if (!is_array($structure)) {
            return "";
        }
        $content .= app('app.widget')->begin('page', $structure);
        $content .= app('app.widget')->end('page', $structure);
        return $content;
    }

    /**
     * @param Array $section
     * @param string $index
     * @return string
     */
    protected function compileSectionContentFromStructure($section, $index = 'data')
    {
        $content = '';
        $type = array_get($section, 'type');
        $content .= app('app.widget')->begin($type, $section);
        $content .= app('app.widget')->end($type, $section);
        return $content;
    }

    /**
     * @param Array $section
     * @param string $index
     * @return string
     */
    protected function compilePopupContentFromStructure($section, $index = 'modules')
    {
        $content = '';
        $type = array_get($section, 'type');
        $content .= app('app.widget')->begin($type, $section);
       
        $content .= app('app.widget')->end($type, $section);
        
        return $content;
    }

    /**
     * @param Array $module
     * @return string
     */
    protected function compileModuleContentFromStructure($module)
    {
        $content = '';
        $type = array_get($module, 'type');

        $content .= app('app.widget')->begin($type, $module);
       
        $content .= app('app.widget')->end($type, $module);
        return $content;
    }

    /**
     * Check an array is associated array
     * @param $var
     * @return bool
     */
    public function isAssoc($var)
    {
        return is_array($var) && array_diff_key($var, array_keys(array_keys($var)));
    }


    /**
     * @param $variant_id
     * @return array|bool
     */
    protected function checkVariantExists($variant_id)
    {
        //check variant is uuid
        if (is_string($variant_id) && strlen($variant_id) == 36) {
            $page = Page::whereUuid($variant_id)->first();
        } else {
            $page = Page::find($variant_id);
        }
        if (empty($page)) {
            return false;
        }
       
        return $page;
    }

    /**
     * @param int $id
     * @return \App\ThemeManager
     */
    protected function checkThemeExists($id = 0)
    {
        return app('app.theme');
    }
}
