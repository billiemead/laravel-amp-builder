<?php

namespace App\Providers;

use Illuminate\Contracts\Auth\Access\Gate as GateContract;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use DB;

class AnalyticServiceProvider extends ServiceProvider
{
    public function boot(GateContract $gate)
    {
    }
}
