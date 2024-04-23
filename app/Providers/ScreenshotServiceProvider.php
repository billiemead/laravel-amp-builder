<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Screenshot\BaseScreenshotInterface;
use App\Screenshot\BaseScreenshot;
use Illuminate\Foundation\Application;

class ScreenshotServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $provider = config('screenshot.provider');
        $instance = config('screenshot.providers.'. $provider);
        $base_class = BaseScreenshot::class;
        if (!empty($instance) && !empty($instance['class'])) {
            $base_class = $instance['class'];
        }
        
        $this->app->bind(BaseScreenshotInterface::class, $base_class);
        $this->app->singleton('app.screenshot', function (Application $app) use ($base_class) {
            return new $base_class();
        });
        $this->app->alias('app.screenshot', BaseScreenshotInterface::class);
    }
}
