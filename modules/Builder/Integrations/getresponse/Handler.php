<?php

namespace Modules\Builder\Integrations\getresponse;

use App\Models\Connection;
use Getresponse\Sdk\GetresponseClientFactory;

class Handler
{
    public static function getApi($connection)
    {
        if (is_string($connection)) {
            $api = API::createFromToken($connection->token);
        } else {
            $api = API::createFromConnection($connection);
        }
        return $api;
    }
    public function subscribe($post_data, $integration)
    {
        $list = array_get($integration, 'list');
        $ids = explode('-', $list);
        $connection_id = $ids[0];
        $list = $ids[1];
        $connect = Connection::find($connection_id);
        if (!empty($connect)) {
            $api = self::getApi($connect);
            $post_data['campaignId'] = $list;
            $response = $api->addContact($post_data);
            if (!empty($response->httpStatus) && $response->httpStatus == 409) {
                $message = $response->message;
                if ($response->code == 1008) {
                    return $message;
                } else {
                    return "Error: ".$message;
                }
            }
        }
        return 1;
    }
}
