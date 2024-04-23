<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;

class PopupContainer extends BaseWidget
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.section';
    protected $available_offsets = ['width', 'height'];
    public function begin()
    {
        if (!$this->isViewMode()) {
            return '<div id="popup-container">';
        }
        return "";
    }
    public function end()
    {
        if (!$this->isViewMode()) {
            return '</div>';
        }
        return "";
    }
}
