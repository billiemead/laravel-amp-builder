<?php
    
    
    Route::post('/ajax/subscribe/mailchimp', 'mailchimp\Controllers\MailchimpController@subscribe');
    $api->group(['middleware' => ['api', 'api.auth']], function ($api) {
        $api->get('/builder/integrations/mailchimp/list', 'mailchimp\Controllers\MailchimpController@getMailchimpList');
        $api->get('/builder/integrations/mailchimp/list/field', 'mailchimp\Controllers\MailchimpController@getMailchimpListField');
    });
    Route::group(['middleware' => ['jwt.auth']], function ($api) {
        Route::get('auth/integration/mailchimp', array('uses' => 'mailchimp\Controllers\MailchimpController@callback'));
        Route::get('auth/integration/mailchimp/callback', array('uses' => 'mailchimp\Controllers\MailchimpController@callback'));
    });
