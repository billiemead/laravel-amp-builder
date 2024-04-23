<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;
use Modules\Builder\Widgets\traits\GlobalBlock;

class RowGlobal extends Row
{
    use GlobalBlock;
    public function getElementClass()
    {
        $type = 'row';
        $class = "module $type";
        return $class;
    }
}
