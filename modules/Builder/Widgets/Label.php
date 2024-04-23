<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;
use Modules\Builder\Widgets\traits\Text as TextEditor;

class Label extends BaseWidget
{
    use TextEditor;
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.label';
}
