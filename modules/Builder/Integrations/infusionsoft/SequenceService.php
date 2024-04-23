<?php

namespace Modules\Builder\Integrations\infusionsoft;

use App\Models\Connection;
use Validator;
use Illuminate\Http\Request;

class SequenceService extends \Infusionsoft\Api\Rest\RestModel
{
    public function __construct(\Infusionsoft\Infusionsoft $client, $campaignId, $sequenceId, $contactId)
    {
        $this->full_url = 'https://api.infusionsoft.com/crm/rest/v1/campaigns/'.$campaignId.'/sequences/'.$sequenceId.'/contacts/'.$contactId;
        parent::__construct($client);
    }
    public function addContact($campaignId, $sequenceId, $contactId)
    {
        $data = $this->client->restfulRequest('post', $this->getIndexUrl());
        echo $this->getIndexUrl();
        return $data;
    }
}
