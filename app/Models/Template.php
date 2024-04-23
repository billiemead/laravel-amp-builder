<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Storage;
use File;
use Validator;
use Route;
use Dyrynda\Database\Support\GeneratesUuid;
use Log;
use App\Models\TemplateToCategory;

class Template extends Model
{
    use GeneratesUuid;
    protected $guarded = [];
    protected $fillable = ['name', 'type', 'category', 'viewed', 'title', 'description', 'keywords', 'structure', 'site_id', 'is_active', 'is_global','owner_id', 'updated_at', 'source_uuid'];
    public $theme = 5;
    protected $appends = ['view_url', 'edit_url', 'preview_url', 'screenshot_url',  'screenshot_url_nc', 'export_url'];
    protected $hidden = ['structure'];
	
	
	
    public function templateToCategories()
    {
        return $this->hasMany('App\Models\TemplateToCategory', 'template_id');
    }
    public function owner()
    {
        return $this->belongsTo('App\Models\User', 'owner_id');
    }
    public function getCategoriesAttribute()
    {
        $templateToCategories = $this->templateToCategories;
        $categories = [];
        if (!empty($templateToCategories)) {
            foreach ($templateToCategories as $templateToCategory) {
                $categories[$templateToCategory->category_id] = true;
            }
        }
        return $categories;
    }
    public function mainCategory()
    {
        return $this->belongsTo('App\Models\ThemeCategory', 'category');
    }
    public function getViewUrlAttribute()
    {
        if (Route::has('viewSiteTemplateRoute')) {
            return route('viewSiteTemplateRoute', ['account'=>$this->uuid]);
        }
    }
    public function getPreviewUrlAttribute()
    {
        if (Route::has('previewSiteTemplateRoute')) {
            return route('previewSiteTemplateRoute', ['account'=>$this->uuid]);
        }
    }
    public function getDecodedStructureAttribute()
    {
        return $this->getTemplateStructure();
    }
    public function getExportUrlAttribute()
    {
        if (Route::has('exportTemplateRoute')) {
            return route('exportTemplateRoute', ['account'=>$this->uuid]);
        }
    }
    public function getScreenshotUrlAttribute()
    {
        return Storage::disk('screenshot')->url('/templates/'.$this->id.'.jpg');
    }
    public function getScreenshotUrlNcAttribute()
    {
        return $this->screenshot_url.'?nocache='.(!empty($this->updated_at) ? $this->updated_at->format('dMYhis') : STS_VERSION);
    }
    public function getEditUrlAttribute()
    {
        if (Route::has('editTemplateRoute')) {
            return route('editTemplateRoute', ['account'=>$this->uuid]);
        }
    }
    public function getStorage()
    {
        return Storage::disk('templates');
    }
    public function delete(array $options = [])
    {
        Storage::disk('templates')->deleteDirectory($this->id);
        Storage::disk('screenshot')->delete('templates'.DIRECTORY_SEPARATOR.$this->id.'.jpg');
        TemplateToCategory::where('template_id', $this->id)->delete();
		TemplateHistory::where('template_id', $this->id)->delete();
        parent::delete();
    }
    public function getTemplateStructure()
    {
        $storage = Storage::disk('templates');
        $jsonStructureFilePath = $this->id.'/structure.json';
        $pageStructure = [];
        if ($storage->exists($jsonStructureFilePath)) {
            $pageStructure = $storage->get($jsonStructureFilePath);
            $pageStructure = json_decode($pageStructure, true);
        } elseif (!empty($this->structure)) {
            try {
                $pageStructure = unserialize($this->structure);
            } catch (\Exception $e) {
                $pageStructure = [];
            }
        }
        return $pageStructure;
    }
    public static function importFromFile($filePath, $overwrite = false, $global = false)
    {
        $content = File::get($filePath);
        $json = json_decode($content, true);
        if (empty($json) && !is_array($json)) {
            return ['File isn\'t valid'];
        }
        $rules = [
            'name' => 'required|max:255',
            'type' => 'required',
            'category' => 'required',
            'structure'=>'required',
        ];
        if (!$overwrite) {
            $rules['uuid'] = 'unique:templates';
			
        }
        $validator = Validator::make($json, $rules);
        $json['structure'] = serialize($json['structure']);
        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        unset($json['id']);
        $json['owner_id'] = 0;
        if ($overwrite) {
            $model = Template::where('source_uuid', $json['uuid']);
			$model = $model->where('is_global', $global);
			if(!$global)
				$model = $model->where('owner_id', auth()->user()->id);
			$model = $model->first();
            if (isset($model)) {
                $canOverwrite = ($model->type == $json['type']);
				
                if ($canOverwrite) {
                    $model->fill([
                        'structure'=>$json['structure']
                    ])->save();
                    $model->isUpdated = true;
                }
            }
        }
        if (!isset($model)) {
            $json['source_uuid'] = $json['uuid'];
			unset($json['is_global']);
			unset($json['is_active']);
            $model = Template::create($json);
        }
            
        // Try to create template screenshot
        if (!empty($json['screenshot_url']) && is_string($json['screenshot_url']) && strlen($json['screenshot_url'])) {
            try {
                $model->downloadScreenshot($json['screenshot_url']);
            } catch (\Exception $e) {
                Log::info('Error download screenshot for template '.$model->id. '. Details:' .$e->getMessage());
            }
        }
        return $model;
    }
    /**
     * Download image from url and attach as template screenshot
     * @param $template
     * @param $url
     */
    public function downloadScreenshot($url)
    {
        $storage = Storage::disk('screenshot');
        $contents = file_get_contents($url);
        $storage->put('templates'.DIRECTORY_SEPARATOR.$this->id.'.jpg', $contents);
    }
    /**
     * Take screenshot of this template and save to disk
     */
    public function takeScreenshot()
    {
        $storage = Storage::disk('screenshot');
        $path = $storage->path('templates'.DIRECTORY_SEPARATOR.$this->id.'.jpg');
        \Spatie\Browsershot\Browsershot::url($this->view_url)->save($path);
    }
    public function getScreenshotStorage()
    {
        return Storage::disk('screenshot')->path('templates'.DIRECTORY_SEPARATOR.$this->id.'.jpg');
    }
    public function canEdit()
    {
        $user = auth()->user();
        if ($user->can('manage_template')) {
            return true;
        }
        if ($this->is_global == 0) {
            return $this->owner_id == $user->id;
        }
        return false;
    }
	
	public function histories()
    {
        return $this->hasMany('App\Models\TemplateHistory', 'template_id');
    }
}
