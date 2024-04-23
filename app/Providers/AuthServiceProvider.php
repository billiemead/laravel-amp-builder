<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Models\Site' => 'App\Policies\SitePolicy',
        'App\Models\Template' => 'App\Policies\TemplatePolicy',
        'App\Models\Page' => 'App\Policies\PagePolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
        Gate::define('siteOwner', function ($user, $site) {
            return $user->id === $site->user_id;
        });
        
        Gate::define('manageUsers', function ($user) {
            return $user->is_admin == 1;
        });

        //
    }
}
