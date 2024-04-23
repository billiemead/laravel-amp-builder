<?php
    Route::post('/ajax/subscribe/mailwizz', 'mailwizz\Controllers\Controller@subscribe');
    
    $api->group(['middleware' => ['api', 'api.auth']], function ($api) {
        $api->get('builder/integrations/mailwizz/list', 'mailwizz\Controllers\Controller@getList');
        $api->get('builder/integrations/mailwizz/list/field', 'mailwizz\Controllers\Controller@getMailwizzListField');
        $api->post('builder/integrations/mailwizz/authorize', 'mailwizz\Controllers\Controller@authorizeAccount');
    });
