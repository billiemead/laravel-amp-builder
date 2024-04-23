<?php
    
    Route::get('auth/integration/hubspot/callback/r', array('uses' => 'hubspot\Controllers\Controller@callback_redirect'));
    $api->group(['middleware' => ['api', 'api.auth']], function ($api) {
        $api->get('builder/integrations/hubspot/forms', 'hubspot\Controllers\Controller@getHubspotForms');
    });
    Route::group(['middleware' => ['jwt.auth']], function ($api) {
        Route::get('auth/integration/hubspot', array('uses' => 'hubspot\Controllers\Controller@callback'));
        Route::get('auth/integration/hubspot/callback', array('uses' => 'hubspot\Controllers\Controller@callback'));
    });
