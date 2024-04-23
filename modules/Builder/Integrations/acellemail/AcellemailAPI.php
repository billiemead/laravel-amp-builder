<?php

namespace Modules\Builder\Integrations\acellemail;

use App\Models\Connection;
use GuzzleHttp\Client;

class AcellemailAPI
{
    private $url;
    private $token;

    /**
     * AcellemailAPI constructor.
     * @param $url
     * @param $token
     */
    public function __construct($url, $token)
    {
        $this->url = $url;
        $this->token = $token;
    }

    /**
     * Create object with a \App\Models\Connection
     * @param Connection $connection
     * @return AcellemailAPI
     */
    public static function createWithConnection(Connection $connection)
    {
        $details = unserialize($connection->details);
        $api = new self($details['url'], $details['token']);
        return $api;
    }
    public function setUrl($url)
    {
        $this->url = $url;
    }
    public function setToken($token)
    {
        $this->token = $token;
    }
    protected function createUrl($endpoint)
    {
        $url = $this->url.'/'.$endpoint.'?api_token='.$this->token;
        return $url;
    }

    /**
     * Request API
     * @param $endpoint
     * @param null $method
     * @param array $params
     * @return mixed|\Psr\Http\Message\ResponseInterface
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function call($endpoint, $method = null, $params = array())
    {
        $client = new Client;
        $url = $this->createUrl($endpoint);
        $response = $client->request(strtoupper($method), $url, $params);
        return $response;
    }
    public function getList()
    {
        $response = $this->call('lists', 'get', [
            'headers'=>[
                'accept'=>'application/json'
            ]
        ]);
        $body = $response->getBody()->getContents();
        $reasonPhrase = $response->getReasonPhrase();
        if ($reasonPhrase == 'OK') {
            $body = json_decode($body, true);
            return $body;
        }
        return null;
    }
    public function getListDetail($list_uid)
    {
        $response = $this->call('lists/'.$list_uid, 'get', [
            'headers'=>[
                'accept'=>'application/json'
            ]
        ]);
        $body = $response->getBody()->getContents();
        $reasonPhrase = $response->getReasonPhrase();
        if ($reasonPhrase == 'OK') {
            $body = json_decode($body, true);
            return $body;
        }
        return null;
    }
    public function getSubscribes($email)
    {
        $response = $this->call('subscribers/email/'.$email, 'get', [
            'headers'=>[
                'accept'=>'application/json'
            ]
        ]);
        $body = $response->getBody()->getContents();
        $reasonPhrase = $response->getReasonPhrase();
        if ($reasonPhrase == 'OK') {
            $body = json_decode($body, true);
            return $body;
        }
        return null;
    }
    // Create or update subscriber
    public function subscribe($data, $list_uid)
    {
        // First, check if subscriber existed
        $subscribers = $this->getSubscribes($data['EMAIL']);
        $record_exists = false;
        $subscriber_uid = '';
        // Suscriber existed, just add to list
        if (is_array($subscribers) && !empty($subscribers['subscribers'])) {
            foreach ($subscribers['subscribers'] as $subscriber) {
                if ($subscriber['list_uid'] == $list_uid) {
                    $record_exists = true;
                    $subscriber_uid = $subscriber['uid'];
                    break;
                }
            }
        }
        // Create new subscriber then add to this list
        if (!$record_exists) {
            $response = $this->call('lists/'.$list_uid.'/subscribers/store', 'post', [
                'headers'=>[
                    'accept'=>'application/json'
                ],
                'form_params'=>$data
            ]);
        } else {
            $response = $this->call('lists/'.$list_uid.'/subscribers/'.$subscriber_uid.'/update', 'patch', [
                'headers'=>[
                    'accept'=>'application/json'
                ],
                'form_params'=>$data
            ]);
        }
        
        $body = $response->getBody()->getContents();
        $reasonPhrase = $response->getReasonPhrase();
        if ($reasonPhrase == 'OK') {
            $body = json_decode($body, true);
            return $body;
        }
        return $body;
    }
    public function isJSON($string)
    {
        return is_string($string) && is_array(json_decode($string, true)) && (json_last_error() == JSON_ERROR_NONE) ? true : false;
    }
}
