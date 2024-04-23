<?php

namespace Modules\Builder\Integrations\campaignmonitor;

use App\Models\Connection;
use DB;
use Illuminate\Http\Request;
use Validator;

class Handler
{
    public static function getRestClient($connection, $class = \CS_REST_Clients::class, $list = null)
    {
        $key = $connection->token;
        $client_id = $connection->account_id;
        $auth = ['api_key' => $key];
        if (!empty($list)) {
            $wrap = new $class($list, $auth);
        } else {
            $wrap = new $class($client_id, $auth);
        }
        return $wrap;
    }
    

    public function subscribe($post_data, $integration)
    {
        $list = array_get($integration, 'list');
        $ids = explode('-', $list);
        $connection_id = $ids[0];
        $list = $ids[1];
        $connect = Connection::where('id', $connection_id)->first();
        if (isset($connect)) {
            $wrap = self::getRestClient($connect, \CS_REST_Subscribers::class, $list);
            $post_data['ConsentToTrack'] = "Unchanged";
            $result = $wrap->add($post_data);
            if ($result->http_status_code != 201) {
                $response = $result->response;
                $code = $response->Code;
                if ($code == 205 || $code == 206) {
                    $post_data['Resubscribe'] = true;
                    $result = $wrap->add($post_data);
                } else {
                    throw new \Exception($response->Message);
                }
            }
            return $result;
        }
        return json_encode(1);
    }
}
