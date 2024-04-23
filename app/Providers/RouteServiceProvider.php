<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Dingo\Api\Routing\Router as ApiRouter;
use Illuminate\Routing\Router;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'App\Http\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    protected $version = 'v1';
    public function boot()
    {
        \Route::pattern('domain', '[a-z0-9.\-]+');
        $url = getAppDomain();
        
        \Route::pattern('custom_domain', '^(?!('.$url.')$).*$');
        parent::boot();
    }

    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map(Router $router, ApiRouter $apiRouter)
    {
        $this->mapApiRoutes();

        $this->mapWebRoutes();
        $this->mapDingoApiRoutes($router, $apiRouter);
        //
    }
    
    public function mapDingoApiRoutes(Router $router, ApiRouter $apiRouter)
    {
        $apiRouter->version($this->version, function ($apiRouter) use ($router) {
            $apiRouter->group(['namespace' => $this->namespace], function ($api) use ($router) {
                $api->get('/', 'HomeController@index');
            });
        });
    }
    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     *
     * @return void
     */
    protected function mapWebRoutes()
    {
        Route::middleware('install_web')
             ->namespace($this->namespace)
             ->group(base_path('routes/web/installer.php'));
             
        Route::middleware('web')
             ->namespace($this->namespace)
             ->group(base_path('routes/web.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiRoutes()
    {
        Route::prefix('api')
             ->middleware('api')
             ->namespace($this->namespace)
             ->group(base_path('routes/api.php'));
    }
}
