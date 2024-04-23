<?php

return [
    [
        'name' => 'projects',
        'url'=> "/projects",
        'abstract'=> true,
        'template'=> "<ui-view/>",
        'redirectTo'=>'/projects/list',
        'default'=>true,
    ],
    [
        'name' => 'projects.list',
        'url'=> "/list",
        'templateUrl'=> ('projects/list'),
        'controller'=> 'pages/list'
    ],
    
    [
        'name' => 'projects.add',
        'url'=> "/add",
        'templateUrl'=> ('projects/add'),
        'controller'=> 'pages/add'
    ],
    
    [
        'name' => 'menus',
        'url'=> "/menus",
        'abstract'=> true,
        'template'=> "<ui-view/>"
    ],

    [
        'name' => 'templates',
        'url'=> "/templates",
        'abstract'=> true,
        'redirectTo'=>'/templates/list',
        'template'=> "<ui-view/>"
    ],
    [
        'name' => 'templates.list',
        'url'=> "/list",
        'templateUrl'=> ('templates/list'),
        'controller'=> 'templates/list'
    ],
    [
        'name' => 'templates.add',
        'url'=> "/add",
        'templateUrl'=> ('templates/add'),
        'controller'=> 'templates/add'
    ],
    [
        'name' => 'templates.edit',
        'url'=> "/edit/{id}",
        'templateUrl'=> 'templates/edit',
        'controller'=> 'templates/edit'
    ],
    [
        'name' => 'templates_categories',
        'url'=> "/templates_categories",
        'abstract'=> true,
        'redirectTo'=>'/templates_categories/list',
        'template'=> "<div ui-view/>",
        
    ],
    [
        'name' => 'templates_categories.list',
        'url'=> "/list",
        'templateUrl'=> ('templates_categories/list'),
        'controller'=> 'templates_categories/list'
    ],
    [
        'name' => 'templates_categories.add',
        'url'=> "/add",
        'templateUrl'=> ('templates_categories/add'),
        'controller'=> 'templates_categories/add'
    ],
    [
        'name' => 'templates_categories.edit',
        'url'=> "/edit/{id}",
        'templateUrl'=> ('templates_categories/edit'),
        'controller'=> 'templates_categories/edit'
    ],
    [
        'name' => 'domains',
        'url'=> "/domains",
        'abstract'=> true,
        'redirectTo'=>'/domains/list',
        'template'=> "<ui-view/>",
        'controller'=> ''
        
    ],
    [
        'name' => 'domains.list',
        'url'=> "/list",
        'templateUrl'=> ('domains/list'),
        'controller'=> 'domains/list'
    ],
    
    
    [
        'name' => 'profile',
        'url'=> "/profile",
        'templateUrl'=> ('profile'),
        'controller'=> 'profile'
    ],
    [
        'name' => 'users',
        'url'=> "/users",
        'abstract'=> true,
        'redirectTo'=>'/users/list',
        'template'=> "<ui-view/>"
    ],
    [
        'name' => 'users.list',
        'url'=> "/list",
        'templateUrl'=> ('users/list'),
        'controller'=> 'users/list'
    ],
    [
        'name' => 'users.add',
        'url'=> "/add",
        'templateUrl'=> ('users/add'),
        'controller'=> 'users/add'
    ],
    
    [
        'name' => 'users.edit',
        'url'=> "/edit/{id}",
        'templateUrl'=> 'users/edit',
        'controller'=> 'users/edit'
    ],
    [
        'name' => 'settings',
        'url'=> "/settings",
        'templateUrl'=> 'settings.index',
        'controller'=> 'settings'
    ],
];
