<?php
namespace App\Http\Middleware;

use Illuminate\View\Middleware\ShareErrorsFromSession;
use Closure;
use Illuminate\Support\ViewErrorBag;

class SessionErrors extends ShareErrorsFromSession
{
}
