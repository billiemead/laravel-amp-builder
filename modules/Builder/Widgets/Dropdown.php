<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;

class Dropdown extends BaseWidget
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.dropdown';
    protected $values = [];
    public function getValues()
    {
        $values = array_get($this->config, 'data.values');
        if (is_string($values)) {
            $values = trim($values);
            $dropdown_values = explode("\n", $values);
            $this->values = $dropdown_values;
        } elseif (is_array($values)) {
            $this->values = $values;
        }
        return $this->values;
    }
    public function begin()
    {
        return parent::begin();
    }
}
