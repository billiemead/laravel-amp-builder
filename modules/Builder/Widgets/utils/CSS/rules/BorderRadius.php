<?php

namespace Modules\Builder\Widgets\utils\CSS\rules;

use Carbon\Carbon;
use Modules\Builder\Widgets\utils\CSS\Rule;

class BorderRadius extends Margin
{
    protected function getPaddingString($value)
    {
        $unit = 'px';
        $directions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
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
