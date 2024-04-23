<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Facades\Auth;

class NoneInstalled
{
    public function handle($request, Closure $next, $guard = null)
    {
        if (isInstalled()) {
            if ($request->ajax() || $request->wantsJson()) {
                return response('Already installed yet.', 500);
            }
            return redirect('/');
        }


        return $next($request);
    }
}
