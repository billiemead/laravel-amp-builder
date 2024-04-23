<?php

namespace Modules\Admin\Http\Controllers\rest;

use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Artisan;
use Symfony\Component\Console\Output\BufferedOutput;

use Auth;
use DB;
use Hash;
use Illuminate\Http\Request;
use File;
use Setting;

class SettingsController extends Controller
{

    /**
     * @param $envKey
     * @param $envValue
     */
    private function setEnvironmentValue($envKey, $envValue)
    {
        $envFile = app()->environmentFilePath();
        $str = file_get_contents($envFile);

        $str .= "\n"; // In case the searched variable is in the last line without \n
        $keyPosition = strpos($str, "{$envKey}=");
        $endOfLinePosition = strpos($str, PHP_EOL, $keyPosition);
        $oldLine = substr($str, $keyPosition, $endOfLinePosition - $keyPosition);
        $str = str_replace($oldLine, "{$envKey}={$envValue}", $str);
        $str = substr($str, 0, -1);

        $fp = fopen($envFile, 'w');
        fwrite($fp, $str);
        fclose($fp);
    }
    /**
     * Write configuration data to relevant file
     *
     * @return JSON Object
     */
    public function updateConfig(Request $request)
    {
        if (config('app.demo_mode')) {
            throw new \Exception('Can\'t update in demo mode');
        }
        $validator = Validator::make($request->all(), array(
            'type' => 'required|max:255',
            'data' => 'required',
        ));
        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        $conf = $request->input('data');
        $type = $request->input('type');
        Setting::set($type, $conf);
        Setting::save();
        return response()->success(1);
    }
    /**
     * Get all config from /config/general.php
     *
     * @return JSON Object
     */
    public function getConfig($name)
    {
        $result = $this->_getConfig($name);
        return response()->success($result);
    }
    public function getConfigs()
    {
        $keys = request()->get('keys');
        $result = [];
        foreach ($keys as $k) {
            $result[$k] = $this->_getConfig($k);
        }
        return response()->success($result);
    }
    private function _getConfig($name)
    {
        $config = config($name);
        $settings = [];
        $result = [];
        if (is_array($config)) {
            $result = array_merge($result, $config);
        }
        if (is_array($settings)) {
            $result = array_merge($result, $settings);
        }
        return $result;
    }
    public function rebuildConfigCache()
    {
        $outputLog = new BufferedOutput;
        Artisan::call('config:cache', [], $outputLog);
        $this->createStorageLink($outputLog);
        return response()->success(1);
    }
    public function clearCache()
    {
        $outputLog = new BufferedOutput;
        Artisan::call('clear-compiled', [], $outputLog);
        Artisan::call('cache:clear', [], $outputLog);
        Artisan::call('route:clear', [], $outputLog);
        Artisan::call('config:clear', [], $outputLog);
        Artisan::call('view:clear', [], $outputLog);
		if(file_exists(base_path('/public/storage'))) {
			unlink(base_path('/public/storage'));
		}
        $this->createStorageLink($outputLog);
        return response()->success(1);
    }
	protected function createStorageLink(&$outputLog)
	{
		if(!file_exists(base_path('/public/storage')))
			Artisan::call('storage:link', [], $outputLog);
	}
}
