<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        \App\Console\Commands\Inspire::class,
        \App\Console\Commands\CreateRole::class,
        \App\Console\Commands\AsignRole::class,
        \App\Console\Commands\AsignRolePermission::class,
        \App\Console\Commands\IseedAll::class,
        \App\Console\Commands\InstallApp::class,
        \App\Console\Commands\UpdateApp::class,
        \App\Console\Commands\DebugApp::class,
        \App\Console\Commands\UpdateScreenshot::class,
        \App\Console\Commands\SetDemoServer::class,
        \App\Console\Commands\ResetDemoServer::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')
        //          ->hourly();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
