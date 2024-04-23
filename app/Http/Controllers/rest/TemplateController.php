<?php

namespace App\Http\Controllers\rest;

use File;
use DB;
use Validator;
use Datatables;
use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Models\TemplateToCategory;

class TemplateController extends Controller
{
    public function update()
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
        $id = $request->input('id');
        $update_object = $request->except(['restangularEtag', 'categories', 'structure', 'type']);
        $template = Template::findOrFail($id);
        $this->authorize('update', $template);
        $template->fill($update_object)->save();
        TemplateToCategory::where('template_id', $id)->delete();
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
     * Get template details
     * @param $template_id
     * @param null $param2
     * @return mixed
     */
    public function show($template_id, $param2 = null)
    {
        $includeContent = false;
        $template = $template_id;
        if (!empty($param2)) {
            $template = $param2;
            $includeContent = true;
        }
            
        $model = Template::findOrFail($template);
        if ($includeContent) {
            $content = $this->compileContent($model);
            $model->content = $content;
        }
        
        return response()->success($model->append('categories')->toArray());
    }
    /**
     * Show a list of template based on current page, used in profile#pages/add
     * @return mixed
     */
    public function nextPage()
    {
        $type = request()->get('type');
        $category = request()->get('category');
        $is_global = request()->get('is_global');
        $query = Template::orderBy('updated_at', 'desc');
        if (!empty($type)) {
            $query = $query->where('type', $type);
        }
        if (!empty($category) && $category > 0) {
            $query = $query->where(function ($query) use ($category) {
                $query = $query->where('category', $category);
                $query = $query->orWhereHas('templateToCategories', function ($query) use ($category) {
                    $query->where('category_id', $category);
                });
            });
        }
        
        $query = $query->where('is_global', $is_global);
        if (!$is_global) {
            $query = $query->where('owner_id', auth()->user()->id);
        }
        $query = $query->where('is_active', 1);
        $result = Datatables::of($query)->make(true)->getData();
        return response()->success($result);
    }
}
