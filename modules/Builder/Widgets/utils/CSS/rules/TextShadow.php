<?php

namespace Modules\Builder\Widgets\utils\CSS\rules;

use Carbon\Carbon;
use Modules\Builder\Widgets\utils\CSS\Rule;

class TextShadow extends BoxShadow
{
    protected function getShadowString($boxShadow)
    {
        $shadows = [
            'offsetX' => array_get($boxShadow, 'offsetX', 0).'',
            'offsetY' => array_get($boxShadow, 'offsetY', 0).'',
            'blurRadius' => array_get($boxShadow, 'blurRadius', 0).'',
            'color' => array_get($boxShadow, 'color'),
        ];
        if (!empty($boxShadow['distance'])) {
            $angle = array_get($boxShadow, 'angle', 0);
            $offset = $this->calculateOffset($angle, $boxShadow['distance']);
            $shadows['offsetX'] = $offset['offsetX'].'px';
            $shadows['offsetY'] = $offset['offsetY'].'px';
        }
        if (!empty($boxShadow['color'])) {
            $color = $boxShadow['color'];
            if (is_array($color)) {
                $color = $this->convertToColor($color);
            }
            $shadows['color'] = $color;
        }
        return implode(' ', array_values($shadows));
    }
}
