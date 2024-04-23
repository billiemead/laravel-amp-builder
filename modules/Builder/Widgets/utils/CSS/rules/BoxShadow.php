<?php

namespace Modules\Builder\Widgets\utils\CSS\rules;

use Carbon\Carbon;
use Modules\Builder\Widgets\utils\CSS\Rule;

class BoxShadow extends Rule
{
    public function toNativeRule()
    {
        $result = [];
        $name = $this->property;
        $value = $this->value;
        if (is_array($value) && !isNativeArray($value)) {
            $result[$name] = $this->getShadowString($value);
        } elseif (is_array($value)) {
            $boxShadows = [];
            foreach ($value as $boxShadowItem) {
                $boxShadows[] = $this->getShadowString($boxShadowItem);
            }
            $result[$name] = implode(',', $boxShadows);
        }
        return $result;
    }
    protected function calculateOffset($angle, $distance)
    {
		$angle = (int)$angle;
		$distance = (int)$distance;
        return [
            'offsetX'=> round(cos(deg2rad($angle)) * $distance),
            'offsetY'=> round(sin(deg2rad($angle)) * $distance),
        ];
    }
    protected function getShadowString($boxShadow)
    {
        $boxShadows = [
            'offsetX' => array_get($boxShadow, 'offsetX', 0).'',
            'offsetY' => array_get($boxShadow, 'offsetY', 0).'',
            'blurRadius' => array_get($boxShadow, 'blurRadius', 0).'',
            'spreadRadius' => array_get($boxShadow, 'spreadRadius', 0).'',
            'color' => array_get($boxShadow, 'color'),
            'inset' => array_get($boxShadow, 'inset', false) ? 'inset' : '',
        ];
        if (!empty($boxShadow['distance'])) {
            $angle = array_get($boxShadow, 'angle', 0);
            $offset = $this->calculateOffset($angle, $boxShadow['distance']);
            $boxShadows['offsetX'] = $offset['offsetX'].'px';
            $boxShadows['offsetY'] = $offset['offsetY'].'px';
        }
        if (!empty($boxShadow['color'])) {
            $color = $boxShadow['color'];
            if (is_array($color)) {
                $color = $this->convertToColor($color);
            }
            $boxShadows['color'] = $color;
        }
        return implode(' ', array_values($boxShadows));
    }
}
