<?php
namespace Modules\Builder\Theme\Processor;

use Illuminate\Database\Eloquent\Model;
use Str;

class Base
{
    protected $basePath;
    protected $default_config = [];
    
    public function __construct($basePath)
    {
        $this->basePath = $basePath;
    }
    public function getPath($path = "")
    {
        return base_path($this->basePath).'/'.$path;
    }
    public function getURL($path = "")
    {
        return url($this->basePath).$path;
    }
    public function getConfig()
    {
        $path = $this->getPath('/config.php');
        $config = [];
        if (file_exists($path)) {
            $config = @include($path);
        }
        $config = array_merge($this->default_config, $config);
        return $config;
    }
    public function getAllConfig()
    {
        return $this->getConfig();
    }
    public function compileString($style)
    {
    }
    public function compileTheme($variant = '', $extra = '')
    {
        if (!is_string($variant)) {
            if ($variant instanceof \App\Models\Page) {
                $variant = $variant->variant;
            } else {
                $variant = "";
            }
        }
        $style = $this->getThemeCSS($variant);
        $style .= $extra;
        $style = $this->compileString($style);
       
        return $style;
    }
    public function getThemeCSS($variant = false)
    {
        return '';
    }
    public function getColorList()
    {
        $path = $this->getPath('/colors.php');
        if (file_exists($path)) {
            return include($path);
        }
        return [];
    }
    public function getMainColors()
    {
        $config = $this->getConfig();
        $colorSchemes = array_get($config, 'colorSchemes.mainColors');
        return $colorSchemes;
    }
    protected function getVariablePrefix()
    {
        return '';
    }
    public function getColorPaletteCSS()
    {
        $content = "";
        $colors = $this->getColorList();
        $variablePre = $this->getVariablePrefix();
        
        $colorPalettePrefixes = [
            'text'=>'color',
            'background'=>'background-color',
            'border'=>'border-color',
            
        ];
        foreach ($colors as $color) {
            $name = $variablePre.$color;
            foreach ($colorPalettePrefixes as $j => $value) {
                $content .= "\n." . $j . "-" . $color . "{" . $value . ":" . $name . " !important}";
            }
        }
        
        $colorPalettePrefixes = [
            
            'ql-text'=>'color',
            'ql-background'=>'background-color',
            'ql-border'=>'border-color'
        ];
        foreach ($colors as $color) {
            $name = $variablePre.$color;
            foreach ($colorPalettePrefixes as $j => $value) {
                $content .= "\n." . $j . "-" . camel_case($color) . "{" . $value . ":" . $name . " !important}";
            }
        }
        
        return $content;
    }
    protected function stripAllVariablePrefix($name)
    {
        $prefixes = ['$', '@', '--'];
        foreach ($prefixes as $prefix) {
            if (Str::startsWith($name, $prefix)) {
                $name = substr($name, strlen($prefix));
            }
        }
        return $name;
    }
    public function getColors()
    {
        $path = $this->getPath('colorscheme.json');
        $content = file_get_contents($path);
        $json = json_decode($content);
        return $json;
    }
}
