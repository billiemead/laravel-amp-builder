<?php
namespace App\Oauth2\getresponse;

use League\OAuth2\Client\Provider\AbstractProvider;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Provider\ResourceOwnerInterface;
use League\OAuth2\Client\Token\AccessToken;
use Psr\Http\Message\ResponseInterface;

/**
 * Class Getresponse
 * @package Getresponse\Oauth\Provider
 */
class Getresponse extends AbstractProvider
{
    const DEFAULT_DOMAIN = 'https://app.getresponse.com';
    const DEFAULT_API_ENDPOINT = 'https://api.getresponse.com';

    /**
     * @var string
     */
    protected $domain = self::DEFAULT_DOMAIN;

    /**
     * @var string
     */
    protected $apiEndpoint = self::DEFAULT_API_ENDPOINT;

    /**
     * Returns the base URL for authorizing a client.
     *
     * Eg. https://oauth.service.com/authorize
     *
     * @return string
     */
    public function getBaseAuthorizationUrl()
    {
        return rtrim($this->domain, '/') . '/oauth2_authorize.html';
    }

    /**
     * Returns the base URL for requesting an access token.
     *
     * Eg. https://oauth.service.com/token
     *
     * @param array $params
     * @return string
     */
    public function getBaseAccessTokenUrl(array $params)
    {
        return rtrim($this->apiEndpoint, '/') . '/v3/token';
    }

    /**
     * Builds request options used for requesting an access token.
     *
     * @param  array $params
     * @return array
     */
    protected function getAccessTokenOptions(array $params)
    {
        $defaultParams = parent::getAccessTokenOptions($params);

        $authorization = 'Basic ' . base64_encode($this->clientId . ':' . $this->clientSecret);
        $defaultParams['headers']['authorization'] = $authorization;
        if ($this->isGetResponse360()) {
            $defaultParams['headers']['x-domain'] = $this->getXDomain();
        }

        return $defaultParams;
    }

    /**
     * @return string
     */
    private function getXDomain()
    {
        return parse_url($this->domain, PHP_URL_HOST);
    }

    /**
     * Returns the URL for requesting the resource owner's details.
     *
     * @param AccessToken $token
     * @return string
     */
    public function getResourceOwnerDetailsUrl(AccessToken $token)
    {
        return rtrim($this->apiEndpoint, '/') . '/v3/accounts';
    }

    /**
     * Returns the authorization headers used by this provider.
     *
     * Typically this is "Bearer" or "MAC". For more information see:
     * http://tools.ietf.org/html/rfc6749#section-7.1
     *
     * No default is provided, providers must overload this method to activate
     * authorization headers.
     *
     * @param  mixed|null $token Either a string or an access token instance
     * @return array
     */
    protected function getAuthorizationHeaders($token = null)
    {
        if (!empty($token)) {
            $headers = [
                'Authorization' => 'Bearer ' . (string) $token
            ];
            if ($this->isGetResponse360()) {
                $headers['X-Domain'] = $this->getXDomain();
            }
            return $headers;
        }
        return parent::getAuthorizationHeaders($token);
    }

    /**
     * Returns the default scopes used by this provider.
     *
     * This should only be the scopes that are required to request the details
     * of the resource owner, rather than all the available scopes.
     *
     * @return array
     */
    protected function getDefaultScopes()
    {
        return [];
    }

    /**
     * Checks a provider response for errors.
     *
     * @throws IdentityProviderException
     * @param  ResponseInterface $response
     * @param  array|string $data Parsed response data
     * @return void
     */
    protected function checkResponse(ResponseInterface $response, $data)
    {
        if (isset($data['httpStatus'], $data['code'], $data['message'])) {
            throw new IdentityProviderException($data['message'], $response->getStatusCode(), $data);
        }
    }

    /**
     * Generates a resource owner object from a successful resource owner
     * details request.
     *
     * @param  array $response
     * @param  AccessToken $token
     * @return ResourceOwnerInterface
     */
    protected function createResourceOwner(array $response, AccessToken $token)
    {
        return new GetresponseResourceOwner($response);
    }

    /**
     * @return bool
     */
    private function isGetResponse360()
    {
        return $this->domain !== self::DEFAULT_DOMAIN;
    }
}
