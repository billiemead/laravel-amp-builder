<?php

namespace Modules\Builder\Factories;

use Modules\Builder\Widgets\BaseWidget;
use Modules\Builder\Widgets\Page;

class WidgetFactory extends \Arrilot\Widgets\Factories\WidgetFactory
{
    protected $structure = [];
    protected static $styles = [];
    
    protected static $custom_css = [];
    protected static $resolutions;
    protected static $tools;
    protected static $scripts = [];
    protected static $colorScheme;
    public function setStructure($structure)
    {
        $this->structure = $structure;
    }
    
    
    public function run()
    {
        $args = func_get_args();
        $rs = $this->instantiateWidget($args);
        if ($rs == false) {
            return "";
        }

        $content = $this->getContentFromCache($args);

        if ($timeout = (float) $this->getReloadTimeout()) {
            $content .= $this->javascriptFactory->getReloader($timeout, $this->widget->encryptParams);
            $content = $this->wrapContentInContainer($content);
        }

        return $this->convertToViewExpression($content);
    }
    public function begin()
    {
        $args = func_get_args();
        $rs = $this->instantiateWidget($args);
        
        if ($rs === false) {
            return "";
        }
        $content = $this->getBeginContent($args);
        if ($timeout = (float) $this->getReloadTimeout()) {
            $content .= $this->javascriptFactory->getReloader($timeout, $this->widget->encryptParams);
            $content = $this->wrapContentInContainer($content);
        }

        return $this->convertToViewExpression($content);
    }
    
    public function end()
    {
        $args = func_get_args();
        $rs = $this->instantiateWidget($args);
        if ($rs === false) {
            return "";
        }
        $content = $this->getEndContent($args);
        if ($timeout = (float) $this->getReloadTimeout()) {
            $content .= $this->javascriptFactory->getReloader($timeout, $this->widget->encryptParams);
            $content = $this->wrapContentInContainer($content);
        }

        return $this->convertToViewExpression($content);
    }
    protected function getBeginContent()
    {
        $content = $this->app->call([$this->widget, 'begin'], $this->widgetParams);

        return is_object($content) ? $content->__toString() : $content;
    }
    protected function getEndContent()
    {
        $content = $this->app->call([$this->widget, 'end'], $this->widgetParams);

        return is_object($content) ? $content->__toString() : $content;
    }
    public function findModule()
    {
        $args = func_get_args();
        $rs = $this->instantiateWidget($args);
        if ($rs === false) {
            return "";
        }
        $id = $args[2];
        $content = $this->app->call([$this->widget, 'findModule'], [$id]);

        return $content;
    }
    public function getExportedData()
    {
        $args = func_get_args();
        $rs = $this->instantiateWidget($args);
        if ($rs === false) {
            return;
        }
        $content = $this->app->call([$this->widget, 'getExportedData'], $this->widgetParams);

        return $content;
    }
    public function registerScript($tag, $version = false)
    {
        if (!$version) {
            $version = config('amp.default_version');
        }
        $name = $tag.'-'.$version;
        if (!isset(self::$scripts[$tag])) {
            self::$scripts[$tag] = [];
        }
        $key = array_search($version, self::$scripts[$tag]);
        if ($key === false) {
            self::$scripts[$tag][] = $version;
        }
    }
    public function renderScript()
    {
        $branch = config('amp.default_branch');
        $default_template = config('amp.template.default');
        $base_script = config('amp.base_script');
        echo $base_script;
        foreach (self::$scripts as $tag => $versions) {
            foreach ($versions as $version) {
                $template = config('amp.template.'.$tag);
                if (!isset($template)) {
                    $template = $default_template;
                }
                $content = __($template, ['tag' => $tag, 'branch'=>$branch, 'version'=>$version]);
                echo $content;
            }
        }
    }
    public function renderFonts()
    {
        Page::renderFonts();
    }
    public function renderColors()
    {
        return Page::renderColors();
    }
    public function registerStyle($selector, $rules, $media)
    {
        if (!is_string($media)) {
            $media = self::getDefaultResolution();
        }
        if (!isset($media)) {
            return;
        }
        if (empty(self::$styles[$media])) {
            self::$styles[$media] = [];
        }
        if (empty(self::$styles[$media][$selector])) {
            self::$styles[$media][$selector] = [];
        }
        if (is_array($rules)) {
            self::$styles[$media][$selector] = array_merge($rules, self::$styles[$media][$selector]);
        } else {
        }
    }
	public function renderAMPBoileplateStyle()
    {
        echo '<style amp-boilerplate>';
		echo \File::get(public_path('assets/css/boilerplate/amp.css'));
		echo '</style>';
		
		echo '<noscript>';
		echo '<style amp-boilerplate>';
		echo \File::get(public_path('assets/css/boilerplate/noscript.css'));
		echo '</style>';
		echo '</noscript>';
    }
	public function renderCustomStyle($code)
    {
		if(!is_string($code) || empty($code))
			return;
        echo '<style amp-custom>';
		echo $code;
		echo '</style>';
    }
    public function renderStyle()
    {
        try {
			echo '<style amp-custom>';
			$this->doRenderStyle();
			echo '</style>';
        } catch (\Exception $e) {
            if (config('app.debug')) {
                throw $e;
            }
        }
    }
    protected function doRenderStyle()
    {
        $resolutions = self::getResolutions();
        if (empty($resolutions)) {
            return;
        }
        $style = "";
        foreach ($resolutions as $name => $value) {
            if (!empty(self::$styles[$name])) {
                $mediaRule = self::toMediaRule($value);
                $is_default = (empty($value['breakpoint']) || (!empty($value['default']) && $value['default'] == 1));
                if ($mediaRule !== false) {
                    $style .= $mediaRule.'{';
                }
                foreach (self::$styles[$name] as $selector => $styles) {
                    $style .=  $selector.'{';
                    if (is_array($styles)) {
                        foreach ($styles as $property => $value) {
                            if (is_string($value) && strlen($value)) {
                                $style .= $property.':'.$value.';';
                            }
                        }
                    }
                        
                    $style .= '}';
                }
                
                if ($mediaRule !== false) {
                    $style .= '}';
                }
            }
        }
        if (!empty(self::$custom_css)) {
            $style.= implode("\n", self::$custom_css);
        }
        $currentVariant = $this->getCurrentColorscheme();
        $style = app('app.theme')->compileTheme($currentVariant, $style);
        echo $style;
    }
    public function addCustomCSS($css)
    {
        self::$custom_css[] = $css;
    }
    
