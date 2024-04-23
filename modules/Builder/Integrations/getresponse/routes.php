<?php
    Route::post('/ajax/subscribe/getresponse', 'getresponse\Controllers\GetresponseController@subscribe');
    
    $api->group(['middleware' => ['api', 'api.auth']], function ($api) {
        $api->get('builder/integrations/getresponse/campaigns', 'getresponse\Controllers\GetresponseController@getCampaigns');
        $api->post('builder/integrations/getresponse/authorize', 'getresponse\Controllers\GetresponseController@authorizeGetresponseAccount');
    });
