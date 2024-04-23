<?php

namespace Modules\Builder\Widgets;

class LinkText extends Text
{
    
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $tag = 'span';
    protected $config = [];
    protected $view = 'widgets.text';
    public function getText()
    {
        $text = array_get($this->config, 'data.text');
        return $text;
    }
}
