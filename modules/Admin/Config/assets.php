<?php


return [
    
    'resources'      => [
        'scripts' => [

            'admin_app'       => [
                'use_cdn'  => false,
                'location' => 'footer',
                'src'      => [
                    'local' => '/assets/js/admin.app.js',
                    'minify' => '/assets/js/admin.app.min.js',
                ],
            ],
           
        ],
        'styles'  => [
           'admin' => [
                'use_cdn'    => false,
                'location'   => 'header',
                'src'        => [
                    'local' => 'assets/css/admin/style.css',
                ]
            ],
        ],
    ],
];
