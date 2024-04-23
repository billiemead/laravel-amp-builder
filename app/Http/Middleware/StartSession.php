<?php
namespace App\Http\Middleware;

use Illuminate\Session\Middleware\StartSession as Middleware;
use Illuminate\Session\SessionManager;

use Closure;

class StartSession extends Middleware
{

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public static $inited;
    public function __construct(SessionManager $manager)
    {
        if (self::$inited) {
        }
        
        self::$inited = true;
        $this->manager = $manager;
    }
}
