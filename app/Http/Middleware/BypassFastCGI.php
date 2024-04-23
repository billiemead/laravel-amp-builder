<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\Authenticate as Middleware;

class BypassFastCGI extends Middleware
{
    public function handle($request, Closure $next, ...$guards)
    {
		$enable = config('http_fcgi.enable');
		$token = config('http_fcgi.tokenName');
        if($enable && $request->hasHeader($token)  ) {
			$request->headers->set('Authorization', $request->headers->get($token));
		}
		return $next($request);	
    }
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string
     */
   
}
