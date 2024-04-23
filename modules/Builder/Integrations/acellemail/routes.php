<?php
/**
 * Route for Acellemail
 */
 
$api->group(['middleware' => ['api', 'api.auth']], function ($api) {
    $api->get('builder/integrations/acellemail/list', 'acellemail\Controllers\Controller@getList');
    $api->get('builder/integrations/acellemail/list/field', 'acellemail\Controllers\Controller@getAcellemailListField');
    $api->post('builder/integrations/acellemail/authorize', 'acellemail\Controllers\Controller@authorizeAccount');
});
