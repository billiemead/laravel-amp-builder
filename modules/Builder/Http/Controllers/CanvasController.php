<?php

namespace Modules\Builder\Http\Controllers;

use Modules\Builder\Http\Controllers\rest\TemplateBuilderController as Controller;
use File;
use DB;
use Validator;
use Zipper;
use \App\Models\Template;

class CanvasController extends Controller
{
    public function __construct()
    {
        \Assets::removeScripts(['vendor', 'app_common']);
        \Assets::removeStyles(['angular-material', 'fontawesome']);
        \Assets::addScripts(['jquery_ui', 'frontend_app', 'html2canvas', 'canvg', 'webfont']);
        \Assets::addStyles(['builder_canvas']);
    }
    /**
     * Render a builder canvas iframe
     * @param $page_id
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function viewInCanvas($page_id)
    {
        $page = $this->checkVariantExists($page_id);
        if ($page === false) {
            return response()->error("Site doesn't exitst.");
        }
        $site = $page->parent_site;
        $content = $this->getPageHtml($site, $page);
        
        $themeObject = $this->checkThemeExists($site->theme);
        return view("builder::view", ['content'=>$content, 'theme'=>$site->theme, 'themeObject'=>$themeObject]);
    }
    
    /**
     * Render template builder canvas iframe
     * @param $template_id
     * @param string $name
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function viewTemplateInCanvas($template_id, $name = 'index')
    {
        $template = Template::findOrFail($template_id);
        $themeObject = $this->checkThemeExists($template->theme);
        $content = $this->compileContentWithPage($template);
        return view("builder::view", ['content'=>$content, 'theme'=>$template->theme, 'themeObject'=>$themeObject]);
    }
}
