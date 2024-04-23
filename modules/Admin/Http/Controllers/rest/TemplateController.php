<?php

namespace Modules\Admin\Http\Controllers\rest;

use App\Http\Controllers\rest\TemplateController as Controller;
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
     * @return mixed
     * @throws \Illuminate\Auth\Access\AuthorizationException
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
        $template = Template::findOrFail($id);
        $this->authorize('delete', $template);
        $template->delete();

        return response()->success(1);
    }

    /**
     * Download image from url and attach as template screenshot
     * @param $template
     * @param $url
     */
    protected function downloadScreenshot($template, $url)
    {
        $storage = Storage::disk('screenshot');
        $contents = file_get_contents($url);
        $storage->put('templates'.DIRECTORY_SEPARATOR.$template->id.'.jpg', $contents);
    }

    /**
     * Import a .template file
     * @param $filePath
     * @return array
     */
    protected function importSingleTemplateFile($filePath)
    {
        $model = Template::importFromFile($filePath, true, true);
        File::delete($filePath);
        return $model;
    }

    /**
     * Import single .template or .zip file
     * @param $file
     * @return array|int
     */
    protected function importSingleFile($file)
    {
        $originalName = $file->getClientOriginalName();
        $extensions = explode('.', $originalName);
        $extension = $extensions[sizeof($extensions) - 1];
        $filename = substr($originalName, 0, strlen($originalName) - strlen($extension) - 1);
        $file->move(storage_path('/temp/'), $originalName);
        $filePath = storage_path('/temp/' . $originalName);
        $extension = File::extension($filePath);
        if ($extension == 'template') {
            return $this->importSingleTemplateFile($filePath);
        } elseif ($extension == 'zip') {
            $rs = [];
            $max_execution_time = ini_get('max_execution_time');
            if ($max_execution_time <= 300) {
                ini_set('max_execution_time', 300);
            }
            $extractFolder = storage_path('temp'.DIRECTORY_SEPARATOR.$filename.uniqid());
            File::deleteDirectory($extractFolder);
            File::makeDirectory($extractFolder);
            $zipper = Zipper::make($filePath);
            $zipper->extractMatchingRegex($extractFolder, '/\.template|.\json$/i');
            $zipper->close();
            $files = File::files($extractFolder);
            foreach ($files as $file) {
                $rs[] = $this->importSingleTemplateFile($file->getRealPath());
            }
            File::deleteDirectory($extractFolder);
            File::delete($filePath);
            return $rs;
        }

        return 1;
    }

    /**
     * Handle template upload action
     * @return mixed
     */
    public function upload()
    {
        $handler = function ($file) {
            return $this->importSingleFile($file);
        };
        $ret['result'] = 1;
        $ret['info'] = Plupload::receive('file', $handler);

        return $ret;
    }

   
    /**
     * Copy a template
     * @param $id
     * @return mixed
     */
    public function cloneTemplate($id)
    {
        $site = Template::findOrFail($id);
        $template = $site->replicate(['uuid', 'source_uuid']);
        $template->push();
        return response()->success(1);
    }
    protected function _writeScreenshot($template)
    {
        if ($this->screenshot->getShouldQueue()) {
            return $this->dispatch(new TemplateScreenshotJob($template));
        }
        return $this->screenshot->getTemplateScreenshot($template);
    }
    /**
     * Get list of template with pagination
     */
    public function getPagedList()
    {
        $filters = request()->input('filters');
        $result = Datatables::of(Template::with('mainCategory')->select('*'))
        ->editColumn('structure', function () {
            return null;
        })
        ->editColumn('type', function ($template) {
            return trans('admin.page_templates.template_types.'.$template->type);
        })
        ->editColumn('owner.name', function ($template) {
            if (!empty($template->owner)) {
                if (config('app.demo_mode')) {
                    return config('app.demo_auth.anynomized_email');
                }
                return $template->owner->name;
            }
            return '';
        })
        ->filter(function ($query) {
            if (request()->has('filters.type')) {
                $query->where('type', request()->input('filters.type'));
            }
            if (request()->has('filters.user_template')) {
                $query->where('is_global', 1 - request()->input('filters.user_template'));
            } else {
                $query->where('is_global', 1);
            }
            if (request()->has('filters.category')) {
                $query->where('category', request()->input('filters.category'));
            }
            if (request()->has('filters.is_active')) {
                $query->where('is_active', request()->input('filters.is_active'));
            }
            $query->where('site_id', 0);
        }, true)
        ->make(true)->getData();
        
        return response()->success($result);
    }
    public function exportTemplate($account)
    {
        $template = Template::whereUuid($account);
        $template = $template->firstOrFail();
        $templateArray = $template->toArray();
        $templateArray['structure'] = $template->getTemplateStructure();
        $template->getStorage()->put('template_'.$template->id.'.template', json_encode($templateArray));
        return response()->download($template->getStorage()->path('template_'.$template->id.'.template'))->deleteFileAfterSend(true);
    }
}
