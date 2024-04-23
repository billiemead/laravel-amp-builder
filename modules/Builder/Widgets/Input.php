<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;

class Input extends BaseWidget
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.input';
    public function getAutocompleteValues()
    {
        $values = array_get($this->config, 'data.autocompletes_values');
        $dropdown_values = [];
        if (!empty($values) && is_string($values)) {
            $values = trim($values);
            $dropdown_values = explode("\n", $values);
        } elseif (is_array($values)) {
            $dropdown_values = $values;
        }
        return ['items'=>$dropdown_values];
    }
}