    public function setVariant($variant)
    {
        BaseWidget::setVariant($variant);
    }
    public function getVariant()
    {
        return BaseWidget::getVariant();
    }
    public function getCurrentColorscheme()
    {
        $currentVariant = $this->getColorscheme();
        
        if (empty($currentVariant)) {
            $currentVariant = $this->getVariant();
        }
        return $currentVariant;
    }
    public function getColorscheme()
    {
        return self::$colorScheme;
    }
    public function setColorscheme($name)
    {
        self::$colorScheme = $name;
    }
    protected function instantiateWidget(array $params = [])
    {
        try {
            return parent::instantiateWidget($params);
        } catch (\Exception $e) {
            if (config('app.debug')) {
                throw $e;
            }
            return false;
        }
    }
    public function toMediaRule($resolution)
    {
        $is_default = (empty($resolution['breakpoint']) || (!empty($resolution['default']) && $resolution['default'] == 1));
        if (!$is_default) {
            if (is_numeric($resolution['breakpoint'])) {
                return "\n\t".'@media only screen and (max-width: '.$resolution['breakpoint'].'px)';
            } elseif (is_array($resolution['breakpoint']) && sizeof($resolution['breakpoint']) == 2) {
                return "\n\t".'@media only screen and (min-width: '.$resolution['breakpoint'][0].'px) and (max-width:'.$resolution['breakpoint'][1].'px)';
            }
        }
        return false;
    }
    public function getDefaultResolution()
    {
        $resolutions = self::getResolutions();
        if (empty($resolutions)) {
            return;
        }
        foreach ($resolutions as $name => $value) {
            $is_default = (empty($value['breakpoint']) || (!empty($value['default']) && $value['default'] == 1));
            if ($is_default) {
                return $name;
            }
        }
    }
    public function getResolutions()
    {
        if (isset(self::$resolutions)) {
            return self::$resolutions;
        }
        $content = config('resolutions');
        self::$resolutions = $content;
        return self::$resolutions;
    }
    public function getWidgetInfo($type)
    {
        if (!isset(self::$tools)) {
            self::$tools = config('widgets');
        }
        
        $data = self::$tools;
        $info = array_get($data, 'tools.'.$type);
        return $info;
    }
    public function isFullyResponsive()
    {
        $resolutions = self::getResolutions();
        if (!empty($resolutions) && !empty($resolutions['desktop']) && isset($resolutions['desktop']['responsive'])) {
            return $resolutions['desktop']['responsive'] == 1;
        }
        return false;
    }
}
