<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;

class Textnode extends Text
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.text';
   
    protected function beginTag()
    {
        $id = $this->uniqueId();
        $tag = array_get($this->config, 'tag');
        $rs = "<$tag";
        if (!empty($id)) {
            $rs.= " id=\"$id\"";
        }
        $rs.= ">";
        return $rs;
    }
    
    protected function endTag()
    {
        $tag = array_get($this->config, 'tag');
        return "</$tag>";
    }
}
