<?php

namespace Modules\Profile\Http\Controllers\rest;

use Validator;
use App\Http\Controllers\Controller;
use DB;
use Illuminate\Http\Request;
use App\Models\Page;
use App\Models\Template;

use App\Models\Site;
use Illuminate\Validation\Rule;

class VariantController extends Controller
{
    /**
     * Get list of variant belongs to a landing page
     * @return mixed
     */
    public function index()
    {
        $site_id = request()->input('site_id');
        $pages = Page::where('site_id', $site_id)->withCount(['visits', 'conversions'])->orderBy('id')->get();
        $discarded_pages = Page::where('site_id', $site_id)->onlyTrashed()->withCount(['visits', 'conversions'])->orderBy('id')->get();
        return response()->success(['discarded_variants'=>$discarded_pages, 'variants'=>$pages]);
    }
    /**
     * Add a new variant to user project
     * @return Boolean
     */
    public function store()
    {
        $site_id = request()->input('site_id');
        $site = Site::where('id', $site_id)->first();
        $data = request()->input('data');
        $validator = Validator::make($data, array(
            'name' => ['required','max:255',Rule::unique('pages')->where(function ($query) use ($site_id) {
                $query->where('site_id', $site_id);
            })],
            'template' => 'required',
        ));
        if ($validator->fails()) {
            return $validator->errors();
        }
        
        $template_id = array_get($data, 'template');
        $templateStructure = [];
        if ($template_id != 'blank') {
            // Get template structure
            $template = Template::where('id', $template_id)->first();
            $templateStructure = $template->getTemplateStructure();
        }
        
        $model = Page::create(
            [
            'name' => array_get($data, 'name'),
            'site_id' => $site->id,
            'content'=> '',
            'structure'=>serialize($templateStructure),
            'title'=>"",
            'description'=>"",
            'keywords'=>"",
            'created_at' => \Carbon\Carbon::now(),
            'updated_at' => \Carbon\Carbon::now(),
            ]
        );
        return response()->success($model);
    }

    /**
     * Update name and weight of a variant
     * @param $id
     * @return mixed
     */
    public function update($id)
    {
        $request = request();
        $data = $request->input('data');
        $model = Page::find($id);
        $site_id = $model->site_id;
        $validator = Validator::make($data, array(
            'name' => ['required','max:255',Rule::unique('pages')->where(function ($query) use ($site_id, $id) {
                $query->where('site_id', $site_id)->where('id', '<>', $id);
            })]
        ));
        if ($validator->fails()) {
            return $validator->errors();
        }
        $model->update(array(
            'name' => $request->input('data.name'),
        ));
      
        return response()->success($model);
    }

    /**
     * Copy a variant
     * @param $id
     * @return mixed
     */
    public function cloneVariant($id)
    {
        $variant = Page::findOrFail($id);
        $newVariant = $variant->replicate(['uuid']);
        $newVariant->name = $variant->name. '_copy';
        $newVariant->weight = 0;
        $structure = $variant->getPageStructure();
        $newVariant->structure = serialize($structure);
        $newVariant->save();

        return response()->success($newVariant);
    }
    /**
     * Soft delete a variant
     *
     * @return Boolean
     */
    public function destroy(Request $request)
    {
        $id = $request->input('id');
        $page = Page::findOrFail($id);
        $this->authorize('delete', $page);
        $page->delete();
        return 1;
    }
    /**
     * Restore a variant
     *
     * @return Boolean
     */
    public function restore($id)
    {
        $page = Page::withTrashed()->findOrFail($id);
        $this->authorize('delete', $page);
        $page->restore();
        return response()->success($page);
    }
    /**
     * Delete forever a variant
     *
     * @return Boolean
    */
    public function forceDelete($id)
    {
        $page = Page::withTrashed()->findOrFail($id);
        $this->authorize('delete', $page);
        $page->forceDelete();
        return 1;
    }
}
