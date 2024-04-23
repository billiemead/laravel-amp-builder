<?php

namespace Modules\Profile\Http\Controllers\rest;

use File;
use DB;
use Validator;
use Datatables;
use Illuminate\Support\Facades\Storage;
use Plupload;
use Zipper;
use App\Models\Template;
use \App\Models\Template_To_Category;
use Modules\Admin\Http\Controllers\rest\TemplateController as Controller;

class TemplateController extends Controller
{
    /**
     * Create new template
     * @return mixed
     */
    public function store()
    {
        $request = request();
        $validator = Validator::make($request->all(), array(
            'name' => 'required|max:255',
            'type' => 'required',
            'category' => 'required',
        ));
        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        $update_object = $request->except(['restangularEtag', 'categories']);
        $update_object['owner_id'] = auth()->user()->id;
        $model = Template::create($update_object);
        $id = $model->id;
        $categories = request()->input('categories');
        if (!empty($categories)) {
            foreach ($categories as $category => $value) {
                if (!$value) {
                    continue;
                }
                TemplateToCategory::create([
                'template_id'=> $id,
                'category_id'=> $category
                ]);
            }
        }
        return response()->success(1);
    }
	
	/**
     * Delete a user's template
     * @return mixed
     */
    public function destroy()
    {
        $id = request()->input('id');
        $validator = Validator::make(request()->all(), array(
            'id' => 'required',
        ));
        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        $template = Template::where('id', $id)->where('owner_id', auth()->user()->id)->firstOrFail();
        $template->delete();

        return response()->success(1);
    }

    /**
     * Get list of template with pagination
     */
    public function getPagedList()
    {
        $result = Datatables::of(Template::with('mainCategory')->select('*')->where('is_global', 0)->where('site_id', 0)->where('owner_id', auth()->user()->id))
        ->editColumn('structure', function () {
            return null;
        })
        ->editColumn('type', function ($template) {
            return trans('admin.page_templates.template_types.'.$template->type);
        })
        ->filter(function ($query) {
            if (request()->has('filters.type')) {
                $query->where('type', request()->input('filters.type'));
            }
            
            if (request()->has('filters.category')) {
                $query->where('category', request()->input('filters.category'));
            }
            if (request()->has('filters.is_active')) {
                $query->where('is_active', request()->input('filters.is_active'));
            }
        }, true)
        ->make(true)->getData();
        
        return response()->success($result);
    }
	protected function importSingleTemplateFile($filePath)
    {
        $model = Template::importFromFile($filePath, true, false);
        File::delete($filePath);
		if(empty($model->isUpdated)) {
			$model->is_global = 0;
			$model->owner_id = auth()->user()->id;
			$model->save();
		}
		
		return $model;
    }
}
