<?php

namespace Modules\Builder\Http\Controllers;

use Modules\Builder\Http\Controllers\rest\TemplateBuilderController as Controller;
use File;
use DB;
use Validator;
use Zipper;
use \App\Models\Template;

class TemplateController extends Controller
{
    public function __construct()
    {
    }
    /**
     * @param $id
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function index($id)
    {
        \Assets::addScripts(['template_app', 'jquery_ui']);
        \Assets::addStyles(['builder']);
        if (is_string($id) && strlen($id) == 36) {
            $model = Template::whereUuid($id)->first();
        } else {
            $model = Template::find($id);
        }
        
        if (!isset($model)) {
            return view('builder/404', [
                'account'=>$id,
                'view_mode'=>''
            ]);
        }
        $this->authorize('update', $model);
        $structure = [];
        $structure['theme'] = $model->theme;
        $structure['type'] = $model->type;
        $structure['variant'] = (!empty($model->variant) ? $model->variant : 'default');
        $structure['use_css_variable'] = config('builder.use_css_variable');
        $structure['id'] = $model->id;
        $themeObject = $this->checkThemeExists($model->theme);
        return view("builder::template_builder", ['account'=>$model->id,'site'=>$model,'structure'=>$structure, 'themeObject'=>$themeObject]);
    }

    /**
     * View a template
     * @param $template_id
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    
    public function view($template_id)
    {
        $view_mode = 'subfolder';
        $template = Template::whereUuid($template_id)->first();
        if (!isset($template)) {
            return view('builder/404', [
                'account'=>$template_id,
                'view_mode'=>$view_mode
            ]);
        }
        // If template is global, check current user is author of this template
        if ($template->is_global == 0) {
            $this->authorize('view', $template);
        }
		\Assets::removeAllStyles();
		\Assets::addStyles(['boilerplate']);
		\Assets::addStyles(['boilerplate_noscript']);
		if($template->type == 'popup') {
			\Assets::addStyles(['template_boilerplate']);
		}
        $content = $this->compileContent($template);
        return view("builder::view_template", array(
            'account'=>$template->id,
            'template'=>$template,
            'content'=>$content,
            'title'=>"",
            'description'=>"",
            'keywords'=>"",
            
            'view_mode'=>''
        ));
    }

    
    /**
     * Preview a template
     * @param $page
     * @param $site
     * @param string $view_mode
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function preview($template_id)
    {
        \Assets::addScripts(['preview_app']);
        \Assets::addStyles(['preview']);
        $view_mode = '';
        $site = Template::whereUuid($template_id)->firstOrFail();
        if (empty($site)) {
            return view('builder/404', [
                'account'=>$template_id,
                'view_mode'=>$view_mode
            ]);
        }
        if ($site->is_global == 0) {
            $this->authorize('view', $site);
        }
        $isMobile = isMobile();
        if ($isMobile) {
            return redirect($site->view_url);
        }
        return view('builder::preview_template', [
                'account'=>$site->id,
                'variant'=>$site,
            ]);
    }
}
