<?php
    Route::post('integration/{provider}/authorize', array('as'=>'integrationAuthorizeRoute', 'uses' => 'IntegrationController@authorizeAccount'));

    Route::group(['middleware' => ['api', 'api.auth', 'VerifyBuilderApi']], function () {
        Route::get('provider/list', 'IntegrationController@getIntegrationProviders');
        Route::get('connections/{provider}', 'IntegrationController@getIntegrationAccount');
        Route::match(['get','post'], 'integrations/{provider}/{action}/{params?}', 'Controller@executeProviderRoute');
    });
