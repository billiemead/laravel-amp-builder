<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */
    'home'             => 'Home',
    'dashboard'             => 'Dashboard',
    'general'           => 'General',
    'template_name'           => 'Name',
    'theme'=>'Theme',
    'category'=>'Category',
    'payment'           => 'Payment',
    'settings'                => 'Settings',
    'title'                => 'Title',
	
    'brand_name'=>'Brand Name',
    'description'           => 'Description',
    'keywords'            => 'Keywords',
    'fav_icon'                => 'Fav icon',
    'logo'               => 'Logo',
    'save'=>'Save',
    'view'=>'View',
    'clone'=>'Clone',
    'close'=>'Close',
    'add_category'=>'Add Category',
    'categories'=>'Categories',
    'edit_category'=>'Edit Category',
    'google_api_key'=>'Google API Key',
    'enabled'=>'Enabled',
    'export'=>'Export',
	'filter_by_category'=>'Filter by category',
	'filter_by_status'=>'Filter by status',
	'filter_by_role'=>'Filter by role',
	'filter_by_type'=>'Filter by type',
    'theme_name'             => 'Name',
    'frontend'=>'Frontend',
    'css'=>'CSS',
  
    'page_websites'=>[
        'title'=>'Projects',
        'add'=>'Add project',
        'list_columns'=>[
            'id'=>'ID',
            'name'=>'name',
            'owner'=>'Owner',
            'variants'=>'Pages'
        ]
    ],
    'page_templates'=>[
        'title'=>'Templates',
        'edit_title'=>'Edit Template',
		'edit_btn'=>'Edit',
        'add_title'=>'Add Template',
        'add'=>'Add Template',
        'import'=>'Import Template',
        'list_columns'=>[
            'id'=>'ID',
            'name'=>'name',
            'type'=>'Type',
            'category'=>'Category',
			'image'=>'Screenshot',
            'builder_btn'=>'Open in Builder'
        ],
        'template_types'=>[
            'page'=>'Page',
            'popup'=>'Popup',
            'section'=>'Section',
        ],
        'entry_name'=>'Template name',
        'entry_type'=>'Type',
        'filter_user_template'=>'User templates',
		'upload_dialog'=>[
			'title'=>'Import Template',
			'instructions'=>'Select .template file or .zip file',
			'imported_templates'=>'Imported templates',
			'updated'=>'Updated',
			'new'=>'New'
		]
    ],
	'page_domains'=>[
        'title'=>'Domains',
       
        'list_columns'=>[
            'id'=>'ID',
            'name'=>'Name',
			'path'=>'Path',
			'subdomain'=>'Subdomain',
			'site_id'=>'Landing page ID'
        ],
	],
    'page_users'=>[
        'title'=>'Users',
        'edit_title'=>'Edit User',
        'add_title'=>'Add User',
        'add'=>'Add User',
        'list_columns'=>[
            'id'=>'ID',
            'name'=>'name',
            'email'=>'Email',
            'active'=>'Actived?',
            'expire_at'=>'Expire at',
            'roles'=>'Roles',
            'last_login'=>'Last login'
        ],
        'entry_name'=>'Full name',
        'entry_email'=>'Email',
        'entry_password'=>'Password',
        'entry_permission'=>'Permission',
        'entry_plan'=>'Plan',
        'entry_active'=>'Actived?',
        'entry_activated'=>'Email validated',
        'entry_nerver_expire'=>'Never expire',
        'entry_expire_at'=>'Account expire at'
        
    ],
    'page_template_category'=>[
        'title'=>'Template categories',
        'edit_title'=>'Edit category',
        'add_title'=>'Add category',
        'add'=>'Add category',
        'list_columns'=>[
            'id'=>'ID',
            'title'=>'Title',
        
        ],
        'entry_title'=>'Title',
        'entry_description'=>'Description',
		'entry_page'=>'Page',
		'entry_page_description'=>'Display in page templates list',
		'entry_section'=>'Section',
		'entry_section_description'=>'Display in section templates list',
		'entry_popup'=>'Popup',
		'entry_popup_description'=>'Display in popup templates list',
		
        'template_types'=>[
            'page'=>'Page',
            'popup'=>'Popup',
            'section'=>'Section'
        ]
    ],
   
    'integration_services'=>[
        'client_id'=>'Client ID',
        'secret'=>'Client Secret',
        'consumer_key'=>'Consumer key',
        'consumer_secret'=>'Consumer Secret',
        'public_key'=>'Public key',
        'private_key'=>'Private Secret',
        'mailchimp'=>[
            'help_url'=>'https://ampbuilder-docs.readthedocs.io/en/latest/_crm/mailchimp.html'
        ],
        'activecampaign'=>[
            'url'=>'URL',
            'key'=>'Key',
        ],
        'salesforce'=>[
            'help_url'=>'https://ampbuilder-docs.readthedocs.io/en/latest/_crm/saleforce.html'
        ],
        'aweber'=>[
            'help_url'=>'https://ampbuilder-docs.readthedocs.io/en/latest/_crm/aweber.html'
        ],
        'infusionsoft'=>[
            'help_url'=>'https://ampbuilder-docs.readthedocs.io/en/latest/_crm/infusionsoft.html'
        ],
        'zohocrm'=>[
            'help_url'=>'https://ampbuilder-docs.readthedocs.io/en/latest/_crm/zohocrm.html'
        ],
        'hubspot'=>[
            'api_key'=>'API Key',
            'help_url'=>'https://ampbuilder-docs.readthedocs.io/en/latest/_crm/hubspot.html',
        ]
    ],
    'authentication_services'=>[
        'activation'=>'Require Email activation',
        'disable_login'=>'Disable Login',
        'disable_register'=>'Disable register',
        'send_welcome_email'=>'Send welcome email',
		'enable_recaptcha'=>'Enable Recaptcha',
		'recaptcha_secret_key'=>'Recaptcha Secret Key',
		'recaptcha_site_key'=>'Recaptcha Site Key',
		'recaptcha_version'=>'Recaptcha Version',
		
    ],
    'mail_services'=>[
        'driver'=>'Driver',
        'encryption'=>'Encryption',
        'from'=>'From address',
        'from_name'=>'From name',
        'host'=>'Host',
        'port'=>'Port',
        'username'=>'Username',
        'password'=>'Password',
        'mailgun'=>[
            'domain'=>'Domain',
            'secret'=>'Secret key'
        ],
        'ses'=>[
            'region'=>'Region',
            'secret'=>'SES Secret key',
            'key'=>'SES key'
        ],
        'send_test_mail'=>'Send Test Email',
        'send_test_mail_title'=>'Want to test? Click save and fill this form',
    ],
    'settings_page'=>[
        'general_tab'=>'General',
        'integrations_tab'=>'Integrations',
        'auth_tab'=>'Authentication',
        'mail_tab'=>'Mail',
        'landingpage_tab'=>'Landingpage',
        'analytic_tab'=>'Analytic',
		'cookie_consent_tab'=>'EU Cookie Consent',
		'gdpr_tab'=>'GDPR',
		'locale_tab'=>'Language',
		'publishing_tab'=>'Publishing',
		'screenshot_tab'=>'Screenshot',
		'cache_tab'=>'Cache'
    ],
	'language_tab'=>[
		'rtl'=>'Right to Left',
		'language'=>'Language',
	],
	
	'publishing_tab'=>[
		'domain_enabled'=>'Enable custom domain publishing',
		'subdomain_name'=>'Subdomain',
		'subdomain_enabled'=>'Enable subdomain publishing',
		'domain_instruction'=>'Custom domain instructions for customer'
	],
	'screenshot_tab'=>[
		'provider'=>'Provider',
		'access_key'=>'Access key',
	],
    'updated_at'=>'Updated at',
    'created_at'=>'Created at',
	'update_available'  => 'An update is available!',
    'outdated'          => 'You are running an out of date release :current, there is an updated release ' .
                           ':latest available!',
];
