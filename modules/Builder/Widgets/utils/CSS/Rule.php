<?php

namespace Modules\Builder\Widgets\utils\CSS;

use Arrilot\Widgets\AbstractWidget;
use Carbon\Carbon;
use Str;

class Rule
{
    protected $property;
    protected $value;
    public function __construct($property, $value)
    {
        $this->property = $property;
        $this->value = $value;
    }
	protected function checkValidUnitRule($value)
	{
		$units = ['px', 'em', '%','rem', 'vh', 'vw'];
		foreach($units as $unit) {
			if(Str::endsWith($value, $unit)) {
				$value = substr($value, 0, strlen($value) - strlen($unit));
				if(!is_numeric($value)) {
					$value = floatval($value);
					
				}
				return $value.$unit;
				/*if(Str::endsWith($value, '.')) {
					while(Str::endsWith($value, '.')) {
						$value = substr($value, 0, strlen($value) - 1);
					}
					
				}
				*/
			}
		}
		return true;
	}
    public function toNativeRule()
    {
        $non_unitStyles = ['z-index','opacity', 'font-weight'];
        $name = $this->property;
        $value = $this->value;
        $result = [];
		
        if (is_numeric($value)) {
            $unit = 'px';
            if (in_array($name, $non_unitStyles)) {
                $unit = '';
            }
            $result[$name] = $value.$unit;
        } elseif (is_string($value)) {
            if ($name == 'background-image') {
                $result[$name] = 'url("'.($value).'")';
            } 
			else {
                $result[$name] = $value;
            }
			$s = $this->checkValidUnitRule($value);
			if($s !== true)
				$result[$name] = $s;
        } elseif (is_array($value)) {
            if ($name == 'box-shadow') {
                $result[$name] = $this->getBoxShadowString($value);
            } elseif ($name == 'text-shadow') {
                $result[$name] = $this->getTextShadowString($value);
            } elseif ($name == 'background-gradient') {
                 $gradient = $this->generateBackgroundGradientString($value);
				 if(!empty($gradient) && !empty($gradient['background-image'])) {
					$result['background-image'] = $gradient['background-image'];
				 }
            } elseif ($name == 'padding' || $name == 'margin') {
                $result[$name] = $this->getPaddingString($value);
            } elseif (!empty($value['value'])) {
                $result[$name] = $this->convertToColor($value);
            }
        }
        return $result;
    }
	
    protected function getPaddingString($value)
    {
        $unit = 'px';
        $directions = ['top', 'right', 'bottom', 'left'];
        $arr = [];
        foreach ($directions as $direction) {
            if (isset($value[$direction])) {
                $arr[] = $value[$direction].$unit;
            } else {
                $arr[] = 0;
            }
        }
        return implode(' ', $arr);
    }
	
    protected function getBoxShadowString($boxShadow)
    {
        $boxShadows = [
            'offsetX' => array_get($boxShadow, 'offsetX', 0).'px',
            'offsetY' => array_get($boxShadow, 'offsetY', 0).'px',
            'blurRadius' => array_get($boxShadow, 'blurRadius', 0).'px',
            'spreadRadius' => array_get($boxShadow, 'spreadRadius', 0).'px',
            'color' => array_get($boxShadow, 'color'),
            'inset' => array_get($boxShadow, 'inset', false) ? 'inset' : '',
        ];
        if (!empty($boxShadow['color'])) {
            $color = $boxShadow['color'];
            if (is_array($color)) {
                $color = $this->convertToColor($color);
            }
            $boxShadows['color'] = $color;
        }
        return implode(' ', array_values($boxShadows));
    }
    protected function getTextShadowString($boxShadow)
    {
        $boxShadows = [
            'offsetX' => array_get($boxShadow, 'offsetX', 0).'px',
            'offsetY' => array_get($boxShadow, 'offsetY', 0).'px',
            'blurRadius' => array_get($boxShadow, 'blurRadius', 0).'px',
            'color' => array_get($boxShadow, 'color'),
        ];
        if (!empty($boxShadow['color'])) {
            $color = $boxShadow['color'];
            if (is_array($color)) {
                $color = $this->convertToColor($color);
            }
            $boxShadows['color'] = $color;
        }
        return implode(' ', array_values($boxShadows));
    }
    protected function convertToColor($color)
    {
        include_once('helper.php');
        return convertToColor($color);
    }
    protected function wrapWithUnit($value, $unit = 'px')
    {
        if (!is_numeric($value)) {
			return $value;
        }
        
        return $value.$unit;
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
