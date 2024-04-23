<?php

namespace Modules\Builder\Integrations\aweber;

use App\Models\Connection;
use Validator;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Psr7;

class Handler
{
	const OAUTH_URL = 'https://auth.aweber.com/oauth2/';
	const TOKEN_URL = 'https://auth.aweber.com/oauth2/token';
	const BASE_URI = 'https://api.aweber.com/1.0/';

    public static function getApi()
    {
        $config = config('integrations.aweber');
        $consumerKey = array_get($config, 'client_id');
        $consumerSecret = array_get($config, 'secret');
        $aweberAPI = new \AWeberAPI($consumerKey, $consumerSecret);
        return $aweberAPI;
    }
	
	public static function getOauth2Provider($redirectUri)
    {
        $config = config('integrations.aweber');
        $clientId = array_get($config, 'client_id');
        $clientSecret = array_get($config, 'secret');
		
		$scopes = [
			'account.read',
			'list.read',
			'list.write',
			'subscriber.read',
			'subscriber.write',
			'email.read',
			'email.write',
			'subscriber.read-extended'
		];
        $provider = new \League\OAuth2\Client\Provider\GenericProvider([
			'clientId' => $clientId,
			'clientSecret' => $clientSecret,
			'redirectUri' => $redirectUri,
			'scopes' => $scopes,
			'scopeSeparator' => ' ',
			'urlAuthorize' => self::OAUTH_URL . 'authorize',
			'urlAccessToken' => self::OAUTH_URL . 'token',
			'urlResourceOwnerDetails' => 'https://api.aweber.com/1.0/accounts'
		]);
        return $provider;
    }
    public static function refreshToken($connection) {
		$details = unserialize($connection->details);
		$isTokenExpired = $details->hasExpired();
		if(!$isTokenExpired){
		//	throw new \Exception('Token Still works: '.$details->getExpires(). ' '.time());
			return;
		}
			
		$client = new \GuzzleHttp\Client();
		$config = config('integrations.aweber');
        $clientId = array_get($config, 'client_id');
        $clientSecret = array_get($config, 'secret');
		
		$response = $client->post(
			self::TOKEN_URL, [
				'auth' => [
					$clientId, $clientSecret
				],
				'json' => [
					'grant_type' => 'refresh_token',
					'refresh_token' => $details->getRefreshToken()
				]
			]
		);
		$body = $response->getBody();
		$newCreds = json_decode($body, true);
		$newToken = new \League\OAuth2\Client\Token\AccessToken($newCreds);
		$accessToken = $newCreds['access_token'];
		$refreshToken = $newCreds['refresh_token'];
		$connection
			->update(
				[
				'details'=>serialize($newToken),
				'token'=>$accessToken,
				'updated_at' => \Carbon\Carbon::now(),
				]
			);
	}
    public static function getCollection($client, $accessToken, $url) {
		$client = new \GuzzleHttp\Client();
		$collection = array();
		while (isset($url)) {
			$request = $client->get($url,
				['headers' => ['Authorization' => 'Bearer ' . $accessToken]]
			);
			$body = $request->getBody();
			$page = json_decode($body, true);
			$collection = array_merge($page['entries'], $collection);
			$url = isset($page['next_collection_link']) ? $page['next_collection_link'] : null;
		}
		return $collection;
	}
	public static function getUser($accessToken)
	{
		$client = new \GuzzleHttp\Client();
		$accounts = self::getCollection($client, $accessToken, self::BASE_URI .'accounts');
		if(sizeof($accounts))
			return $accounts[0];
	}
	
	public static function getList($accountId, $accessToken)
	{
		$client = new \GuzzleHttp\Client();
		$lists = self::getCollection($client, $accessToken, self::BASE_URI .'accounts/'.$accountId.'/lists');
		return $lists;
		
	}
	public static function getCustomFields($accountId, $listId, $accessToken)
	{
		$client = new \GuzzleHttp\Client();
		$custom_fields = self::getCollection($client, $accessToken, self::BASE_URI .'accounts/'.$accountId.'/lists/'.$listId.'/custom_fields');
		return $custom_fields;
		
	}
    public function subscribe($post_data, $integration)
    {
        $list = array_get($integration, 'list');
        $ids = explode('-', $list);
        $account_id = $ids[0];
        $list_id = $ids[1];
        $connect = Connection::find($account_id);
		$client = new \GuzzleHttp\Client();
        if (!empty($connect)) {
			self::refreshToken($connect);
            $accessToken = $connect->token;
            $account_id = $connect->account_id;
            $subscribesURL = self::BASE_URI ."accounts/{$account_id}/lists/{$list_id}/subscribers";
			$params = array(
				'ws.op' => 'find',
				'email' => $post_data['email']
			);
			$findSubscribeURL = $subscribesURL . '?' . http_build_query($params);
			$subscribers = self::getCollection($client, $accessToken, $findSubscribeURL);
            if (empty($subscribers)) {
				$body = $client->post($subscribesURL, [
					'json' => $post_data, 
					'headers' => ['Authorization' => 'Bearer ' . $accessToken]
				]);
				$subscriberUrl = $body->getHeader('Location')[0];
				$subscriberResponse = $client->get($subscriberUrl,
					['headers' => ['Authorization' => 'Bearer ' . $accessToken]])->getBody();
				$subscriber = json_decode($subscriberResponse, true);
                return $subscriber;
            } elseif (!empty($subscribers)) {
				$subscriberUrl = $subscribers[0]['self_link'];
				$subscriberResponse = $client->patch($subscriberUrl, [
						'json' => $post_data, 
						'headers' => ['Authorization' => 'Bearer ' . $accessToken]
					])->getBody();
				$subscriber = json_decode($subscriberResponse, true);
                //$subscriber[0]->misc_notes = array_get($post_data, 'misc_notes');
               // $subscriber[0]->save();
                return $subscriber;
            }
        }
        return json_encode(1);
    }
}
