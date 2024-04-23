<?php

namespace App\Themes\Providers;

use Illuminate\Support\ServiceProvider as BaseServiceProvider;
use Illuminate\Foundation\Application;
use GuzzleHttp\Client;

class ServiceProvider extends BaseServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadViewsFrom(__DIR__ . '/../views', 'themes');
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
