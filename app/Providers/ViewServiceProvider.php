<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\View\Factory as ViewFactory;
use App\View\Composers\VersionComposer;

class ViewServiceProvider extends ServiceProvider
{
    protected $composers = [
       VersionComposer::class    => ['common.update'],
    ];
    /**
     * Bootstrap the application services.
     *
     * @param ViewFactory $factory
     */
    public function boot(ViewFactory $factory)
    {
        foreach ($this->composers as $composer => $views) {
            $factory->composer($views, $composer);
        }
    }
}
