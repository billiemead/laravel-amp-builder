<?php

return [
    [
        'name' => 'menu.websites',
        'url'=> "#projects",
        'icon'=> 'fa fa-laptop',
    ],
    [
        'name' => 'menu.templates',
        'url'=> "#templates",
        'icon'=> 'fa fa-tachometer-alt',
    ],
    [
        'name' => 'menu.templates_categories',
        'url'=> "#templates_categories",
        'icon'=> 'fa fa-bars',
    ],
    [
        'name' => 'menu.domains',
        'url'=> "#domains",
        'icon'=> 'fa fa-globe',
    ],
    [
        'name' => 'menu.users',
        'url'=> "#users",
        'icon'=> 'fa fa-users',
        'hidden'=>!\Auth::user()->hasRole('super_admin'),
    ],
    [
        'name' => 'menu.settings',
        'url'=> "#settings",
        'icon'=> 'fa fa-cogs',
        'hidden'=>!\Auth::user()->hasRole('super_admin'),
    ],
    [
        'name' => 'menu.updates',
        'url'=> url('admin/update'),
        'icon'=> 'fa fa-sync',
        'hidden'=>!\Auth::user()->hasRole('super_admin'),
    ],
];
