<?php

return [
    [
        'name' => 'projects',
        'url'=> "/projects",
        'abstract'=> true,
        'redirectTo'=>'/projects/list',
        'template'=> "<ui-view/>",
        'default'=>true,
    ],
    [
        'name' => 'projects.list',
        'url'=> "/list",
        'templateUrl'=> ('projects/list'),
        'controller'=> 'projects/list'
    ],
    
    [
        'name' => 'projects.add',
        'url'=> "/add",
        'templateUrl'=> ('projects/add'),
        'controller'=> 'projects/add'
    ],
    [
        'name' => 'projects.edit',
        'url'=> "/edit/{id}",
        'templateUrl'=> ('projects/edit'),
        'controller'=> 'projects/edit'
    ],
    [
        'name' => 'projects.analytics',
        'url'=> "/analytics/{id}",
        'templateUrl'=> ('projects/analytics'),
        'controller'=> 'projects/analytics'
    ],
    [
        'name' => 'domains',
        'url'=> "/domains",
        'abstract'=> true,
        'redirectTo'=>'/domains/list',
        'template'=> "<ui-view/>",
    ],
    [
        'name' => 'domains.list',
        'url'=> "/list",
        'templateUrl'=> ('domains/list'),
        'controller'=> 'domains/list'
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
        'templateUrl'=> ('templates/edit'),
        'controller'=> 'templates/edit'
    ],
    [
        'name' => 'integrations',
        'url'=> "/integrations",
        'abstract'=> true,
        'redirectTo'=>'integrations/list',
        'template'=> "<div ui-view/>",
        
    ],
    [
        'name' => 'integrations.list',
        'url'=> "/list",
        'templateUrl'=> ('integrations/list'),
        'controller'=> 'integrations/list'
    ],
    
    
    
    [
        'name' => 'profile',
        'url'=> "/profile",
        'templateUrl'=> ('profile'),
        'controller'=> 'profile'
    ],
    
];
