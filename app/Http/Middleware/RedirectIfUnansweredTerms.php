<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class RedirectIfUnansweredTerms
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (config('gdpr.consent') && Auth::user()->accepted_gdpr === null) {
            return \Redirect::route('gdpr-terms');
        }

        return $next($request);
    }
}
