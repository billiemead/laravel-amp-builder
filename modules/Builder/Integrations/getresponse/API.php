<?php

namespace Modules\Builder\Integrations\getresponse;

use App\Models\Connection;
use Getresponse\Sdk\GetresponseClientFactory;
use Getresponse\Sdk\Operation\Accounts\GetAccounts\GetAccounts as ValidateOperation;
use Getresponse\Sdk\Operation\Contacts\CreateContact\CreateContact;
use Getresponse\Sdk\Operation\Campaigns\GetCampaigns\GetCampaigns as GetCampaignsOperation;
use Getresponse\Sdk\Operation\CustomFields\GetCustomFields\GetCustomFields as GetCustomFieldsOperation;
use Getresponse\Sdk\Operation\Model\CampaignReference;
use Getresponse\Sdk\Operation\Model\NewContact;
use Getresponse\Sdk\Operation\Model\NewContactCustomFieldValue;

class API
{
    protected $getresponseApi;
    public function __construct($api)
    {
        $this->getresponseApi = $api;
    }
    public static function createFromConnection($connection)
    {
        $api = self::createFromToken($connection->token);
        return $api;
    }
    public static function createFromToken($token)
    {
        $api = GetresponseClientFactory::createWithApiKey($token);
        return new self($api);
    }
    public function getCampaigns()
    {
        $response = $this->getresponseApi->call(new GetCampaignsOperation);
        if (!$response->isSuccess()) {
            throw new \Exception($response->getErrorMessage());
        }
        $data = $response->getData();
        return $data;
    }
    public function getCustomFields()
    {
        $response = $this->getresponseApi->call(new GetCustomFieldsOperation);
        if (!$response->isSuccess()) {
            throw new \Exception($response->getErrorMessage());
        }
        $data = $response->getData();
        return $data;
    }
    public function addContact($post_data)
    {
        $campaignId = array_get($post_data, 'campaignId');
        $email = array_get($post_data, 'email');
        $createContact = new NewContact(
            new CampaignReference($campaignId),
            $email
        );
        $custom_fields = array_get($post_data, 'custom_fields');
        if (is_array($custom_fields) && !empty($custom_fields)) {
            $arr = [];
            foreach ($custom_fields as $key=>$value) {
                $model = new NewContactCustomFieldValue($key, [$value]);
                $arr[] = $model;
            }
            $createContact->setCustomFieldValues($arr);
        }
        foreach ($post_data as $key=>$value) {
            $method = 'set'.ucfirst($key);
            if (method_exists($createContact, $method)) {
                $createContact->$method($value);
            }
        }
        $createContactOperation = new CreateContact($createContact);
        if (config('app.debug')) {
            $debugger = GetresponseClientFactory::createDebugger($this->getresponseApi);
        }

        $response = $this->getresponseApi->call($createContactOperation);
        if (!$response->isSuccess()) {
            if (config('app.debug')) {
                $debugger->dump();
            }
            throw new \Exception($response->getErrorMessage());
        }
        $data = $response->getData();
        return $data;
    }
    public function validate()
    {
        $response = $this->getresponseApi->call(new ValidateOperation);
        if (!$response->isSuccess()) {
            throw new \Exception($response->getErrorMessage());
        }
        $data = $response->getData();
        return $data;
    }
}
