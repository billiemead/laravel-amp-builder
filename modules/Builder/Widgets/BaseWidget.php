<?php
namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;
use Route;

class BaseWidget extends AbstractWidget
{
    protected $offset;
    protected $data;
    protected $view;
    protected $type;
    protected static $styles = [];
    protected static $resolutions;
    protected static $tools;
    protected static $base_font_size = 16;
    protected static $currentVariant;
    protected static $scripts = [];
    protected $tag = 'div';
    
    public function begin()
    {
        $this->compileOffset();
        $this->compileStyles();
        $content = $this->beginTag();
        $content .= $this->afterBeginTag();
        $content .= $this->view();
        return $content;
    }
   
    public function getAMPTag()
    {
        $amp_layout = array_get($this->config, 'amp_layout');
        
        if (isset($amp_layout)) {
            $amp_layout = $this->availableAMPTags($amp_layout);
            
            foreach ($amp_layout as $i => $k) {
                $arr[] = $i.'="'.$amp_layout[$i].'"';
            }
            return implode(' ', $arr);
        }
    }
    public function isViewMode()
    {
        $viewRoutes = ['viewSiteRoute', 'viewVarianRoute', 'viewVariantRoute_full', 'viewSiteTemplateRoute', 'viewTemplateRoute', 'subdomainRoute', 'customDomainNonePathRoute', 'customDomainWithPathRoute', 'exportProjectRoute', 'viewVariantHistoryRoute_full', 'viewTemplateHistoryRoute_full'];
        $routeName = Route::currentRouteName();
        if (!empty($routeName) && (array_search($routeName, $viewRoutes) !== false)) {
            return true;
        }
        return false;
    }
   
    public function run()
    {
        return $this->begin().$this->end();
    }
    protected function afterBeginTag()
    {
        return "";
    }
    protected function beforeEndTag()
    {
        return "";
    }
    protected function getSelector()
    {
        $classAttribute = array_get($this->config, 'classAttribute');
        if (!empty($classAttribute) && is_array($classAttribute)) {
            $classAttribute = array_get($classAttribute, 'class');
        }
        if (!empty($classAttribute)) {
            return '.module.'.$this->getType().'.c_'.$classAttribute;
        }
        $id = $this->uniqueId();
        return "#$id";
    }
    public function getElementClass()
    {
        $type = $this->getType();
        $classAttribute = array_get($this->config, 'classAttribute');
        if (!empty($classAttribute) && is_array($classAttribute)) {
            $classAttribute = array_get($classAttribute, 'class');
        }
        $class = "module ".$type;
        if (!empty($classAttribute)) {
            $class = "module ".$type.' c_'.$classAttribute;
        }
        return $class;
    }
    protected function checkBackgroundGradientEnabled($styles)
    {
        $bg = array_get($styles, 'background-gradient');
        $colorStops = array_get($bg, 'colorStops');
        if (empty($colorStops)) {
            return false;
        }
        if (!is_array($colorStops) || sizeof($colorStops) < 1) {
            return false;
        }
        return true;
    }
    protected function compileStyles()
    {
        $styles = array_get($this->config, 'styles');
        $this->_compileStyles($styles, $this->getSelector());
        $this->compileOverrideStyles();
        $this->compileItemsStyles();
    }
    protected function compileItemsStyles()
    {
        $styles = array_get($this->config, 'item_styles');
        
        if (empty($styles)) {
            return;
        }
        $info = self::getWidgetInfo($this->getType());
        if (empty($info) || !is_array($info)) {
            return;
        }
        $children = array_get($info, 'children');
        if (empty($children) || !is_array($children)) {
            return;
        }
        foreach ($children as $name => $item) {
            $style = array_get($styles, $name);
            
            if (empty($style)) {
                continue;
            }
            $separator = ' ';
            if (startsWith($item, ':')) {
                $separator = '';
            }
            $selector = $this->getSelector().$separator. $item;
            if (!empty($style['main'])) {
                $this->_compileStyles($style['main'], $selector);
            }
            if (!empty($style['override']) && is_array($style['override'])) {
                $override_styles = $style['override'];
                foreach ($override_styles as $resolution => $item_styles) {
                    $style = $this->__getStyles($item_styles, $selector);
                    if (!empty($style)) {
                        app('app.widget')->registerStyle($selector, $style, $resolution);
                    }
                }
            }
        }
    }
    protected function compileOverrideStyles()
    {
        $override_style = array_get($this->config, 'override_style');
        $selector = $this->getSelector();
        if (is_array($override_style) && !empty($override_style)) {
            foreach ($override_style as $resolution => $styles) {
                $style = $this->__getStyles($styles, $selector);
                if (!empty($style)) {
                    app('app.widget')->registerStyle($selector, $style, $resolution);
                }
            }
        }
    }
    protected function pxToRem($value, $base = 16)
    {
        return false;
        if (is_string($value)) {
            $value = floatval($value);
        }
        return ($value / $base) * 1;
    }
    protected function isUnit($value)
    {
        return is_string($value) && ends_with($value, 'px');
    }
    protected function _compileStyles($styles, $selector)
    {
        $style = $this->__getStyles($styles, $selector);
        if (!empty($style)) {
            app('app.widget')->registerStyle($selector, $style, false);
        }
    }
    protected function __getStyles($styles, $selector)
    {
        if (empty($styles)) {
            return "";
        }
        $parser = new utils\CSS\Parser();
        $rules = $parser->parse($styles);
        if (empty($rules)) {
            return "";
        }
        $style = [];
        foreach ($rules as $rule) {
            foreach ($rule as $property=>$value) {
                $style[$property] = $value;
            }
        }
        return $style;
    }
   
