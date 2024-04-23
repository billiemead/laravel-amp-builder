<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use DB;
use Dialect\Gdpr\Anonymizable;

class SiteDomain extends Model
{
    use Anonymizable;

    protected $table = 'site_domains';
    protected $fillable = ['name', 'site_id', 'subdomain', 'secured', 'path'];
    protected $appends = ['view_url'];
    
    
    public function getViewUrlAttribute()
    {
        return $this->getUrl(true, true);
    }
    public function getDomainAttribute()
    {
        return $this->getUrl(true);
    }
    public function getUrl($include_scheme = false, $include_path = false)
    {
        $app_url = config('app.url');
        $url_parts = parse_url($app_url);

        if ($this->subdomain == 1) {
            $host = $this->name.'.'.config('publishing.subdomain.domain');
            if (config('publishing.subdomain.secured')) {
                $url_parts['scheme'] = 'https';
            } else {
                $url_parts['scheme'] = 'http';
            }
        } else {
            $host = $this->name;
            if ($this->secured) {
                $url_parts['scheme'] = 'https';
            } else {
                $url_parts['scheme'] = 'http';
            }
            if (!empty($this->path)) {
                $url_parts['site_path'] = '/'.$this->path;
            }
        }
        if (empty($url_parts['scheme'])) {
            $url_parts['scheme'] = 'http';
        }
        $url_parts['host'] = $host;
        
        $result =  $url_parts['host'];
        if ($include_scheme) {
            $result =  $url_parts['scheme'].'://'.$result;
        }
        if ($include_path) {
            $result .= (isset($url_parts['path'])? $url_parts['path']: '').(isset($url_parts['site_path'])? $url_parts['site_path']: '');
        }
        return $result;
    }
}
