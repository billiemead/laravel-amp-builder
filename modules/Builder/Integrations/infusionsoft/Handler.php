<?php

namespace Modules\Builder\Integrations\infusionsoft;

use App\Models\Connection;
use Validator;

class Handler
{
    protected function addToSequence($api, $campaignId, $sequenceId, $contactId)
    {
        $model = new SequenceService($api, $campaignId, $sequenceId, $contactId);
        $response = $model->addContact($campaignId, $sequenceId, $contactId);
    }
    public static function getApi($connection = "")
    {
        $api = new \Infusionsoft\Infusionsoft(array(
            'clientId'     => config('integrations.infusionsoft.client_id'),
            'clientSecret' => config('integrations.infusionsoft.client_secret'),
            'redirectUri'  => route('integrationCallbackUrl', ['provider'=>'infusionsoft'])
        ));
        if (!empty($connection)) {
            $token = unserialize($connection->details);
            $api->setToken($token);
            if ($token->isExpired()) {
                self::refreshAccessToken($connection, $api);
            }
        }
        return $api;
    }
    protected static function refreshAccessToken($connection, $api)
    {
        $token = $api->refreshAccessToken();
        $connection->details = serialize($token);
        $connection->token = $token->getAccessToken();
        $connection->refresh_token = $token->getRefreshToken();
        $connection->updated_at = \Carbon\Carbon::now();
        $connection->save();
    }
    
    public function subscribe($post_data, $integration)
    {
        $connection_id = array_get($integration, 'account');
        $connect = Connection::find($connection_id);
        if (!empty($connect)) {
            $api = self::getApi($connect);
            if (isset($post_data['email_address'])) {
                $post_data['email_addresses'] = [
                    [
                        'email'=>array_get($post_data, 'email_address'),
                        "field"=> "EMAIL1"
                    ]
                ];
                unset($post_data['email_address']);
            }
            if (isset($post_data['phone_number'])) {
                $post_data['phone_numbers'] = [
                    [
                        'number'=>array_get($post_data, 'phone_number'),
                        'type'=>'WORK',
                        'extension'=>'',
                        "field"=> "PHONE1"
                    ]
                ];
                unset($post_data['phone_number']);
            }
            if (isset($post_data['fax_numbers'])) {
                $post_data['fax_numbers'] = [
                    [
                        'number'=>array_get($post_data, 'fax_numbers'),
                        'type'=>'WORK',
                        "field"=> "FAX1"
                    ]
                ];
                unset($post_data['phone_number']);
            }
            $post_data['duplicate_option'] = 'Email';
            $post_data['origin'] = [
                'ip_address'=> request()->ip(),
            ];
            $contact = $api->contacts()->create($post_data, true);
            $result = $contact->jsonSerialize();
            $list = array_get($integration, 'list');
            $list_sequence = array_get($integration, 'sequence');
            if (!empty($list_sequence)) {
                $this->addToSequence($api, $list, $list_sequence, $result['id']);
            }
            $tags = array_get($integration, 'tags');
            if (is_array($tags) && !empty($tags)) {
                $tagIds = array_keys($tags);
                $contact->addTags($tagIds);
            }
        }
        return 1;
    }
}
