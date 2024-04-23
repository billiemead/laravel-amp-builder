<?php

namespace Modules\Builder\Integrations\mailwizz;

use App\Models\Connection;

class Handler
{
    public function subscribe($post_data, $integration)
    {
        $list = array_get($integration, 'list');
        $ids = explode('-', $list);
        $connection_id = $ids[0];
        $list = $ids[1];
        $connect = Connection::find($connection_id);
        if (isset($connect)) {
            self::setupMailwizz($connect);
            $endpoint = new \MailWizzApi_Endpoint_ListSubscribers();
            
            $response = $endpoint->createUpdate($list, $post_data);
            $response = $response->body->toArray();
            if (!isset($response['status']) && $response['status'] != 'success') {
                return 'Unable to subscribe!';
            }
            return 1;
        }
        return 1;
    }
    public static function setupMailwizz($connection)
    {
        $details = unserialize($connection->details);
        $url = array_get($details, 'url');
        $public_key = array_get($details, 'public_key');
        $private_key = array_get($details, 'private_key');
        $config = new \MailWizzApi_Config(array(
            'apiUrl'        => $url,
            'publicKey'     => $public_key,
            'privateKey'    => $private_key,
            'components' => array(
                'cache' => array(
                    'class'     => 'MailWizzApi_Cache_File',
                    'filesPath' => dirname(__FILE__) . '/../MailWizzApi/Cache/data/cache', // make sure it is writable by webserver
                )
            ),
        ));
        
        \MailWizzApi_Base::setConfig($config);
    }
}
