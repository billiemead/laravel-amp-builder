<?php

namespace Modules\Builder\Integrations\mailchimp;

use App\Models\Connection;
use Hash;
use \DrewM\MailChimp\MailChimp;

class Handler
{
    public static function getApi($connection)
    {
        $details = unserialize($connection->details);
        $api = new MailChimp($connection->token.'-'.$details->getDc());
        return $api;
    }
    public function subscribe($post_data, $integration)
    {
        $list = array_get($integration, 'list');
        $ids = explode('-', $list);
        $accounnt = $ids[0];
        $list = $ids[1];
        $connect = Connection::find($accounnt);
        if (!empty($connect)) {
            $api = self::getApi($connect);
        
            $result = $api->post("lists/$list/members", array_merge($post_data, [
                'status'        => 'subscribed',
            ]));
            // Already subscribed
            if ($result['status'] == 400) {
                $subscriber_hash = $api->subscriberHash($post_data['email_address']);

                $result = $api->patch("lists/$list/members/$subscriber_hash", $post_data);
            }
            return $result;
        }
        return 1;
    }
}
