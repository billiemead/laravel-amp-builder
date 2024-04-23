<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;
use File;

class AmpList extends BaseWidget
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    //protected $tag = "amp-img";
    protected $view = 'widgets.list';
    public function getRealPath($url)
    {
        $isUrl = starts_with($url, 'http://') || starts_with($url, 'https://');
        if ($isUrl) {
            return $url;
        }
        $path = base_path($url);
        if (File::exists($path)) {
            return url('/').$url;
        }
        return $url;
    }
    public function lightboxMode()
    {
        return array_get($this->config, 'data.lightbox');
    }
}
