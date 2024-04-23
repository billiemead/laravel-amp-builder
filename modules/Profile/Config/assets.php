<?php


return [
    
    'resources'      => [
        'scripts' => [

            'profile_app'       => [
                'use_cdn'  => false,
                'location' => 'footer',
                'src'      => [
                    'local' => '/assets/js/profile.app.js',
                    'minify' => '/assets/js/profile.app.min.js',
                ],
            ],
           
        ],
        'styles'  => [
           'profile' => [
                'use_cdn'    => false,
                'location'   => 'header',
                'src'        => [
                    'local' => 'assets/css/admin/style.css',
                ]
            ],
        ],
    ],
];
