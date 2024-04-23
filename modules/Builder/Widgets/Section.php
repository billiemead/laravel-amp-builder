<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;

class Section extends Box
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.section';
    protected $tag = "section";
    public function begin()
    {
        $this->compileOffset();
        $this->compileStyles();
        $content = $this->beginTag();
        $content .= $this->afterBeginTag();
        $content .= $this->view();
        return $content;
    }
    
    public function getWidth()
    {
        $resolutions = self::getResolutions();
        return array_get($resolutions, 'mobile.container_size');
    }
    public function getHeight()
    {
        return array_get($this->config, 'offset.mobile');
    }
   
    public function getElementClass()
    {
        //$type = $this->getType();
        $class = "section";
        return $class;
    }
    protected function afterBeginTag()
    {
        return '<div class="overlay"></div><div class="container">';
    }
    protected function beforeEndTag()
    {
        return "</div>";
    }
    protected function compileStyles()
    {
        parent::compileStyles();
        $fonts = array_get($this->config, 'fonts');
        if (!empty($fonts)) {
            Page::addFonts($fonts);
        }
    }
    public function findModule($page_id)
    {
        if ($this->getPage_id() == $page_id) {
            return $this;
        }
        $modules = array_get($this->config, 'data', []);
        foreach ($modules as $module) {
            $type = array_get($module, 'type');
            $rs = app('app.widget')->findModule($type, $module, $page_id);
            if (!empty($rs)) {
                return $rs;
            }
        }
    }
}
