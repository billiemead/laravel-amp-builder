<?php

namespace Modules\Builder\Integrations;

use App\Models\Connection;
use Validator;
use App\Http\Controllers\Controller as BaseController;
use Auth;
use Hash;
use App\Models\Page;
use Illuminate\Http\Request;
use DB;
use App;

class Controller extends BaseController
{
    public function executeProviderRoute($provider, $action)
    {
        return $this->callProviderMethod($provider, $action);
    }
    protected function callProviderMethod($provider, $method, $params = [])
    {
        $namespace = 'Modules\\Builder\\Integrations\\'.$provider;
        $class = $namespace.'\\Controllers\\Controller';
        $prefix = request()->isMethod('post') ? 'post': 'get';
        $method = $prefix.ucfirst($method);
        if (class_exists($class) && method_exists($class, $method)) {
            return App::call($class.'@'.$method, $params);
        }
    }
}
