<?php

namespace Modules\Builder\Publishing;

use Dingo\Api\Routing\Router as ApiRouter;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Route;

class ServiceProvider extends \App\Providers\RouteServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    protected $namespace = 'Modules\Builder\Publishing';
    public function boot()
    {
        parent::boot();
	
        $this->mapRoutes();
    }
    protected function mapRoutes()
    {
        $modules = config("publishing");
        $path = module_path('builder', 'Publishing');
        foreach ($modules as $name => $module) {
			$enabled = array_get($module, 'enabled');
			if(!$enabled)
				continue;
			$realpath = $path.'/'.ucfirst($name);
            if (file_exists($realpath.'/routes/web.php')) {
                Route::middleware('web')
                ->namespace($this->namespace)
                ->group($realpath.'/routes/web.php');
            }
            if (file_exists($realpath.'/routes/api.php')) {
                Route::prefix('api')
                ->middleware('api')
                ->namespace($this->namespace)
                ->group($realpath.'/routes/api.php');
            }
            // Load the views
            if (is_dir($realpath.'/views')) {
                $this->loadViewsFrom($realpath.'/views', $name);
            }
        }
    }

    protected function mapWebRoutes()
    {
    }
    protected function mapApiRoutes()
    {
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
