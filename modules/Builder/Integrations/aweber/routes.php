<?php
    Route::get('auth/integration/aweber', array('uses' => 'aweber\Controllers\AweberController@callback'));
    Route::get('auth/integration/aweber/callback', array('uses' => 'aweber\Controllers\AweberController@callback'));
    Route::post('/ajax/subscribe/aweber', 'aweber\Controllers\AweberController@subscribe');
    
    $api->group(['middleware' => ['api', 'api.auth']], function ($api) {
        $api->get('builder/integrations/aweber/list', 'aweber\Controllers\AweberController@getList');
        $api->get('builder/integrations/aweber/list/fields', 'aweber\Controllers\AweberController@getListField');
    });
