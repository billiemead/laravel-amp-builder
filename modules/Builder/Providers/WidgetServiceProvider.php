<?php

namespace Modules\Builder\Providers;

use Illuminate\Support\ServiceProvider;
use App\Shortcodes\ShortcodeBase;
use Illuminate\Support\Facades\Blade;
use Modules\Builder\Factories\WidgetFactory;
use Modules\Builder\Factories\ThemeFactory;
use Arrilot\Widgets\Misc\LaravelApplicationWrapper;

class WidgetServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->app->singleton('command.stswidget.make', function ($app) {
            return new \App\Console\Commands\WidgetMakeCommand($app['files']);
        });

        $this->commands('command.stswidget.make');
        $omitParenthesis = version_compare($this->app->version(), '5.3', '<');
        Blade::directive('registerwidget', function ($expression) use ($omitParenthesis) {
            $expression = $omitParenthesis ? $expression : "($expression)";

            return "<?php echo app('app.widget')->register{$expression}; ?>";
        });
        Blade::directive('beginwidget', function ($expression) use ($omitParenthesis) {
            $expression = $omitParenthesis ? $expression : "($expression)";

            return "<?php echo app('app.widget')->begin{$expression}; ?>";
        });
        Blade::directive('endwidget', function ($expression) use ($omitParenthesis) {
            $expression = $omitParenthesis ? $expression : "($expression)";

            return "<?php echo app('app.widget')->end{$expression}; ?>";
        });
        Blade::directive('beginwidget_section', function ($expression) use ($omitParenthesis) {
            $expression = $omitParenthesis ? $expression : "($expression)";

            return "<?php echo app('app.widget')->begin_section{$expression}; ?>";
        });
        Blade::directive('endwidget_section', function ($expression) use ($omitParenthesis) {
            //$expression = $omitParenthesis ? $expression : "('section', $expression)";
            $expression = $omitParenthesis ? $expression : "($expression)";
            return "<?php echo app('app.widget')->end{$expression}; ?>";
        });
        
        Blade::directive('beginPage', function ($expression) use ($omitParenthesis) {
            $expression = $omitParenthesis ? $expression : "($expression)";
            return "<?php echo app('app.widget')->begin_page{$expression}; ?>";
        });
        Blade::directive('endPage', function ($expression) use ($omitParenthesis) {
            //$expression = $omitParenthesis ? $expression : "('section', $expression)";
            $expression = $omitParenthesis ? $expression : "($expression)";
            return "<?php echo app('app.widget')->end_page{$expression}; ?>";
        });
        Blade::directive('widget', function ($expression) {
            return "<?php echo app('app.widget')->run($expression); ?>";
        });
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind('app.widget', function () {
            return new WidgetFactory(new LaravelApplicationWrapper());
        });
        $this->app->bind('app.theme', function () {
            return new ThemeFactory();
        });
        $this->app->alias('app.widget', 'App\Factories\WidgetFactory');
    }
}
