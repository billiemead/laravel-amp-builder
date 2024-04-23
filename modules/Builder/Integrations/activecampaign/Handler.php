<?php

namespace Modules\Builder\Integrations\activecampaign;

use ActiveCampaign;
use App\Models\Connection;

class Handler
{
    protected function checkContactExists($email, $ac)
    {
        $result = $ac->api("contact/view?email=".$email);
        $success = (int)$result->success;
        if (!$success) {
            return false;
        }
        return (empty($result->id) ? false : $result->id);
    }
    public function subscribe($post_data, $integration)
    {
        $list = array_get($integration, 'list');
        $ids = explode('-', $list);
        $connection_id = $ids[0];
        $list = $ids[1];
        $connect = Connection::find($connection_id);
        if (!empty($connect)) {
            $details = unserialize($connect->details);
            $api_key = array_get($details, 'api_key');
            $api_url = array_get($details, 'api_url');
            $ac = new ActiveCampaign($api_url, $api_key);
            
            $post_data['p['.$list.']'] = $list;
            
            $contact_exist = $this->checkContactExists($post_data['email'], $ac);
            if ($contact_exist === false) {
                $result = $ac->api("contact/add", $post_data);
            } else {
                $post_data['id'] = $contact_exist;
                $result = $ac->api("contact/edit", $post_data);
            }
            $success = (int)$result->success;
            if (!$success) {
                //return "Get list error: ".$result->error;
            }
            return $result;
        }
        return 1;
    }
}
