<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;

class LinkBlock extends Button
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $tag = 'a';
    protected $config = [];
    protected $view = 'widgets.box';
    public function view()
    {
        $content = "";
        $modules = array_get($this->config, 'modules', []);
        foreach ($modules as $module) {
            $content.= $this->renderChildModule($module);
        }
        return $content;
    }
}
