<?php

namespace Modules\Builder\Integrations\hubspot;

use App\Models\Connection;
use Validator;

class Handler
{
    public static function getHttpClient($connection)
    {
        $expired_in = $connection->expired_in;
        $now = \Carbon\Carbon::now();
        if ($expired_in < $now) {
            $connection = self::_refreshConnectionToken($connection);
        }
        $details = unserialize($connection->details);
        $access_token = $details['access_token'];
        $client = new \SevenShores\Hubspot\Http\Client([
            'key'=>$access_token,
            'oauth2'=>true
        ]);
        return $client;
    }
    protected static function getOauthClient()
    {
        $config = config('integrations.hubspot');
        $client = new \SevenShores\Hubspot\Http\Client([
            'key'=>$config['secret']
        ]);
        $api = new \SevenShores\Hubspot\Resources\OAuth2($client);
        return $api;
    }
    protected static function _refreshConnectionToken($connection)
    {
        $api = self::getOauthClient();
        $config = config('integrations.hubspot');

        $refresh_token = $connection->refresh_token;

        $response = $api->getTokensByRefresh($config['client_id'], $config['secret'], $refresh_token);
        if ($response->getStatusCode() != 200) {
            throw new \Exception($response->getReasonPhrase());
        }
        $access_token = $response['access_token'];
        $refresh_token = $response['refresh_token'];
        $info = $api->getAccessTokenInfo($access_token);
        $expired_in = \Carbon\Carbon::now();
        $expired_in = $expired_in->addSeconds($response['expires_in']);
        $connection->fill([
            'token'=>$access_token,
            'refresh_token'=>$refresh_token,
            'expired_in'=>$expired_in,
            'details'=>serialize($response->toArray()),
            'updated_at'=>\Carbon\Carbon::now()

        ])->save();

        return $connection;
    }
    public function subscribe($post_data, $integration)
    {
        $connection_id = array_get($integration, 'account');
        $list = array_get($integration, 'list');
        $ids = explode(':', $list);
        $portalId = $ids[0];
        $guid = $ids[1];
        $connect = Connection::find($connection_id);
        if (!empty($connect)) {
            $client = self::getHttpClient($connect);
            
            $hubspot = new \SevenShores\Hubspot\Resources\Forms($client);
            $response = $hubspot->submit($portalId, $guid, $post_data);
            $statusCode = $response->getStatusCode();
            if ($statusCode == 500 || $statusCode == 404) {
                throw new \Exception($response->getReasonPhrase(). print_r($post_data, true));
            }
            return print_r($response, true);
        }
        return 1;
    }
}
