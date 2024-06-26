<?php

return [

    /*
     * Use this setting to enable the cookie consent dialog.
     */
    'enabled' => env('COOKIE_CONSENT_ENABLED', true),

    /*
     * The name of the cookie in which we store if the user
     * has agreed to accept the conditions.
     */
    'cookie_name' => 'laravel_cookie_consent',

    /*
     * Set the cookie duration in days.  Default is 365 * 20.
     */
    'cookie_lifetime' => 365 * 20,
	'gdpr_compliance'=>[
	    "scopes"=> [
			[
				"scope"=> "functional",
				"required"=> 1,
				"title"=> "Functional cookies",
				"description"=> "These are the cookies we set purely for functionalities in our websites. We can not track you in any way by settings these. For example if we didn't set a cookie that stored these settings, we wouldn't be able to not constantly prompt you with this screen."
			],
			[
				"scope"=> "analytical",
				"required"=> 0,
				"title"=> "Analytical cookies",
				"description"=> "With these cookies, behaviour on our website can be monitored through third party services. These cookies can be used by said third parties to track you."
			]
		],
		"messages"=>
		[
			"required_help"=> "These cookies can not be unset during your visit to this website, because this would result in degraded performance.",
			"settings_button"=> "Cookie Settings",
			"cookiebar_title"=> "Change your cookie settings.",
			"cookiebar_button"=> "Accept Settings",
			"cookiebar_description"=> "To comply with new regulations regarding GDPR we are now obligated by law to provide you with settings surrounding cookies. We have not set any cookies that would be able to track you. If you wish to change these settings later on, we will provide you with a button in order to do so."
		]
	]
];
