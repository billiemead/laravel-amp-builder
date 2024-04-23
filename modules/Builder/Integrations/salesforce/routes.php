<?php
        
$api->group(['middleware' => ['api', 'api.auth']], function ($api) {
    $api->get('builder/integrations/salesforce/list', 'salesforce\Controllers\SalesforceController@getSalesforceList');
    $api->post('builder/integrations/salesforce/list/field', 'salesforce\Controllers\SalesforceController@getsalesforceListField');
});
Route::get('auth/integration/salesforce/callback/r', array('uses' => 'salesforce\Controllers\SalesforceController@callbackRedirect'));

Route::group(['middleware' => ['jwt.auth']], function ($api) {
    Route::get('auth/integration/salesforce', array('uses' => 'salesforce\Controllers\SalesforceController@authenticate'));
    Route::get('auth/integration/salesforce/callback', array('uses' => 'salesforce\Controllers\SalesforceController@callback'));
});
