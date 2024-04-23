<?php
    
    Route::post('/ajax/subscribe/infusionsoft', 'infusionsoft\Controllers\InfusionSoftController@subscribe');
    
    $api->group(['middleware' => ['api', 'api.auth']], function ($api) {
        $api->get('builder/integrations/infusionsoft/list', 'infusionsoft\Controllers\InfusionSoftController@getList');
        $api->get('builder/integrations/infusionsoft/campaigns', 'infusionsoft\Controllers\InfusionSoftController@getInfusionsoftCampaign');
    });
    Route::group(['middleware' => ['jwt.auth']], function ($api) {
        Route::get('auth/integration/infusionsoft', array('uses' => 'infusionsoft\Controllers\InfusionSoftController@callback'));
        Route::get('auth/integration/infusionsoft/callback', array('uses' => 'infusionsoft\Controllers\InfusionSoftController@callback'));
    });
