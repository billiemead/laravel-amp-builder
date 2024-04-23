<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default filesystem disk that should be used
    | by the framework. The "local" disk, as well as a variety of cloud
    | based disks are available to your application. Just store away!
    |
    */

    'default' => env('FILESYSTEM_DRIVER', 'local'),

    /*
    |--------------------------------------------------------------------------
    | Default Cloud Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Many applications store files both locally and in the cloud. For this
    | reason, you may specify a default "cloud" driver here. This driver
    | will be bound as the Cloud disk implementation in the container.
    |
    */

    'cloud' => env('FILESYSTEM_CLOUD', 's3'),

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | Here you may configure as many filesystem "disks" as you wish, and you
    | may even configure multiple disks of the same driver. Defaults have
    | been setup for each driver as an example of the required options.
    |
    | Supported Drivers: "local", "ftp", "sftp", "s3", "rackspace"
    |
    */

    'authorizationToken'=>'utnhX-K5mHcAAAAAAAAHrJn87MOqov_OtArpxQDSvq9LqA4yqSbmL-wAE6TaS3tH',
    'disks' => [

        'local' => [
            'driver' => 'local',
            'root'   => storage_path('app'),
        ],
        'uploads' => [
            'driver' => 'local',
            'root'   => storage_path('app/public/media'),
            'url'=>(config('app.url').'/storage/media'),
        ],
        'libraries' => [
            'driver' => 'local',
            'root'   => public_path('assets/libraries'),
            'url'=>(config('app.url').'/assets/libraries'),
			'cacheable'=>true,
			'cacheTimeout'=> 2* 60 * 60
        ],
        'libraries_icon' => [
            'driver' => 'local',
            'root'   => public_path('assets/icons'),
            'url'=>(config('app.url').'/assets/icons'),
			'cacheable'=>true,
			'cacheTimeout'=> 2* 60 * 60
        ],
        
        'sites' => [
            'driver' => 'local',
            'root'   => storage_path('app/public/sites'),
            'url'=>(config('app.url').'/storage/sites'),
        ],
        'templates' => [
            'driver' => 'local',
            'root'   => storage_path('app/public/templates'),
            'url'=>(config('app.url').'/storage/templates'),
        ],
        'screenshot' => [
            'driver' => 'local',
            'root'   => storage_path('app/public/screenshots'),
            'url'=>(config('app.url').'/storage/screenshots'),
        ],
        'ftp' => [
            'driver'   => 'ftp',
            'host'     => 'ftp.example.com',
            'username' => 'your-username',
            'password' => 'your-password',

            // Optional FTP Settings...
            // 'port'     => 21,
            // 'root'     => '',
            // 'passive'  => true,
            // 'ssl'      => true,
            // 'timeout'  => 30,
        ],

        's3' => [
            'driver' => 's3',
            'key'    => 'your-key',
            'secret' => 'your-secret',
            'region' => 'your-region',
            'bucket' => 'your-bucket',
        ],

        'rackspace' => [
            'driver'    => 'rackspace',
            'username'  => 'your-username',
            'key'       => 'your-key',
            'container' => 'your-container',
            'endpoint'  => 'https://identity.api.rackspacecloud.com/v2.0/',
            'region'    => 'IAD',
            'url_type'  => 'publicURL',
        ],
        'dropbox'=>[
            'authorizationToken'=>'utnhX-K5mHcAAAAAAAAHrJn87MOqov_OtArpxQDSvq9LqA4yqSbmL-wAE6TaS3tH',
        ]

    ],

];
