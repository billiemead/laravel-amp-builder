<?php

namespace Modules\Builder\Integrations\salesforce;

use App\Models\Connection;
use DB;
use Validator;
use Hash;
use Forrest;

class Handler
{
    public function subscribe($post_data, $integration)
    {
        $list = array_get($integration, 'list');
        $account = array_get($integration, 'account');
        $connect = Connection::where('id', $account)->first();
        if (isset($connect)) {
            $forest = app()['forrestObj'];
            $forest->restoreRepositiesFromDB($connect);
            unset($post_data['email_address']);
            $response = $forest->query('select id,name from Lead where email=\''.$post_data['Email'].'\'');
            
            $totalSize = $response['totalSize'];
            if ($totalSize > 0) {
                $id = $response['records'][0]['Id'];
                $response = Forrest::sobjects('Lead/'.$id, [
                'method' => 'patch',
                'body'   => $post_data]);
            } else {
                $response = Forrest::sobjects('Lead', [
                'method' => 'post',
                'body'   => $post_data]);
            }
            
            if (!empty($response) && $response['success'] == 1) {
                $id = $response['id'];
                $response = Forrest::sobjects('CampaignMember', [
                'method' => 'post',
                'body'   => [
                    'CampaignId'=>$list,
                    'LeadId'=>$id
                ]
                ]);
                return $response;
            }
        }
        return 1;
    }
}
