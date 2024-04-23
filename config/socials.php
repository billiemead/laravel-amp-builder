<?php
return [
    'facebook' => [
        'status' => true,
        'title' => 'Facebook',
        'client_secret' => '9d19fba6110b9c955a5090f750430238',
        'client_id' => '177712549303212',
        'redirect' => "/auth/facebook/callback/",
        'fixed_attributes'=>[
            'redirect'
        ]
    ],
    'twitter' => [
        'status' => true,
        'title' => 'Twitter',
        'client_id' => 'kd3F2bbz89iZnG8jcaaNC7LPP',
        'client_secret' => 'SPOZnD5a35XtpyRnaw62QQCLqZN3WE7qy1cfvv69QHnRdLye45',
        'redirect' => "/auth/twitter/callback",
        'fixed_attributes'=>[
            'redirect'
        ]
    ],
    'google' => [
        'status' => true,
        'title' => 'Google',
        'client_id' => '490301328090-t48ldh554pv4imtf4fg6vir1snkm747b.apps.googleusercontent.com',
        'client_secret' => 'nx1MfAlLgkhKGTFJQ17RqCeO',
        'redirect' => "/auth/google/callback",
        'fixed_attributes'=>[
            'redirect'
        ]
    
    ],
];
