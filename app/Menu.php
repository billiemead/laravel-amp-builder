<?php
namespace App;

class Menu
{
    public static function render($items)
    {
        $menus = [];
        foreach ($items as $item) {
            if (!isset($item['hidden']) || !$item['hidden']) {
                $menus[] = view('menu.item', compact('item'))->render();
            }
        }
        return view('menu.items', compact('menus'))->render();
    }
    public static function renderModule($module)
    {
        $module = \Module::find($module);
        if (empty($module)) {
            return;
        }
        $config_path = $module->getExtraPath('Config/menu.php');
        if (file_exists($config_path)) {
            $menu_items = require($config_path);
            return self::render($menu_items);
        }
    }
}
