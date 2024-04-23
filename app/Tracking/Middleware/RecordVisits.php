<?php

namespace App\Tracking\Middleware;

use Closure;
use App\Tracking\Tracker;
use Cookie;

class RecordVisits
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
        $v = Tracker::recordVisit();
        return $next($request);
    }
}
