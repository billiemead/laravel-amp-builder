<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;
use File;
use Illuminate\Support\Facades\Cache;

class LinkIcon extends Svg
{
    /**
     * The configuration array.
     *
     * @var array
    */
    protected $tag = 'span';
    protected $config = [];
    protected $view = 'widgets.svg';
    protected function beginTag()
    {
        $id = $this->uniqueId();
        $type = $this->getType();
        $class = $this->getElementClass();
        $tag = $this->tag;
        return "<$tag id=\"$id\" class=\"$class\" data-type=\"$type\">";
    }
}
