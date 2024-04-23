<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;

class Box extends BaseWidget
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.box';
    public function findModule($page_id)
    {
        if ($this->getPage_id() == $page_id) {
            return $this;
        }
        $modules = array_get($this->config, 'modules', []);
        foreach ($modules as $module) {
            $type = array_get($module, 'type');
            $rs = app('app.widget')->findModule($type, $module, $page_id);
            if (!empty($rs)) {
                return $rs;
            }
        }
    }
    public function getExportedData()
    {
        $modules = array_get($this->config, 'modules', []);
        for ($i = 0; $i < sizeof($modules); $i++) {
            $type = array_get($modules[$i], 'type');
            $structure = app('app.widget')->getExportedData($type, $modules[$i]);
            $modules[$i] = $structure;
        }
        $this->config['modules'] = $modules;
        return $this->config;
    }
}
