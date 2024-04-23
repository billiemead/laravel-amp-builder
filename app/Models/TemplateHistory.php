<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use DB;
use Illuminate\Database\Eloquent\SoftDeletes;
use Storage;
use Dyrynda\Database\Support\GeneratesUuid;
use Dialect\Gdpr\Anonymizable;
use Dialect\Gdpr\Portable;

class TemplateHistory extends Model
{
    use GeneratesUuid;
    use Anonymizable;
    use Portable;
    
    protected $table = 'templates_histories';
	
	protected $casts = [
        'created_at' => 'datetime',
    ];
  
    protected $appends = ['view_url'];
    public function getViewUrlAttribute()
    {
        return route('viewTemplateHistoryRoute_full', ['page_uuid'=>$this->uuid]);
    }
	
	public function template()
	{
		return $this->belongsTo('App\Models\Template', 'template_id');
	}
   
}
