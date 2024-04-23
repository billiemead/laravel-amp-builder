<?php

namespace Modules\Builder\Widgets;

use App\Models\Page;
use Modules\Builder\Widgets\traits\Button as ButtonTrait;
use Modules\Builder\Widgets\traits\Text as TextEditor;

class Button extends BaseWidget
{
    use ButtonTrait;
    use TextEditor;
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $tag = 'a';
    protected $config = [];
    protected $view = 'widgets.button';
    public function getText()
    {
        $text = array_get($this->config, 'data.text');
        if (starts_with($text, '<p>')) {
            $text = substr($text, 3, -3);
        }
        return $text;
    }
}
