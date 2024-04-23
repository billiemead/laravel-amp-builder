<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use League\Flysystem\Filesystem;
use Storage;
use App\Adapters\SftpAdapter;

class SFTPServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        Storage::extend('sftp', function ($app, $config) {
            $adapter = new SftpAdapter($config);
            return new \League\Flysystem\Filesystem($adapter);
        });
    }
}
