<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;
use Carbon\Carbon;

class Slider extends Carousel
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.slider';
    protected function compileStyles()
    {
        parent::compileStyles();
        $styles = array_get($this->config, 'slider_styles');
        $this->_compileStyles($styles, $this->getSelector(). ' > amp-carousel > div > div > div > .inner_slide');
    }
    public function findModule($page_id)
    {
        if ($this->getPage_id() == $page_id) {
            return $this;
        }
        $modules = array_get($this->config, 'slides', []);
        foreach ($slides as $slide) {
            foreach ($slide as $module) {
                $type = array_get($module, 'type');
                $rs = app('app.widget')->findModule($type, $module, $page_id);
                if (!empty($rs)) {
                    return $rs;
                }
            }
        }
    }
}
