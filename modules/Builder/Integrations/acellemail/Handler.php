<?php

namespace Modules\Builder\Integrations\acellemail;

use App\Models\Connection;

class Handler
{
    /**
     * Handle form request
     * @param $post_data
     * @param $integration
     * @return int|string
     */
    public function subscribe($post_data, $integration)
    {
        $list = array_get($integration, 'list');
        $ids = explode('-', $list);
        $connection_id = $ids[0];
        $list = $ids[1];
        $connect = Connection::find($connection_id);
        if (isset($connect)) {
            $api = AcellemailAPI::createWithConnection($connect);
            $response = $api->subscribe($post_data, $list);
            if (!is_array($response)) {
                return 'Unable to subscribe!. Details: '.$response;
            }
            return 1;
        }
        return 1;
    }
}
