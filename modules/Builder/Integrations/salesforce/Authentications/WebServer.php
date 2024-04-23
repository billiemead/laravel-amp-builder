<?php

namespace Modules\Builder\Integrations\salesforce\Authentications;

use Omniphx\Forrest\Exceptions\MissingKeyException;
use Omniphx\Forrest\Interfaces\RepositoryInterface;
use Omniphx\Forrest\Interfaces\ResourceRepositoryInterface;
use App\Models\Connection;
use DB;

class WebServer extends \Omniphx\Forrest\Authentications\WebServer
{
    public function authenticate($url = null, $stateOptions = [])
    {
        return parent::authenticate($url, $stateOptions);
    }

    protected function collectReposities()
    {
        $rs = [];
        $properties = get_object_vars($this);
        foreach ($properties as $property => $value) {
            if (!empty($this->$property) && $this->$property instanceof RepositoryInterface) {
                $rs[$property] = $this->$property->get();
            }
            if (!empty($this->$property) && $this->$property instanceof ResourceRepositoryInterface) {
                //$rs[$property] = $this->$property->get();
            }
        }
        return $rs;
    }
    public function restoreRepositiesFromDB($connection)
    {
        $details = unserialize($connection->details);
        foreach ($details as $property => $value) {
            if (!empty($this->$property) && $this->$property instanceof RepositoryInterface) {
                $rs[$property] = $this->$property->put($value);
            }
        }
        $this->storeResources();
    }
    public function callback()
    {
        $stateOptions = parent::callback();
        $user = $this->identity();
        $account_id = $user['user_id'];
        $account_name = $user['display_name'];
        $response = $this->tokenRepo->get();
        $details = $this->collectReposities();
        $existing_record = Connection::where('account_id', $account_id)->where('name', 'salesforce')->where('user_id', auth()->user()->id)->first();
        if ($existing_record === null) {
            Connection::create(
                [
                'name' => 'salesforce',
                'user_id' => auth()->user()->id,
                'account_id'=>$account_id ,
                'account_name'=> $account_name,
                'refresh_token'=> $response['refresh_token'],
                'details'=>serialize($details),
                'token'=>$response['access_token'],
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now(),
                ]
            );
        } else {
            $existing_record->fill([
                'account_name'=> $account_name,
                'refresh_token'=> $response['refresh_token'],
                'details'=>serialize($details),
                'token'=>$response['access_token'],
                'updated_at' => \Carbon\Carbon::now(),
            ])->save();
        }
        return response()->success($stateOptions);
    }
    protected function handleAuthenticationErrors(array $response)
    {
        if (!isset($response['error'])) {
            return;
        }

        throw new InvalidLoginCreditialsException($response['error_description']. $this->input('code'));
        if (!isset($response['refresh_token'])) {
            throw new InvalidLoginCreditialsException("");
        }
        //$token = $this->tokenRepo->get();

        return;
    }

    /**
     * @return mixed|void
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function refresh()
    {
        $refreshToken = $this->refreshTokenRepo->get();
        $tokenURL = $this->getLoginURL();
        $tokenURL .= '/services/oauth2/token';
        $response = $this->httpClient->request('post', $tokenURL, [
            'form_params'    => [
                'refresh_token' => $refreshToken,
                'grant_type'    => 'refresh_token',
                'client_id'     => config('integrations.salesforce.consumer_key'),
                'client_secret' => config('integrations.salesforce.consumer_secret'),
            ],
        ]);

        // Response returns an json of access_token, instance_url, id, issued_at, and signature.
        $token = json_decode($response->getBody(), true);
        // Encrypt token and store token and in storage.
        $this->tokenRepo->put($token);
    }

    /**
     * Revokes access token from Salesforce. Will not flush token from storage.
     *
     * @return mixed
     */
    public function revoke()
    {
        $accessToken = $this->tokenRepo->get()['access_token'];
        $url = $this->getLoginURL();
        $url .= '/services/oauth2/revoke';

        $options['headers']['content-type'] = 'application/x-www-form-urlencoded';
        $options['form_params']['token'] = $accessToken;

        return $this->httpClient->post($url, $options);
    }

    /**
     * Retrieve login URL.
     *
     * @return string
     */
    private function getLoginURL()
    {
        try {
            return $this->instanceURLRepo->get();
        } catch (MissingKeyException $e) {
            return $loginURL = $this->credentials['loginURL'];
        }
    }
}
