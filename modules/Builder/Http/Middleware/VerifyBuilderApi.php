<?php

namespace Modules\Builder\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;
use App\Models\Page;
use App\Models\Template;

use Auth;
use Illuminate\Http\Request;
use Illuminate\Http\Response as LaravelResponse;

class VerifyBuilderApi
{
    public function handle($request, Closure $next, $type = 'page', $param_name = '')
    {
        if ($request->headers->has('Model-Id')) {
            $variant_id = $request->headers->get('Model-Id');
        }
        if (!empty($param_name)) {
            $variant_id = $request->route($param_name);
        }
        if (empty($variant_id)) {
            return new LaravelResponse('Can\'t find data', 404);
        }
        $class = 'App\\Models\\'.ucfirst($type);
        if (is_string($variant_id) && strlen($variant_id) == 36) {
            $model = $class::whereUuid($variant_id)->first();
        } else {
            $model = $class::find($variant_id);
        }
        if (empty($model)) {
            return new LaravelResponse($type.' with Id '.$variant_id.' Not Found', 404);
        }
        if(Auth::check())	Auth::user()->can('update', $model);
        app()->instance($class, $model);
        $response = $next($request);
        return $response;
    }
}
