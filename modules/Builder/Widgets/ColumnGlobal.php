<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;
use Modules\Builder\Widgets\traits\GlobalBlock;

class ColumnGlobal extends Column
{
    use GlobalBlock;
    public function __construct(array $config = [])
    {
        parent::__construct($config);
        $structure = $this->getStructure();
        $this->config = array_merge($structure, $this->config);
    }
    public function getElementClass()
    {
        $class = parent::getElementClass();
        $class .= ' column';
        return $class;
    }
}
