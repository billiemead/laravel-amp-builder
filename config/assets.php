<?php

return [
    'offline'        => env('ASSETS_OFFLINE', true),
    'enable_version' => env('ASSETS_ENABLE_VERSION', true),
    'version'        => env('ASSETS_VERSION', time()),
    'scripts'        => [
		'jquery',
		'jquery_migrate',
		'jquery_datables',
        'vendor',
		'app_common',
    ],
    'styles'         => [
		'angular-material',
		 'fontawesome',
    ],
    'resources'      => [
        'scripts' => [
			'jquery'=>[
				'use_cdn'  => false,
                'location' => 'footer',
                'src'      => [
                    'local' => '/js/jquery/jquery.min.js',
					'cdn'   => '//code.jquery.com/jquery-3.4.1.min.js',
                ],
			],
			'vendor'=>[
				'use_cdn'  => false,
                'location' => 'footer',
                'src'      => [
                    'local' => ['/assets/js/defaultVendors~admin~~36146cbb/bundle.js', '/assets/js/defaultVendors~admin~~4cee1585/bundle.js', '/assets/js/default~admin~common~~e8c10102.app.js', '/assets/js/defaultVendors~builde~973ae3bc/bundle.js','/assets/js/vendor.app.js'],
					'minify'=>['/assets/js/defaultVendors~admin~~36146cbb/bundle.min.js', '/assets/js/defaultVendors~admin~~4cee1585/bundle.min.js', '/assets/js/default~admin~common~~e8c10102.app.min.js', '/assets/js/defaultVendors~builde~973ae3bc/bundle.min.js','/assets/js/vendor.app.min.js'],
                ],
			],
			'jquery_datables'=>[
				'use_cdn'  => false,
                'location' => 'footer',
                'src'      => [
                    'local' => '/js/jquery/jquery.dataTables.min.js',
					'cdn'   => '//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js',
                ],
			],
			'jquery_migrate'=>[
				'use_cdn'  => false,
                'location' => 'footer',
                'src'      => [
                    'local' => '/js/jquery/jquery-migrate.min.js',
					'cdn'   => '//code.jquery.com/jquery-migrate-3.1.0.min.js',
                ],
			],
			'jquery_ui'=>[
				'use_cdn'  => false,
                'location' => 'footer',
                'src'      => [
                    'local' => 'js/jquery/jquery-ui.min.js',
					'cdn'   => '//code.jquery.com//ui/1.12.1/jquery-ui.min.js',
                ],
			],
			'app_common'=>[
				'use_cdn'  => false,
                'location' => 'footer',
                'src'      => [
                    'local' => '/assets/js/common.app.js',
					'minify' => '/assets/js/common.app.min.js',
                ],
			],
			'installer_app'=>[
				'use_cdn'  => false,
                'location' => 'footer',
                'src'      => [
                    'local' => '/assets/js/installer.app.js',
					'minify' => '/assets/js/installer.app.min.js',
                ],
			],
            'app'       => [
                'use_cdn'  => false,
                'location' => 'footer',
                'src'      => [
                    'local' => '/js/app.js',
                ],
            ],
			'charts' => [
                'use_cdn'  => true,
                'location' => 'footer',
                'src'      => [
                    'local' => ['/vendor/charts/highcharts.js', '/vendor/charts/echarts-en.min.js'],
                    'cdn'   => ['//cdnjs.cloudflare.com/ajax/libs/highcharts/6.0.6/highcharts.js', '//cdnjs.cloudflare.com/ajax/libs/echarts/4.0.2/echarts-en.min.js']
                ],
            ],
            'modernizr' => [
                'use_cdn'  => true,
                'location' => 'header',
                'src'      => [
                    'local' => '/vendor/core/packages/modernizr/modernizr.min.js',
                    'cdn'   => '//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.js',
                ],
            ],
        ],
        'styles'  => [
            'bootstrap' => [
                'use_cdn'    => true,
                'location'   => 'header',
                'src'        => [
                    'local' => '/packages/bootstrap/css/bootstrap.min.css',
                    'cdn'   => '//stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css',
                ],
                'attributes' => [
                    'integrity'   => 'sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB',
                    'crossorigin' => 'anonymous',
                ],
            ],
			'app' => [
                'use_cdn'    => false,
                'location'   => 'header',
                'src'        => [
                    'local' => '/css/admin/style.css',
                ]
            ],
			'fontawesome' => [
                'use_cdn'    => false,
				'priority'=>100,
                'location'   => 'header',
                'src'        => [
                    'local' => '/vendor/fontawesome/css/all.css',
                    'cdn'   => '//use.fontawesome.com/releases/v5.10.2/css/all.csss',
                ]
            ],
			'angular-material' => [
                'use_cdn'    => false,
                'location'   => 'header',
                'src'        => [
                    'local' => 'css/angular-material.min.css',
                    'cdn'   => '//use.fontawesome.com/releases/v5.10.2/css/all.csss',
                ]
            ],
        ],
    ],
];
