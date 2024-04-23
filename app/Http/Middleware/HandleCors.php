<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;

class HandleCors extends \Barryvdh\Cors\HandleCors
{
    public function handle($request, Closure $next)
    {
    }
}
