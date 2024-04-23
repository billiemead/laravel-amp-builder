<?php
    Route::post('/ajax/subscribe/campaignmonitor', 'campaignmonitor\Controllers\CampaignMonitorController@subscribe');
    
    $api->group(['middleware' => ['api', 'api.auth']], function ($api) {
        $api->post('builder/integrations/campaignmonitor/authorize', 'campaignmonitor\Controllers\CampaignMonitorController@authorizeAccount');
        $api->get('builder/integrations/campaignmonitor/campaigns', 'campaignmonitor\Controllers\CampaignMonitorController@getCampaigns');
        $api->get('builder/integrations/campaignmonitor/campaigns/fields', 'campaignmonitor\Controllers\CampaignMonitorController@getCampaignFields');
    });
