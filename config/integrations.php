<?php
return [
    'mailchimp' => [
        'enable'=>true,
        'display_name'=>'Mailchimp',
        'client_id' => env('MAILCHIMP_CLIENT_ID'),
        'secret' => env('MAILCHIMP_CLIENT_SECRET'),
        'authorize_type'=>'oAuth2',
        'fixed_attributes'=>[
            'authorize_type'
        ]
    ],
    'salesforce' => [
        'enable'=>true,
        'secure'=>true,
        'display_name'=>'Salesforce',
        'consumer_key'=>env('SALESFORCE_CONSUMER_KEY'),
        'consumer_secret'=>env('SALESFORCE_CONSUMER_SECRET'),
        'callbackURI'    => env('SALESFORCE_CALLBACK_URI'),
        'loginURL'       => env('SALESFORCE_LOGIN_URL'),
        'authorize_type'=>'oAuth2',
        'logo'=>'https://c1.sfdcstatic.com/content/dam/web/en_us/www/images/nav/salesforce-cloud-logo-sm.png',
        'fixed_attributes'=>[
            'authorize_type', 'logo', 'secure', 'callbackURI'
        ]
    ],
    
    'zohocrm' => [
        'enable'=>true,
        'secure'=>true,
        'display_name'=>'Zoho CRM',
        'logo'=>'https://img.zohostatic.com/zohoone/20180706_1685648/zhome/images/logos/zoho.png',
        'client_id'=>env('ZOHO_CLIENT_ID'),
        'client_secret'=>env('ZOHO_CLIENT_SECRET'),
        'access_type'=>'offline',
        'accounts_url'=>'https://accounts.zoho.com',
        'token_persistence_path'=>'',
        'scope'=>'ZohoCRM.modules.ALL,aaaserver.profile.READ,ZohoCRM.settings.READ',
        'apiBaseUrl'=>'www.zohoapis.com',
        'apiVersion'=>'v2',
        'authorize_type'=>'oAuth2',
        'redirect_uri'=>'',
        'sandbox'=>false,
		'persistence_handler_class'=>'Modules\Builder\Integrations\zohocrm\ZohoOAuthPersistenceHandler',
        'fixed_attributes'=>[
            'authorize_type', 'logo', 'sandbox', 'secure', 'access_type', 'accounts_url', 'token_persistence_path', 'scope',
            'apiBaseUrl', 'apiVersion', 'scope', 'persistence_handler_class', 'redirect_uri'
        ]

    ],
    'getresponse' => [
        'enable'=>true,
        'display_name'=>'GetResponse',
        'authorize_type'=>'key',
        'fixed_attributes'=>[
            'authorize_type'
        ]
    ],
    'mailwizz' => [
        'enable'=>true,
        'display_name'=>'Mailwizz',
    
        'logo'=>'http://www.gravatar.com/avatar/cdd49ad67fafb46c0fd929cdfa689e07?s=90',
        'fixed_attributes'=>[
            'logo'
        ]

    ],
	'acellemail' => [
        'enable'=>true,
        'display_name'=>'Acellemail',
    
        'logo'=>'https://www.acellemail.com/image/logo.png',
        'fixed_attributes'=>[
            'logo'
        ]

    ],
    'aweber' => [
        'enable'=>true,
        'display_name'=>'Aweber',
        'client_id' => env('AWEBER_CLIENT_ID'),
        'secret' => env('AWEBER_CLIENT_SECRET'),
        'authorize_type'=>'oAuth2',
        'fixed_attributes'=>[
            'authorize_type'
        ]
    ],
    'activecampaign' => [
        'enable'=>true,
        'display_name'=>'ActiveCampaign',
        //'url' => env('ACTIVECAMPAIGN_URL'),
        //'key' => env('ACTIVECAMPAIGN_KEY'),
        'authorize_type'=>'key',
        'fixed_attributes'=>[
            'authorize_type'
        ]
    ],
    'campaignmonitor' => [
        'enable'=>true,
        'display_name'=>'CampaignMonitor',
       // 'client_id' => env('CAMPAIGNMONITOR_CLIENT_ID'),
        'authorize_type'=>'key',
        'fixed_attributes'=>[
            'authorize_type'
        ]
    ],
    'infusionsoft' => [
        'enable'=>true,
        'display_name'=>'InfusionSoft',
        'client_id' => env('INFUSION_CLIENT_ID'),
        'client_secret' => env('INFUSION_CLIENT_SECRET'),
        'authorize_type'=>'oAuth2',
        'fixed_attributes'=>[
            'authorize_type'
        ]
    ],
    'hubspot' => [
        'enable'=>true,
        'display_name'=>'Hubspot',
        'client_id' => env('HUBSPOT_CLIENT_ID'),
        'secret' => env('HUBSPOT_CLIENT_SECRET'),
        'logo'=>'https://www.hubspot.com/hubfs/HubSpot_Logos/HSLogo_color.svg',
        'scope'=>'contacts%20oauth%20forms',
        'authorize_type'=>'oAuth2',
        'fixed_attributes'=>[
            'authorize_type', 'logo', 'scope'
        ]
    
    ],
	'zapier' => [
        'enable'=>true,
        'display_name'=>'Zapier Webhook',
		'logo'=>'https://images.zapier.com/storage/services/652eac8b0c2ff6ece8f5906ae69b3f84.128x128.png?background=f1f4f5&format=jpg',
		'fixed_attributes'=>[
            'logo'
        ]
    ],
    'mail' => [
        'enable'=>true,
        'display_name'=>'Email',
    ],
    'url' => [
        'enable'=>true,
        'display_name'=>'URL',
    ],
    'g_recaptcha' => [
        'disabled'=>true,
        'enable'=>false,
    ]
];
