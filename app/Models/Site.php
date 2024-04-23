<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use DB;
use Storage;
use Dyrynda\Database\Support\GeneratesUuid;
use Dialect\Gdpr\Anonymizable;
use Dialect\Gdpr\Portable;

/**
 * Class Site
 * @package App\Models
 */
class Site extends Model
{
    use GeneratesUuid;
    use Anonymizable;
    use Portable;
    
    protected $guarded = [];
    protected $with = ['owner'];
    protected $dates = ['created_at', 'updated_at'];
    protected $appends = ['preview_url','view_url', 'edit_url', 'export_url', 'unique_users', 'conversion_rate'];
    protected $fillable = ['name', 'owner_id', 'theme'];
    protected $gdprWith = ['variants'];
    protected $gdprAnonymizableFields = [
        'name', 'structure'
    ];
    
	
	
	
	
    public function getViewUrlAttribute()
    {
        return route('viewSiteRoute', ['account'=>$this->uuid]);
    }
    public function getExportUrlAttribute()
    {
        return route('exportProjectRoute', ['account'=>$this->uuid]);
    }
    public function getPreviewUrlAttribute()
    {
        return route('previewSiteRoute', ['account'=>$this->uuid]);
    }
    public function getEditUrlAttribute()
    {
        return route('editChampionVariantRoute', ['account'=>$this->uuid]);
    }
    public function owner()
    {
        return $this->belongsTo('App\Models\User', 'owner_id');
    }
    public function domains()
    {
        return $this->hasMany('App\Models\SiteDomain', 'site_id');
    }
    public function variants()
    {
        return $this->hasMany('App\Models\Page', 'site_id');
    }
    public function visits()
    {
        return $this->hasMany('App\Tracking\Models\Visit', 'site_id');
    }
    public function conversions()
    {
        return $this->hasMany('App\Tracking\Models\Conversion', 'site_id');
    }
    public function getUniqueUsersAttribute()
    {
        if (empty($this->visits_count)) {
            return 0;
        }
        return \App\Tracking\Models\Visit::where('site_id', $this->id)->distinct(['visitor_id', 'page_id'])->count(['visitor_id', 'page_id']);
    }
    public function getConversionRateAttribute()
    {
        if (empty($this->visits_count)) {
            return 0;
        }
        return ($this->unique_users > 0 ? round($this->conversions_count/ $this->unique_users, 4) * 100 : 0);
    }
    public function isExpired()
    {
        $owner = User::where('id', $this->owner_id)->first();
        if (isset($owner)) {
            return $owner->isExpired();
        }
        return false;
    }
    public function getStorage()
    {
        return Storage::disk('sites');
    }
    public function delete(array $options = [])
    {
        Page::where('site_id', $this->id)->forceDelete();
        SiteDomain::where('site_id', $this->id)->delete();
		PageHistory::where('site_id', $this->id)->delete();
        \App\Tracking\Models\Visit::where('site_id', $this->id)->delete();
        \App\Tracking\Models\Conversion::where('site_id', $this->id)->delete();
        Storage::disk('sites')->deleteDirectory($this->id);
        Storage::disk('sites')->deleteDirectory($this->id);
        parent::delete();
    }
    public function getStyleContent()
    {
        $style = $this->getStorage()->get($this->id.'/css/themes.css');
        $style = str_replace('!important', '', $style);
        return $style;
    }
	public function clearAnalyticData()
    {
		\App\Tracking\Models\Visit::where('site_id', $this->id)->delete();
		\App\Tracking\Models\Conversion::where('site_id', $this->id)->delete();
		return true;
	}
}
