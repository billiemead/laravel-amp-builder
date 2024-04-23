<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;

class Hidden extends BaseWidget
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.hidden';
    protected $value="";
    public function getDataValue()
    {
        $data = array_get($this->config, 'data');
        $source = array_get($data, 'source');
        $value = array_get($data, 'value');
        $source = strtolower($source);
        if ($source == 'get') {
            if (!empty($value)) {
                $value = request()->get($value, '');
            }
        }
        else if ($source == 'cookie') {
            if (!empty($value)) {
                $value = request()->cookie($value, '');
            }
        }
        return $value;
    }
}
