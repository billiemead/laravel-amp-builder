<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;

class Column extends Box
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.box';
    public function getElementClass()
    {
        $class = parent::getElementClass();
        $sizeClasses = $this->sizeClasses();
        
        return $class.' '.implode(' ', $sizeClasses);
    }
    protected function sizeClasses()
    {
        $classes = [];
        $size = array_get($this->config, 'data.size');
        $sizes = array_get($this->config, 'data.sizes');
        $resolutions = config('resolutions');
        foreach ($resolutions as $resolution_name=>$resolution_info) {
            if (!empty($sizes) && !empty($sizes[$resolution_name])) {
                $resolution_size = $sizes[$resolution_name];
            } elseif (!empty($resolution_info['default']) && $resolution_info['default']) {
                if (!empty($size)) {
                    $resolution_size = $size;
                }
            }
            if (isset($resolution_size)) {
                $column_alias = array_get($resolution_info, 'column-alias');
                $classes[] = $column_alias.$resolution_size;
            }
        }
        return array_unique($classes);
    }
}
