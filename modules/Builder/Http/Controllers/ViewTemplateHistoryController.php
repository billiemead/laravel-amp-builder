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
use \App\Models\Template;
use \App\Models\TemplateHistory;

/**
 * Class ViewTemplateHistoryController
 * @package App\Http\Controllers
 */
class ViewTemplateHistoryController extends TemplateController
{
    
    
    public function view($page_uuid)
    {
        $pageHistory = TemplateHistory::whereUuid($page_uuid)->firstOrFail();
        $template = $pageHistory->template;
		$template->structure = $pageHistory->structure;
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
}
