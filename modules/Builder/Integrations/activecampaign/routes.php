<?php

$api->group(['middleware' => ['api', 'api.auth']], function ($api) {
    $api->get('builder/integrations/activecampaign/campaigns', 'activecampaign\Controllers\ActiveCampaignController@getCampaigns');
    $api->post('builder/integrations/activecampaign/authorize', 'activecampaign\Controllers\ActiveCampaignController@authorizeAccount');
});
