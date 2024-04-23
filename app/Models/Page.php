<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use DB;
use Illuminate\Database\Eloquent\SoftDeletes;
use Storage;
use Dyrynda\Database\Support\GeneratesUuid;
use Dialect\Gdpr\Anonymizable;
use Dialect\Gdpr\Portable;

class Page extends Model
{
    use SoftDeletes;
    use GeneratesUuid;
    use Anonymizable;
    use Portable;
    
    protected $table = 'pages';
    protected $dates = ['deleted_at'];
    protected $appends = ['view_url', 'edit_url', 'unique_users', 'conversion_rate'];
    protected $fillable = ['name', 'site_id', 'category', 'structure', 'variant', 'title', 'description', 'keywords', 'weight'];
    protected $gdprAnonymizableFields = [
        'name', 'structure'
    ];
    
	
	protected static function boot()
	{
		parent::boot();

		self::deleting(function ($model) {
			if ($model->forceDeleting){
				$model->histories()->delete();
				$model->conversions()->delete();
				$model->visits()->delete();
			}
		});
	}
    public function getViewUrlAttribute()
    {
        return route('viewVariantRoute_full', ['account'=>$this->uuid]);
    }
    public function getEditUrlAttribute()
    {
        return route('editSiteRoute', ['account'=>$this->uuid]);
    }
    public function visits()
    {
        return $this->hasMany('App\Tracking\Models\Visit', 'page_id');
    }
    public function conversions()
    {
        return $this->hasMany('App\Tracking\Models\Conversion', 'page_id');
    }
	public function histories()
    {
        return $this->hasMany('App\Models\PageHistory', 'page_id');
    }
    public function parentSite()
    {
        return $this->belongsTo('App\Models\Site', 'site_id');
    }
    public function parent_site()
    {
        return $this->belongsTo('App\Models\Site', 'site_id');
    }
    public function getUniqueUsersAttribute()
    {
        if (empty($this->visits_count)) {
            return 0;
        }
        return \App\Tracking\Models\Visit::where('page_id', $this->id)->distinct(['visitor_id'])->count(['visitor_id']);
    }
    public function getConversionRateAttribute()
    {
        if (empty($this->visits_count)) {
            return 0;
        }
        return ($this->unique_users > 0 ? round($this->conversions_count/ $this->unique_users, 4) * 100 : 0);
    }
    public function getPageStructure()
    {
        $storage = Storage::disk('sites');
        $jsonStructureFilePath = $this->site_id. DIRECTORY_SEPARATOR. $this->id.'.json';
        $pageStructure = [];
        if ($storage->exists($jsonStructureFilePath)) {
            $pageStructure = $storage->get($jsonStructureFilePath);
            // Decode JSON to Array
            $pageStructure = json_decode($pageStructure, true);
        //Convert Array to HTML base on template type
        } elseif (!empty($this->structure)) {
            try {
                $pageStructure = unserialize($this->structure);
            } catch (\Exception $e) {
                $pageStructure = [];
            }
        }
        return $pageStructure;
    }
    
    public function getExportedData()
    {
        $structure = $this->getPageStructure();
        app('app.widget')->setVariant($this);
        return app('app.widget')->getExportedData('page', $structure);
    }
    public function findModule($structure, $page_id)
    {
        return app('app.widget')->findModule('page', $structure, $page_id);
    }
   
    public function save(array $options = [])
    {
        if (empty($this->id)) {
            $structure = $this->getPageStructure();
            $defaultSettings = [
                'pageProperties'=>[
                    'settings'=>[
                        'conversion_goals'=>[
                            'form_submission'=>true
                        ]
                    ]
                ]
            ];
            if (is_array($structure)) {
                $structure = recursive_array_merge($structure, $defaultSettings);
            }
            $this->structure = serialize($structure);
        }
        parent::save($options);
    }
}
