<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;

class Page extends BaseWidget
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.page';
    public function begin()
    {
        self::loadResolutions();
        $variant = array_get($this->config, 'variant');
        if (!empty($variant)) {
            app('app.widget')->setColorscheme($variant);
        }
        $pageProperties = array_get($this->config, 'pageProperties', []);
        $seoAttrs = array_get($pageProperties, 'settings.seo', array());
        
        /*if (is_array($seoAttrs) && !empty($seoAttrs)) {
            $title = array_get($seoAttrs, 'title', '');
            $keywords = array_get($seoAttrs, 'keywords', '');
            
            $description = array_get($seoAttrs, 'description', '');
            
			$canonical_url = array_get($seoAttrs, 'canonical_url');
			
			$seoAttrs = ['title'=>$title, 'keywords'=>$keywords, 'description'=>$description];
			if(!empty($canonical_url)) {
				$seoAttrs['canonical_url'] = $canonical_url;
			}
        }
        */
        
        view()->share('pageSEO', $seoAttrs);
        $analytics = array_get($pageProperties, 'settings.analytics', array());
        view()->share('pageAnalytics', $analytics, array());
        
        $custom_css = array_get($pageProperties, 'settings.custom_css', array());
        view()->share('pageCustomCSS', $custom_css, array());
        
        $custom_html = array_get($pageProperties, 'settings.custom_html', array());
        view()->share('pageCustomHtml', $custom_html, array());
        $custom_scripts = array_get($pageProperties, 'settings.custom_scripts', array());
        view()->share('pageCustomJs', $custom_scripts, array());
        $this->compileStyles();
        return $this->view();
    }
    protected function scriptDataTag()
    {
        if (!$this->isViewMode()) {
            $pageProperties = array_get($this->config, 'pageProperties', []);
            return '<script type="text/json" id="body_data">'.json_encode($pageProperties).'</script>';
        }
        return "";
    }
    public function view()
    {
        $content = '';
        $sections = array_get($this->config, 'sections', []);
        $content.= '<div id="main_sections" class="section-container">';
        foreach ($sections as $section) {
            $content .= $this->compileSectionContentFromStructure($section);
        }
        $content.= '</div>';
        $content .= app('app.widget')->begin('popup-container', []);
        $popups = array_get($this->config, 'popups', []);
        foreach ($popups as $popup) {
            $content .= $this->compilePopupContentFromStructure($popup);
        }
        $globalPopups = $this->getGlobalPopup();
        
        if (!empty($globalPopups)) {
            foreach ($globalPopups as $popup) {
                $type = 'popup_global';
                $config = ['system_id'=>$popup->id];
                $content .= app('app.widget')->begin($type, $config);
               
                $content .= app('app.widget')->end($type, $config);
            }
        }
        $content .= app('app.widget')->end('popup-container', []);
        return $content;
    }
    public function findModule($page_id)
    {
        $sections = array_get($this->config, 'sections', []);
        $popups = array_get($this->config, 'popups', []);
        $modules = $sections + $popups;
        foreach ($modules as $module) {
            $type = array_get($module, 'type');
            $rs = app('app.widget')->findModule($type, $module, $page_id);
            if (!empty($rs)) {
                return $rs;
            }
        }
    }
    protected function getGlobalPopup()
    {
        $variant = self::getVariant();
        
        if (!empty($variant)) {
            $page = \App\Models\Page::find($variant)->first();
            $siteId = $page->site_id;
            $popups = \App\Models\Template::where('site_id', $siteId)->where('type', 'popup')->get();
            return $popups;
        }
    }
    protected function compileSectionContentFromStructure($section, $index = 'data')
    {
        $content = '';
        $type = array_get($section, 'type');
        if(is_null($type))
			$type = 'section';
        $content .= app('app.widget')->begin($type, $section);
       
        $content .= app('app.widget')->end($type, $section);
        return $content;
    }

    /**
     * @param $section
     * @param string $index
     * @return string
     */
    protected function compilePopupContentFromStructure($section)
    {
        $content = '';
        $type = array_get($section, 'type');
        if ($type == 'popup_global') {
            return '';
        }
		if(is_null($type))
			$type = 'popup';
        $content .= app('app.widget')->begin($type, $section);
       
        $content .= app('app.widget')->end($type, $section);
        
        return $content;
    }
    protected static function loadResolutions()
    {
        $content = config('resolutions');
        self::$resolutions = $content;
    }
    protected function registerColumnClass($name, $resolution)
    {
        $column_size = $resolution['columns'] * 1;
        $column_alias = $resolution['column-alias'];
        for ($i = 1;$i <= $column_size;$i++) {
            $class_name = '.'.$column_alias.$i;
            $container_size = (($i/$column_size) * 100).'%';
            app('app.widget')->registerStyle($class_name, ['width'=>$container_size], $name);
        }
    }
    protected function compileResolutions()
    {
        if (self::isFullyResponsive()) {
            $css = 'width:100%;';
            
            app('app.widget')->registerStyle('section .container', $css, 'desktop');
            return;
        }
        $resolutions = self::$resolutions;
        if (empty($resolutions)) {
            return;
        }
        
        foreach ($resolutions as $name => $value) {
            $container_size = array_get($value, 'container_size');
            if (is_numeric($container_size)) {
                $container_size.= 'px';
            }
            app('app.widget')->registerStyle('section .container', ['width'=>$container_size], $name);
            $popup_size = array_get($value, 'popup_size');
            if (is_numeric($popup_size)) {
                $popup_size.= 'px';
            }
            $this->registerColumnClass($name, $value);
            
            app('app.widget')->registerStyle('div.popup-section', ['width'=>$popup_size], $name);
            if (!empty($value['css'])) {
                app('app.widget')->registerStyle('div.popup-section', $value['css'], $name);
            }
        }
    }
    
    protected function getSelector()
    {
        return 'body';
    }
    public function end()
    {
        return $this->scriptDataTag();
    }
    protected static $colors;
    protected function compileColors()
    {
        $colors = array_get($this->config, 'pageProperties.colors');
        self::$colors = $colors;
    }
    
    public static function renderColors()
    {
        $colors = self::$colors;
        $result = "";
        if (!empty($colors)) {
            foreach ($colors as $color) {
                $result.= $color['name'].':'.$color['value'].";\n";
            }
        }
        app('app.widget')->addCustomCSS($result);
        return $result;
    }
    protected static $fonts = [];
    
    protected function compileFonts()
    {
        $fonts = array_get($this->config, 'pageProperties.fonts', []);
        self::$fonts = $fonts;
    }
    public static function addFonts($fonts)
    {
        self::$fonts = array_merge(self::$fonts, $fonts);
    }
    public static function renderFonts()
    {
        $fonts = self::$fonts;
        $googleFonts = file_get_contents(storage_path('/api-response.json'));
        $googleFonts = json_decode($googleFonts, true);
        if (!empty($fonts)) {
            foreach ($fonts as $font) {
                if (is_string($font) || $font['type'] == 'google') {
                    $font_name = (isset($font['name']) ? $font['name'] : $font);
                    $font_to_load = $font_name;
                    foreach ($googleFonts as $googleFont) {
                        if ($googleFont['family'] == $font_name) {
                            if (!empty($googleFont['variants'])) {
                                $variants = $googleFont['variants'];
                                $font_to_load.= ':'. implode(',', $variants).'|';
                            }
                            if (!empty($googleFont['subsets'])) {
                                $subsets =  $googleFont['subsets'];
                                $font_to_load.= ''. implode(',', $subsets);
                            }
                        }
                    }
                    echo '<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family='.urlencode($font_to_load).'">';
                }
            }
        }
    }
    protected function compileStyles()
    {
        $this->compileFonts();
        $this->compileResolutions();
        $this->compileColors();
        $this->config['styles'] = array_get($this->config, 'pageProperties.styles');
        parent::compileStyles();
    }
    
    public function getExportedData()
    {
        $sections = array_get($this->config, 'sections', []);
        for ($i = 0; $i < sizeof($sections); $i++) {
            $type = array_get($sections[$i], 'type');
            $structure = app('app.widget')->getExportedData($type, $sections[$i]);
            $sections[$i] = $structure;
        }
        $cpopups = array_get($this->config, 'popups', []);
        $popups = [];
        for ($i = 0; $i < sizeof($cpopups); $i++) {
            $type = array_get($cpopups[$i], 'type');
            if ($type == 'popup_global') {
                continue;
            }
            $structure = app('app.widget')->getExportedData($type, $cpopups[$i]);
            $popups[] = $structure;
        }
        $globalPopups = $this->getGlobalPopup();
        
        if (!empty($globalPopups)) {
            foreach ($globalPopups as $popup) {
                $type = 'popup_global';
                $config = ['system_id'=>$popup->id];
                $structure = app('app.widget')->getExportedData($type, $config);
                $popups[] = $structure;
            }
        }
        
        $this->config['sections'] = $sections;
        $this->config['popups'] = $popups;
        return $this->config;
    }
}
