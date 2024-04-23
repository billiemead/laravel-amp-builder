<?php

namespace Modules\Builder\Widgets;

use Route;

use Arrilot\Widgets\AbstractWidget;

class Html extends BaseWidget
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.html';
    public function begin()
    {
        return parent::begin();
    }
}
