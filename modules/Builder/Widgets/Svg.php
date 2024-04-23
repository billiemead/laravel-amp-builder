<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;
use File;
use Illuminate\Support\Facades\Cache;
use Modules\Builder\Widgets\traits\Button as ButtonTrait;

class Svg extends BaseWidget
{
    use ButtonTrait;
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $tag = 'a';
    protected $view = 'widgets.svg';
    protected static $cacheCodes = [];
    
    
    protected static function isSelfUrl($url)
    {
        $isUrl = starts_with($url, 'http://') || starts_with($url, 'https://');
        $app_url = config('app.url');
        $isSelfUrl = $isUrl && starts_with($url, $app_url);
        return $isSelfUrl;
    }
    public static function getSVGContent($url, $getFromCache = true)
    {
        $cacheKey = 'svg.'.$url;
        if ($getFromCache && Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }
        
        $isUrl = starts_with($url, 'http://') || starts_with($url, 'https://');
        $isSelfUrl = self::isSelfUrl($url);
        $app_url = config('app.url');
        $path = "";
        if ($isSelfUrl) {
            $realUrl = substr($url, strlen($app_url));
            $path = public_path($realUrl);
        }
        if (!$isUrl) {
            $path = base_path($url);
        }
        
        $content = false;
        if (!empty($path) && File::exists($path)) {
            $content = File::get($path);
        } elseif (starts_with($url, 'http://')) {
            $content = file_get_contents($url);
        } elseif (starts_with($url, 'https://')) {
            $content = file_get_contents_curl($url);
        }
        
        if ($content != false) {
            $cacheTimeout = config('cache.svg_cacheTimeout', 2* 60 * 60);
            Cache::add($cacheKey, $content, $cacheTimeout);
            return $content;
        }
            
        return false;
    }
    public function parseSVG($url)
    {
        try {
            $content = self::getSVGContent($url);
            
            return $content;
        } catch (\Exception $e) {
        }
    }
    protected function cacheSVGCode($url, $code)
    {
        self::$cacheCodes[$url] = $code;
    }
    protected function getCodeFromInlineCache($url)
    {
        if (!empty(self::$cacheCodes[$url])) {
            return self::$cacheCodes[$url];
        }
    }
    public function getCode()
    {
        $code = array_get($this->config, 'data.code');
        $url = array_get($this->config, 'data.src');
        if (isset($code)) {
            $this->cacheSVGCode($url, $code);
            return $code;
        }
        $cache = $this->getCodeFromInlineCache($url);
        if (!empty($cache)) {
            return $cache;
        }
        return $this->parseSVG($url);
    }
    public function getFetchUrl()
    {
        $url = array_get($this->config, 'data.src');
        if ($this->checkCorsURL($url)) {
            return $url;
        }
        return url('file/icon').'?type=list&url='.$url;
    }
    protected function checkCorsURL($url)
    {
        $cors_servers = config('cors.cors_servers');
        $cors_servers[] = url('/');
        foreach ($cors_servers as $server) {
            if (starts_with($url, $server)) {
                return true;
            }
        }
    }
}
