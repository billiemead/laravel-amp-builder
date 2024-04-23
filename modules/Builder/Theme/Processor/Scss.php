<?php
namespace Modules\Builder\Theme\Processor;

use Illuminate\Database\Eloquent\Model;

class Scss extends Base
{
    protected $compress = false;
    public function __construct($base_path)
    {
        parent::__construct($base_path);
        $this->compress = !config('app.debug');
    }
    public function getAllConfig()
    {
        $config = parent::getAllConfig();
        $use_css_variable = config('builder.use_css_variable');
        $config['use_css_variable'] = $use_css_variable;
        if (!$use_css_variable) {
            $config['preload'] = $this->preloadTheme();
        } else {
            $config['preload'] = $this->compileTheme();
            $config['css_variable'] = $this->parseAllCSSVariables();
        }
        
        $config['colors'] = $this->getColorList();
        
        $config['colorPaletteCSS'] = $this->getColorPaletteCSS();
        
        $themeColorLists = $this->getcolorSchemesList();
        $config['colorList'] = $themeColorLists;
        return $config;
    }
    public function getcolorSchemesList($nameOnly = false)
    {
        $result = [];
        $path = $this->getPath('/colorSchemes.php');
        if (file_exists($path)) {
            $schemeList = @include($path);
            $config = $this->getConfig();
            $variantPath = array_get($config, 'colorSchemes.variantPath', 'variants');
            $css_preprocessor = array_get($config, 'css_preprocessor');
            if (!empty($css_preprocessor)) {
                foreach ($schemeList as $scheme) {
                    $path = $this->getPath($variantPath.'/'.$scheme.'.'.$css_preprocessor);
                    if (file_exists($path)) {
                        if (!$nameOnly) {
                            $result[$scheme] = file_get_contents($path);
                        } else {
                            $result[] = $scheme;
                        }
                    }
                }
            }
        }
        return $result;
    }
    
    public function compileString($style)
    {
        $themePath = $this->getPath();
        if (extension_loaded('sass')) {
            preg_match_all('/@import.*?"(.+?)".*?/ms', $style, $matches);
            $matches = $matches[1];
            if (! empty($matches)) {
                foreach ($matches as $url) {
                    $replace = $themePath.($url);
                    $replace = addslashes($replace);
                    $style = str_replace('"'.$url.'"', '"'.$replace.'"', $style);
                }
            }
            $sass = new \Sass();
            if ($this->compress) {
                $sass->setStyle(\Sass::STYLE_COMPRESSED);
            }

            $time_start = microtime(true);
            $style = $sass->compile($style);
        } else {
			if(class_exists('\ScssPhp\ScssPhp\Compiler')) {
				$compileClass = \ScssPhp\ScssPhp\Compiler::class;
				$compressedFormatterClass = \ScssPhp\ScssPhp\Formatter\Compressed::class;
			}
			else{
				$compileClass = \Leafo\ScssPhp\Compiler::class;
				$compressedFormatterClass = \Leafo\ScssPhp\Formatter\Compressed::class;
			}
				
			
            $scss = new $compileClass();
            $scss->setImportPaths($themePath);
            if ($this->compress) {
                $scss->setFormatter($compressedFormatterClass);
            }
			try{
				$style = $scss->compile($style);
			}
			catch(\Exception $e) {
				$style = "";
				if(config('app.debug'))
					throw $e;
			}
			
        }
        $style = str_replace('!important', '', $style);
        return $style;
    }
    public function generateCSSVariableBlock()
    {
        $content = "";
        $colors = $this->getColorList();
        $mainColors = $this->getMainColors();
        $content .= ":root {";
        $variablePre = $this->getVariablePrefix();
        $colors = array_merge($mainColors, $colors);
        foreach ($colors as $color) {
            $name = $variablePre.$color;
            $content .= "\n". "--" . $color .  ":" . $name . ";";
        }
        $content .= "}";
        return $content;
    }
    
