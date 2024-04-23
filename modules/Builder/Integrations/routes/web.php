<?php
Route::group(['middleware' => ['auth']], function () {
    Route::get('auth/integration/{provider}', array('as'=>'integrationRoute','uses' => 'IntegrationController@handleintegrationCallback'));
    Route::get('auth/integration/{provider}/callback', array('as'=>'integrationCallbackUrl', 'uses' => 'IntegrationController@handleintegrationCallback'));
});

Route::post('/ajax/integration/sendForm/{variant}/{form}', array('middleware' => 'ampcors:variant','as'=>'integrationSubscribeRoute', 'uses' => 'IntegrationController@subscribe'));
Route::get('/ajax/integration/sendForm/{variant}/{form}', array('middleware' => 'ampcors:variant','as'=>'integrationSubscribeRoute', 'uses' => 'IntegrationController@subscribe'));
