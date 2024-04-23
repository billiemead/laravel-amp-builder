<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;
use Modules\Builder\Widgets\traits\Text as TextEditor;

class Text extends BaseWidget
{
    use TextEditor;
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.text';
    public function getText()
    {
        $text = array_get($this->config, 'data.text');
        $text = "<div>$text</div>";
        return $text;
    }
}
