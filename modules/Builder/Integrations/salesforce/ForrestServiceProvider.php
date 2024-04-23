<?php

namespace Modules\Builder\Integrations\salesforce;

use GuzzleHttp\Client;
use Illuminate\Support\ServiceProvider;
use Modules\Builder\Integrations\salesforce\Authentications\WebServer;
use Omniphx\Forrest\Authentications\UserPassword;
use Omniphx\Forrest\Providers\Laravel\LaravelCache;
use Omniphx\Forrest\Providers\Laravel\LaravelEvent;
use Omniphx\Forrest\Providers\Laravel\LaravelEncryptor;
use Omniphx\Forrest\Providers\Laravel\LaravelInput;
use Omniphx\Forrest\Providers\Laravel\LaravelRedirect;
use Omniphx\Forrest\Providers\Laravel\LaravelSession;

use Omniphx\Forrest\Formatters\JSONFormatter;
use Omniphx\Forrest\Formatters\URLEncodedFormatter;
use Omniphx\Forrest\Formatters\XMLFormatter;

use Omniphx\Forrest\Repositories\InstanceURLRepository;
use Omniphx\Forrest\Repositories\RefreshTokenRepository;
use Omniphx\Forrest\Repositories\ResourceRepository;
use Omniphx\Forrest\Repositories\StateRepository;
use Omniphx\Forrest\Repositories\TokenRepository;
use Omniphx\Forrest\Repositories\VersionRepository;

class ForrestServiceProvider extends \Omniphx\Forrest\Providers\Laravel\ForrestServiceProvider
{
    public function boot()
    {
        parent::boot();
    }
    protected function getStorage($storageType)
    {
        if ($storageType == 'db') {
            $storage = new DBStorage(app('config'), app('request')->session());
            return $storage;
        }
        return parent::getStorage($storageType);
    }
    protected function getClientFromDB($connection)
    {
    }
    protected function getSettings()
    {
        $settings = config('forrest');
        $integration = config('integrations.salesforce');
        $settings['credentials'] = array_merge($settings['credentials'], $integration);
        $calbackURI = route('integrationCallbackUrl', ['provider'=>'salesforce']);
        $settings['credentials']['callbackURI'] = route('integrationCallbackUrl', ['provider'=>'salesforce']);
        $settings['credentials']['callbackURI'] = preg_replace("/^http:/i", "https:", $calbackURI);
        $settings['credentials']['consumerKey'] = config('integrations.salesforce.consumer_key');
        $settings['credentials']['consumerSecret'] = config('integrations.salesforce.consumer_secret');
        if ($calbackURI != $settings['credentials']['callbackURI']) {
            $settings['credentials']['callbackURI'].= '/r';
        }
        return $settings;
    }
    public function register()
    {
        $this->app->singleton('forrest', function ($app) {

            // Config options
            $settings           = $this->getSettings();
            $storageType        = config('forrest.storage.type');
            $authenticationType = config('forrest.authentication');

            // Dependencies
            $httpClient    = $this->getClient();
            $input     = new LaravelInput(app('request'));
            $event     = new LaravelEvent(app('events'));
            $encryptor = new LaravelEncryptor(app('encrypter'));
            $redirect  = $this->getRedirect();
            $storage   = $this->getStorage($storageType);

            $refreshTokenRepo = new RefreshTokenRepository($encryptor, $storage);
            $tokenRepo        = new TokenRepository($encryptor, $storage);
            $resourceRepo     = new ResourceRepository($storage);
            $versionRepo      = new VersionRepository($storage);
            $instanceURLRepo  = new InstanceURLRepository($tokenRepo, $settings);
            $stateRepo        = new StateRepository($storage);

            $formatter = new JSONFormatter($tokenRepo, $settings);

            switch ($authenticationType) {
                case 'WebServer':
                    $forrest = new WebServer(
                        $httpClient,
                        $encryptor,
                        $event,
                        $input,
                        $redirect,
                        $instanceURLRepo,
                        $refreshTokenRepo,
                        $resourceRepo,
                        $stateRepo,
                        $tokenRepo,
                        $versionRepo,
                        $formatter,
                        $settings
                    );
                    break;
                case 'UserPassword':
                    $forrest = new UserPassword(
                        $httpClient,
                        $encryptor,
                        $event,
                        $input,
                        $redirect,
                        $instanceURLRepo,
                        $refreshTokenRepo,
                        $resourceRepo,
                        $stateRepo,
                        $tokenRepo,
                        $versionRepo,
                        $formatter,
                        $settings
                    );
                    break;
                default:
                    $forrest = new WebServer(
                        $httpClient,
                        $encryptor,
                        $event,
                        $input,
                        $redirect,
                        $instanceURLRepo,
                        $refreshTokenRepo,
                        $resourceRepo,
                        $stateRepo,
                        $tokenRepo,
                        $versionRepo,
                        $formatter,
                        $settings
                    );
                    break;
            }

            return $forrest;
        });
        
        $this->app->bind('forrestObj', function ($app) {

            // Config options
            $settings           = config('forrest');
            $storageType        = config('forrest.storage.type');
            $authenticationType = config('forrest.authentication');

            // Dependencies
            $httpClient    = $this->getClient();
            $input     = new LaravelInput(app('request'));
            $event     = new LaravelEvent(app('events'));
            $encryptor = new LaravelEncryptor(app('encrypter'));
            $redirect  = $this->getRedirect();
            $storage   = $this->getStorage($storageType);

            $refreshTokenRepo = new RefreshTokenRepository($encryptor, $storage);
            $tokenRepo        = new TokenRepository($encryptor, $storage);
            $resourceRepo     = new ResourceRepository($storage);
            $versionRepo      = new VersionRepository($storage);
            $instanceURLRepo  = new InstanceURLRepository($tokenRepo, $settings);
            $stateRepo        = new StateRepository($storage);

            $formatter = new JSONFormatter($tokenRepo, $settings);

            switch ($authenticationType) {
                case 'WebServer':
                    $forrest = new WebServer(
                        $httpClient,
                        $encryptor,
                        $event,
                        $input,
                        $redirect,
                        $instanceURLRepo,
                        $refreshTokenRepo,
                        $resourceRepo,
                        $stateRepo,
                        $tokenRepo,
                        $versionRepo,
                        $formatter,
                        $settings
                    );
                    break;
                case 'UserPassword':
                    $forrest = new UserPassword(
                        $httpClient,
                        $encryptor,
                        $event,
                        $input,
                        $redirect,
                        $instanceURLRepo,
                        $refreshTokenRepo,
                        $resourceRepo,
                        $stateRepo,
                        $tokenRepo,
                        $versionRepo,
                        $formatter,
                        $settings
                    );
                    break;
                default:
                    $forrest = new WebServer(
                        $httpClient,
                        $encryptor,
                        $event,
                        $input,
                        $redirect,
                        $instanceURLRepo,
                        $refreshTokenRepo,
                        $resourceRepo,
                        $stateRepo,
                        $tokenRepo,
                        $versionRepo,
                        $formatter,
                        $settings
                    );
                    break;
            }

            return $forrest;
        });
    }
}
