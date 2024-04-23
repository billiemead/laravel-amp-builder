<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Exceptions\UnauthorizedException;

class SuperAdmin extends Authenticate
{
    public function handle($request, Closure $next, ...$guard)
    {
        if (Auth::guest()) {
            return redirect()->guest('auth/login');
        } elseif (!Auth::guard($guard)->guest() && (auth()->user()->hasRole('super_admin'))) {
            return $next($request);
        } elseif ($request->ajax()) {
            return response('Unauthorized.', 401);
        } else {
            throw UnauthorizedException::forRoles(['admin']);
        }
    }
}
