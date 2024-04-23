<?php

namespace Modules\Admin\Http\Controllers\rest;

use \App\Models\ThemeCategory;
use App\Http\Controllers\Controller;
use File;
use DB;
use Validator;

class ThemeCategoriesController extends Controller
{

    /**
     * Get list of template categories
     * @return mixed
     */
    public function index()
    {
        $cats = ThemeCategory::all();
        return response()->success($cats);
    }

    /**
     * Get category details
     * @param $id
     * @return mixed
     */
    public function show($id)
    {
        $rs = ThemeCategory::findOrFail($id);
        return response()->success($rs);
    }

    /**
     * Update a category
     * @return mixed
     */
    public function update()
    {
        $request = request();
        $validator = Validator::make($request->all(), array(
            'title' => 'required|max:255',
        ));
        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        $id = $request->input('id');
        ThemeCategory::where('id', $id)->update(array(
            'title' => $request->input('title'),
            'description' => $request->input('description', ''),
            'page' => 1,
            'section' => $request->input('section', 0),
            'popup' => $request->input('popup', 0),
        ));
        return response()->success(1);
    }

    /**
     * Create a new category
     * @return mixed
     */
    public function store()
    {
        $request = request();
        $validator = Validator::make($request->all(), array(
            'title' => 'required|max:255',
            //'description' => 'required',
        ));
        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        $new_record = new ThemeCategory;
        $new_record->title = $request->input('title');
        $new_record->description = $request->input('description', '');
        $new_record->page = 1;
        $new_record->section = $request->input('section', 0);
        $new_record->popup = $request->input('popup', 0);
        $new_record->save();
        return response()->success(1);
    }

    /**
     * Delete a category
     * @return mixed
     */
    public function destroy()
    {
        $id = request()->input('id');
        ThemeCategory::where('id', $id)->delete();
        return response()->success(1);
    }
}
