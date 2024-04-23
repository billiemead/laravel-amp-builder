<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;

class Heading extends Text
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.heading';
    public function getHeadingTag()
    {
        $tag = array_get($this->config, 'data.tag', 'h1');
        return $tag;
    }
    public function __construct(array $config = [])
    {
        parent::__construct($config);
        $this->tag = $this->getHeadingTag();
    }
}