    protected function compileOffset()
    {
    }
    
    public function getWidth()
    {
        return array_get($this->config, 'offset.mobile.width');
    }
    public function getHeight()
    {
        return array_get($this->config, 'offset.mobile.height');
    }
    protected function getOffsetString($offset)
    {
        $id = $this->uniqueId();
        $offsetString = "#$id {";
        $converts = [
            'top'=>'margin-top',
            'left'=>'margin-left'
        ];
        foreach ($offset as $key => $value) {
            $unit = 'px';
            $rem_value = $this->pxToRem($value);
            if (is_numeric($rem_value)) {
                $value = $rem_value;
                $unit = 'rem';
            }
            $offsetString .= $key.":".$value.$unit.';';
        }
        $offsetString .= "}";
        return $offsetString;
    }
    protected function compileVisibility()
    {
    }
    
    
    
    protected function scriptDataTag()
    {
        if (!$this->isViewMode()) {
            return "<script type=\"text/json\" id=\"".$this->uniqueId()."_data\">".json_encode($this->config).'</script>';
        }
        return "";
    }
    protected function getType()
    {
        $class = (new \ReflectionClass($this))->getShortName();
        $class = snake_case($class);
        return $class;
    }
    protected function uniqueId()
    {
        $id = array_get($this->config, 'id');
        return $id;
    }
    protected function beginTag()
    {
        $id = $this->uniqueId();
        $type = $this->getType();
        $class = $this->getElementClass();
        $tag = $this->tag;
        return "<$tag id=\"$id\" class=\"$class\" data-type=\"$type\">";
    }
    public function renderChildModule($module)
    {
        $type = array_get($module, 'type');
        $content = app('app.widget')->begin($type, $module);
        
        $content .= app('app.widget')->end($type, $module);
        return $content;
    }
    protected function view()
    {
        try {
            $data = array_get($this->config, 'data');
            return view('builder::'.$this->view, [
                'widget' => $this,
                'config' => $this->config,
                'data' => $data,
            ])->render();
        } catch (\Exception $e) {
            if (config('app.debug')) {
                throw $e;
            }
            return "<div style='display:none'>".$e->getTraceAsString()."</div>";
        }
        return '';
    }
    
     
    public function end()
    {
        return $this->beforeEndTag().$this->endTag().$this->scriptDataTag();
    }
    public function findModule($page_id)
    {
        if ($this->getPage_id() == $page_id) {
            return $this;
        }
    }
    protected function endTag()
    {
        return "</$this->tag>";
    }
    public function getPage_id()
    {
        return $this->uniqueId();
    }
    public function getModuleType()
    {
        $type = array_get($this->config, 'type');
        return $type;
    }
    public static function getVariant()
    {
        return self::$currentVariant;
    }
    public static function setVariant($variant)
    {
        self::$currentVariant = $variant;
    }
    public function getExportedData()
    {
        return $this->config;
    }
    
    protected function getResolutions()
    {
        return app('app.widget')->getResolutions();
    }
    protected function getWidgetInfo($type)
    {
        return app('app.widget')->getWidgetInfo($type);
    }
   
    
    protected function isFullyResponsive()
    {
        return app('app.widget')->isFullyResponsive();
    }
   
    protected function toMediaRule($resolution)
    {
        return app('app.widget')->toMediaRule($resolution);
    }
    protected function availableAMPTags($amp_layout)
    {
        $layout = array_get($amp_layout, 'layout');
        unset($amp_layout['ratio']);
        if ($layout == 'responsive') {
            $amp_layout['width'] = 100;
            $amp_layout['height'] = array_get($this->config, 'amp_layout.ratio', 100);
        }
        if ($layout == 'fixed-height') {
            unset($amp_layout['width']);
        }
        return $amp_layout;
    }
}
