<?php

namespace Modules\Builder\Http\Controllers\rest;

use File;
use DB;
use Validator;
use Datatables;
use Illuminate\Support\Facades\Storage;
use Plupload;
use Zipper;
use App\Models\Template;
use App\Models\Page;

use App\Models\TemplateToCategory;
use App\Jobs\TemplateScreenshotJob;

class TemplateController extends TemplateBuilderController
{
    


    /**
     * Create a template from a landing page variant
     * @param $site_id
     * @param bool $template_id
     * @return mixed
     */
    public function createFromWebsite($site_id, $template_id = false)
    {
        $structure = request()->input('structure');
        $template = new Template;
        $template->name = request()->input('name');
        $template->category = request()->input('category');
        $template->structure = serialize($structure);
        $template->type = request()->input('type');
        $template->save();
        $this->_writeScreenshot($template);
        $response = $template->toArray();
        $response['message'] = trans('builder::builder.template_save_success_message', $response);
        return response()->success($response);
    }
    
    
    /**
     * Create a  section
     * @param $site_id
     * @param bool $template_id
     * @return mixed
     */
    public function saveMySection($site_id, $template_id = false)
    {
        $structure = request()->input('structure');
        $template = new Template;
        $template->name = request()->input('name');
        $template->category = request()->input('category');
        $template->structure = serialize($structure);
        $template->type = request()->input('type', 'section');
        $template->is_global = 0;
        $template->owner_id = auth()->user()->id;
        $template->save();
        $this->_writeScreenshot($template);
        $response = $template->toArray();
        $response['message'] = trans('builder::builder.template_save_success_message', $response);
        return response()->success($response);
    }

    protected function _writeScreenshot($template)
    {
        if ($this->screenshot->getShouldQueue()) {
            return $this->dispatch(new TemplateScreenshotJob($template));
        }
        return $this->screenshot->getTemplateScreenshot($template);
    }
}