    public function parseAllCSSVariables()
    {
        $css = '';
        $config = $this->getConfig();
        $colorSchemes = array_get($config, 'colorSchemes');
        $themePath = $this->getPath();
        if (is_array($colorSchemes)) {
            $variantPath = array_get($colorSchemes, 'variantPath');
            $colorPath = array_get($colorSchemes, 'colorPath');
            $colorPath = $this->getPath($colorPath);
            if (file_exists($colorPath)) {
                $css .= file_get_contents($colorPath);
            }
        }
        $css .= "\n".$this->generateCSSVariableBlock();
        return $css;
    }
    
    public function getThemeCSS($variant = false)
    {
        $config = $this->getConfig();
        $mainStylePath = array_get($config, 'mainStylePath');
        $mainStylePath = trim($mainStylePath, '/');
        $file = $this->getURL($mainStylePath);
        $themePath = $this->getPath();
        $file = $this->getPath($mainStylePath);
        $style = "";
        $style .= file_get_contents($file);
        $colorSchemes = array_get($config, 'colorSchemes');
        if (is_array($colorSchemes)) {
            $variant = $this->getVariantContent($variant);
            if (empty($variant)) {
                $defaultScheme = array_get($colorSchemes, 'defaultScheme');
                $variant = $this->getVariantContent($defaultScheme);
            }
            $style .= $variant;
            $style = '$theme_path:'. "'$themePath';".'@import "custom_variables.scss";'.'@import "custom_colors.scss";'.$style;
            $colorPath = array_get($colorSchemes, 'colorPath');
            $style .= "\n".'@import "'.$colorPath.'";';
            $style .= '@import "rcolors.scss";';
            $style .= $this->generateCSSVariableBlock();
            $style.= $this->getColorPaletteCSS();
            $style .= '@import "fonts.scss";';
            $themeStylePath = array_get($config, 'themePath');
            if (!empty($themeStylePath)) {
                $themeStylePath = $this->getPath($themeStylePath);
                $style .= file_get_contents($themeStylePath);
            }
            
            $responsiveStylePath = $this->getPath('responsive.scss');
            $style .= file_get_contents($responsiveStylePath);
        }
        return $style;
    }
    protected function getVariantContent($variant = '')
    {
        $config = $this->getConfig();
        $colorSchemes = array_get($config, 'colorSchemes');
        $style = "";
        if (is_string($variant) && !empty($variant)) {
            if ($variant ==':pageColors') {
                $style = app('app.widget')->renderColors();
            } else {
                $variantPath = array_get($colorSchemes, 'variantPath');
                $variantPath = $this->getPath($variantPath.'/'.$variant.'.scss');
                file_exists($variantPath) &&  ($style .= file_get_contents($variantPath));
            }
        }
        return $style;
    }
    
    public function preloadTheme()
    {
        $style = $this->getThemeCSS();
        preg_match_all('/@import.*?"(.+?)".*?/ms', $style, $matches);
        $matches = $matches[1];
        
        $arr = [];
        foreach ($matches as $match) {
            $path = $this->getPath($match);
            $arr[$match] =  \File::get($path);
        }
        return [
            'preloads'=>$arr,
            'main'=>$style
        ];
    }
    public function generateImportStatement($file, $extension, $absolutePath = true)
    {
        $path = $this->getPath($file);
        $valid = false;
        if (!file_exists($path)) {
            $file = $file.'.'.$extension;
            $path = $this->getPath($file);
            if (file_exists($path)) {
                $valid = true;
            }
        } else {
            $valid = true;
        }
        if ($valid) {
            $importPath = $this->getURL($file);
            if ($absolutePath) {
                $importPath = $this->getPath($file);
            }
            return "@import \"$importPath\"". ';';
        }
    }
    protected function getVariablePrefix()
    {
        return '$';
    }
    public function convertToColor($color)
    {
        if (!empty($color['name'])) {
            $name = $color['name'];
            $prefix = $this->getVariablePrefix();
            if (!\Str::startsWith($name, $prefix)) {
                $name = $this->stripAllVariablePrefix($name);
                $name = $prefix.$name;
            }
            if (!empty($color['opacity'])) {
                $opacity = (int) $color['opacity'] /100;
                $name = 'rgba('.$name.','.$opacity.')';
            }
            return $name;
        }
    }
}
