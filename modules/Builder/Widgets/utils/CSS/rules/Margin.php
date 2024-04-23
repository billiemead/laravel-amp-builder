<?php

namespace Modules\Builder\Widgets\utils\CSS\rules;

use Carbon\Carbon;
use Modules\Builder\Widgets\utils\CSS\Rule;

class Margin extends Rule
{
    public function toNativeRule()
    {
        $name = $this->property;
        $value = $this->value;
        $result = [];
        if (is_array($value)) {
            $result[$name] = $this->getPaddingString($value);
        } elseif (is_string($value)) {
            $result[$name] = $value;
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
                $arr[] = $this->wrapWithUnit($value[$direction]);
            } else {
                $arr[] = 0;
            }
        }
        return implode(' ', $arr);
    }
}
