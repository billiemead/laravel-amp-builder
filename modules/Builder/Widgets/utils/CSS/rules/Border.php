<?php

namespace Modules\Builder\Widgets\utils\CSS\rules;

use Carbon\Carbon;
use Modules\Builder\Widgets\utils\CSS\Rule;

class Border extends Rule
{
    public function toNativeRule()
    {
        $result = [];
        $name = $this->property;
        $value = $this->value;
        if (is_array($value) && !isNativeArray($value)) {
            $result[$name] = $this->getBorderString($value);
        }
        
        return $result;
    }
    protected function getBorderString($border)
    {
        $borders = [
            'width' => array_get($border, 'width', 0).'',
            'style' => array_get($border, 'style').'',
            'color' => array_get($border, 'color'),
        ];
        $borders['width'] = $this->wrapWithUnit($borders['width']);
        if (!empty($borders['color'])) {
            $color = $borders['color'];
            if (is_array($color)) {
                $color = $this->convertToColor($color);
            }
            $borders['color'] = $color;
        }
        return implode(' ', array_values($borders));
    }
}
