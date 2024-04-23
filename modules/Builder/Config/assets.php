<?php


return [
    
    'resources'      => [
        'scripts' => [
            'builder_app'       => [
                'use_cdn'  => false,
                'location' => 'footer',
                'src'      => [
                    'local' => '/assets/js/builder.app.js',
                    'minify' => '/assets/js/builder.app.min.js',
                ],
            ],
            'template_app'       => [
                'use_cdn'  => false,
                'location' => 'footer',
                'src'      => [
                    'local' => '/assets/js/template.app.js',
                    'minify' => '/assets/js/template.app.min.js',
                ],
            ],
            'preview_app'       => [
                'use_cdn'  => false,
                'location' => 'footer',
                'src'      => [
                    'local' => ['/assets/js/preview.app.js', '/js/amp_validator.js'],
                    'minify' => ['/assets/js/preview.app.min.js', 'https://cdn.ampproject.org/v0/validator.js'],
                ],
            ],
            'frontend_app'       => [
                'use_cdn'  => false,
                'location' => 'footer',
                'src'      => [
                    'local' => '/assets/js/frontend.js',
                    'minify' => '/assets/js/frontend.min.js',
                ],
            ],
            'html2canvas'       => [
                'use_cdn'  => false,
                'location' => 'footer',
                'src'      => [
                    'local' => '/assets/js/html2canvas/html2canvas.min.js',
                ],
            ],
            'canvg'       => [
                'use_cdn'  => false,
                'location' => 'footer',
                'src'      => [
                    'local' => ['/vendor/canvg/rgbcolor.js', '/vendor/canvg/stackblur.min.js', '/vendor/canvg/canvg.min.js'],
                    'cdn'=>['//cdn.jsdelivr.net/npm/rgbcolor@^1/index.js', '//cdn.jsdelivr.net/npm/stackblur-canvas@^1/dist/stackblur.min.js', '//cdn.jsdelivr.net/npm/canvg/dist/browser/canvg.min.js']
                ],
            ],
            'webfont'       => [
                'use_cdn'  => false,
                'location' => 'footer',
                'src'      => [
                    'local' => '/vendor/webfont/webfont.js',
                    'cdn' => '//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
                ],
            ],
        ],
        'styles'  => [
            'builder' => [
                'use_cdn'    => false,
                'location'   => 'header',
                'src'        => [
                    'local' => 'assets/css/builder/style.css',
                ]
            ],
            'builder_canvas' => [
                'use_cdn'    => false,
                'location'   => 'header',
                'src'        => [
                    'local' => 'assets/css/builder/edit_page.css',
                ]
            ],
            'preview' => [
                'use_cdn'    => false,
                'location'   => 'header',
                'src'        => [
                    'local' => 'assets/css/builder/style.css',
                ]
            ],
			'boilerplate' => [
                'use_cdn'    => false,
                'location'   => 'header',
				'inline'	 =>true,
				'attributes'=>['amp-boilerplate'],
                'src'        => [
                    'local' => 'assets/css/boilerplate/amp.css',
                ]
            ],
			'boilerplate_noscript' => [
                'use_cdn'    => false,
                'location'   => 'header',
				'inline'	 =>true,
				'attributes'=>['amp-boilerplate'],
				'wrap_by'=>'noscript',
                'src'        => [
                    'local' => 'assets/css/boilerplate/noscript.css',
                ]
            ],
			'template_boilerplate' => [
                'use_cdn'    => false,
                'location'   => 'header',
				'inline'	 =>true,
                'src'        => [
                    'local' => 'assets/css/boilerplate/template.css',
                ]
            ],
        ],
    ],
];
