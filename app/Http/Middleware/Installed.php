<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Facades\Auth;

class Installed
{
    public function handle($request, Closure $next, $guard = null)
    {
        if (!isInstalled()) {
            if ($request->ajax() || $request->wantsJson()) {
                return response('None installed yet.', 500);
            } else {
                return redirect('/install');
            }
        }
        return $next($request);
    }
}
