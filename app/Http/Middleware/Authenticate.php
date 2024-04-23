<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    public function handle($request, Closure $next, ...$guards)
    {
        try {
            return parent::handle($request, $next, $guards);
        } catch (\Exception $e) {
            if ($request->is('ajax') || $request->expectsJson()) {
                throw new \Exception(trans('auth.session_expired'), 401);
            }
            throw $e;
        }
    }
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string
     */
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            return 'login';
        }
    }
}
