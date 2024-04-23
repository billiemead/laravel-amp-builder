<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Shortcodes\ShortcodeBase;

use Shortcode;

class ShortcodesServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        Shortcode::register('templates', ShortcodeBase::class);
        Shortcode::register('pricetable', ShortcodeBase::class);
        Shortcode::register('menu', ShortcodeBase::class);
        //Shortcode::register('i', 'App\Shortcodes\ItalicShortcode@custom');
    }
}
