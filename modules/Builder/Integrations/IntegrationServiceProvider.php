<?php

namespace Modules\Builder\Integrations;

use Dingo\Api\Routing\Router as ApiRouter;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Route;

class IntegrationServiceProvider extends \App\Providers\RouteServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    protected $namespace = 'Modules\Builder\Integrations';
    public function boot()
    {
        parent::boot();
        $this->mapRoutes();
    }
    protected function mapRoutes()
    {
        $modules = config("integrations");
        $path = module_path('builder', 'Integrations');
        foreach ($modules as $name => $module) {
            if (file_exists($path.'/'.$name.'/routes/web.php')) {
                Route::middleware('web')
                ->namespace($this->namespace)
                ->group($path.'/'.$name.'/routes/web.php');
            }
            if (file_exists($path.'/'.$name.'/routes/api.php')) {
                Route::prefix('api')
                ->middleware('api')
                ->namespace($this->namespace)
                ->group($path.'/'.$name.'/routes/api.php');
            }
            // Load the views
            if (is_dir($path.'/'.$name.'/views')) {
                $this->loadViewsFrom($path.'/'.$name.'/views', $name);
            }
        }
    }

    protected function mapWebRoutes()
    {
        Route::middleware('web')
             ->namespace($this->namespace)
             ->group(module_path('builder', 'Integrations/routes/web.php'));
    }
    protected function mapApiRoutes()
    {
        $prefixes = [config('builder.builder_api_route'), config('builder.template_api_route')];
        foreach ($prefixes as $prefix) {
            Route::prefix('api/'.$prefix)
             ->middleware('api')
             ->namespace($this->namespace)
             ->group(module_path('builder', 'Integrations/routes/api.php'));
        }
    }
    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
    }
}
