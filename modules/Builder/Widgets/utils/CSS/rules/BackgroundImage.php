<?php

namespace Modules\Builder\Widgets\utils\CSS\rules;

use Carbon\Carbon;
use Modules\Builder\Widgets\utils\CSS\Rule;

class BackgroundImage extends Rule
{
    public function toNativeRule()
    {
        $result = [];
        
        $name = $this->property;
        $value = $this->value;
        if (is_string($value)) {
            $result[$name] = $this->wrapWithUrl($value);
        }
        if (is_array($value)) {
            foreach ($value as $background_image) {
                $bgImageItem  = $this->convertToNativeBackgroundImage($background_image);
                
                $result = $this->mergeBackgroundImage($result, $bgImageItem);
            }
        }
        return $result;
    }
    protected function mergeBackgroundImage($bg1, $bg2)
    {
        $array_key1 = array_keys($bg1);
        $array_key2 = array_keys($bg2);
        $array_keys = array_merge($array_key1, $array_key2);
        $result = [];
        foreach ($array_keys as $array_key) {
            $value1 = array_get($bg1, $array_key);
            $value2 = array_get($bg2, $array_key);
            $separator = (!empty($value1) ? ',' : '');
            $value_merge = $value1.$separator.$value2;
            $result[$array_key] = $value_merge;
        }
        return $result;
    }
    protected function convertToNativeBackgroundImage($value)
    {
        $type = array_get($value, 'type');
        $data = array_get($value, 'data');
        $background_image = "";
        $separator = "";
        switch ($type) {
            case 'color':
                $color = $data;
                if (!is_string($color)) {
                    $color = $this->convertToColor($data);
                }
                $background_image = 'linear-gradient(180deg, '. $color.', '.$color.')';
            break;
            case 'image':
                $src = array_get($data, 'src');
                if (empty($src)) {
                    return;
                }
                $background_image = $this->wrapWithUrl($src);
            break;
            case 'gradient':
                $background_image = $this->generateBackgroundGradientString($data);
            break;
            default:
            break;
        }
        if (empty($background_image)) {
            return;
        }
        $extra_properties = [
            'position'=>'top left',
            'repeat'=> 'repeat',
            'size'=> 'auto',
            'attachment'=> 'scroll'
        ];
        $extra_values = [];
        foreach ($extra_properties as $name=>$default_value) {
            $extra_values["background-".$name] = $default_value;
            if (is_array($data) && !empty($data[$name])) {
                $extra_values["background-".$name] = $data[$name];
            }
        }
        if (is_string($background_image)) {
            $background_image = ['background-image'=>$background_image];
        }
        return array_merge($extra_values, $background_image);
    }
    protected function wrapWithUrl($value)
    {
        if (is_string($value) && !starts_with($value, 'url(')) {
            return "url(".$value.")";
        }
        return $value;
    }
    protected function generateBackgroundGradientString($value)
    {
        $colorStops = array_get($value, 'colorStops');
        if (empty($colorStops)) {
            return;
        }
        
        $colorString = "";
        $separator = "";
        uasort($colorStops, function ($a, $b) {
            if ($a['position'] == $b['position']) {
                return 0;
            }
            return ($a['position'] < $b['position']) ? -1 : 1;
        });
        foreach ($colorStops as $colorStop) {
            $color = array_get($colorStop, 'color');
            $position = array_get($colorStop, 'position');
            $color = $this->convertToColor($color);
            $colorString .= $separator.$color;
            $colorString.= " ". $position."%";
            $separator = ',';
        }
        $type = array_get($value, 'type');
        $direction = array_get($value, 'direction');
        $css = $type."-gradient(to ".$direction.", ".$colorString.")";
       
        return ['background-image'=>$css];
    }
}
