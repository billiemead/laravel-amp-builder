<?php

namespace App\Assets\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Update\LatestRelease;
use App\Services\Update\LatestReleaseInterface;
use Illuminate\Foundation\Application;
use GuzzleHttp\Client;

class AssetServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadViewsFrom(__DIR__ . '/../views', 'assets');
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
