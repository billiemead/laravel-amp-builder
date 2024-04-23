<?php
    Route::post('/ajax/subscribe/zohocrm', 'zohocrm\Controllers\Controller@subscribe');
    $api->group(['middleware' => ['api', 'api.auth']], function ($api) {
        $api->get('builder/integrations/zohocrm/list', 'zohocrm\Controllers\Controller@getZohoList');
    });
    Route::group(['middleware' => ['jwt.auth']], function ($api) {
        Route::get('auth/integration/zohocrm', array('uses' => 'zohocrm\Controllers\Controller@callback'));
        Route::get('auth/integration/zohocrm/callback', array('uses' => 'zohocrm\Controllers\Controller@callback'));
    });
