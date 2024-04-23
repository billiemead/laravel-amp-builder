<?php

namespace App\Themes;

use Illuminate\Config\Repository;
use Illuminate\Support\Arr;

/**
 * Class Themes.
 *
 * @since 22/07/2015 11:23 PM
 */
class Themes
{
    /**
     * @var Repository
     */
    protected $config;

   

    /**
     * Themes constructor.
     *
     * @param Repository $config
     */
    public function __construct(Repository $config)
    {
        $this->config = $config->get('themes');
    }
    public function loadModuleAsset($module)
    {
        $module = \Module::find($module);
        if (empty($module)) {
            return;
        }
        $config_path = $module->getExtraPath('Config/themes.php');
        if (file_exists($config_path)) {
            $module_asset_config = include($config_path);
            $this->config = recursive_array_merge($this->config, $module_asset_config);
        }
    }
    protected function getCurrentTheme()
    {
        return array_get($this->config, 'currentTheme', 'default');
    }
    protected function getAllThemes()
    {
        return array_get($this->config, 'themes', []);
    }
    protected function getCustomStyle()
    {
        $path = array_get($this->config, 'custom_styles', '');
		$path = public_path($path);
		if(\File::exists($path)) {
			return \File::get($path);
		}
    }
    /**
     * Render assets to header.
     *
     * @param array $lastStyles
     * @return string
     * @throws \Throwable
     */
    public function render($module = false)
    {
        if ($module !== false) {
            $this->loadModuleAsset($module);
        }
        $currentTheme = $this->getCurrentTheme();
        $customStyles = $this->getCustomStyle();
        $themes = $this->getAllThemes();

        return view('themes::header', compact('themes', 'currentTheme', 'customStyles'))->render();
    }
}
