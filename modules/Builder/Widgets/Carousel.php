<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;
use Carbon\Carbon;

class Carousel extends Text
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.carousel';
    
    public function findModule($page_id)
    {
        if ($this->getPage_id() == $page_id) {
            return $this;
        }
        $slides = array_get($this->config, 'slides', []);
        $data = array_get($this->config, 'data');
        $images = array_get($data, 'images', []);
        for ($i = 0; $i < sizeof($images); $i++) {
            $image = $images[$i];
            $modules = array_get($slides, $i, []);
            foreach ($modules as $module) {
                $type = array_get($module, 'type');
                $rs = app('app.widget')->findModule($type, $module, $page_id);
                if (!empty($rs)) {
                    return $rs;
                }
            }
        }
    }
    public function getAttributeTag()
    {
        $rs = "";
        if ($this->isViewMode()) {
            $data = array_get($this->config, 'data');
            $attributes = ['autoplay'=>false, 'delay'=>true, 'loop'=>false];
            foreach ($attributes as $attribute => $tag) {
                $value = array_get($data, $attribute);
                if (!empty($value)) {
                    $rs.= ' '.$attribute.($tag ? '='.''.$value : '');
                }
            }
        }
        return $rs;
    }
}
