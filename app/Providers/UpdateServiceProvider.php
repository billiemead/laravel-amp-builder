<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Update\LatestRelease;
use App\Services\Update\LatestReleaseInterface;
use Illuminate\Foundation\Application;
use GuzzleHttp\Client;

class UpdateServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        $currentVersion = trim(file_get_contents(__DIR__ . '/../../VERSION'));
        if (!defined('APP_VERSION')) {
            define('APP_VERSION', $currentVersion);
        }
        
        if (!defined('STS_VERSION')) {
            if (config('app.dev_mode')) {
                define("STS_VERSION", rand());
            } else {
                define('STS_VERSION', $currentVersion);
            }
        }
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(LatestReleaseInterface::class, LatestRelease::class);
        $this->app->singleton('app.update-check', function (Application $app) {
            $cache = $app->make('cache.store');
            $client = $app->make(Client::class);
            $token = $app->make('config')->get('update.github_oauth_token');
            return new LatestRelease($cache, $client, $token);
        });
        $this->app->alias('app.update-check', LatestReleaseInterface::class);
    }
}
