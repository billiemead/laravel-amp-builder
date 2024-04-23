<?php

namespace Modules\Builder\Integrations\campaignmonitor\Controllers;

use App\Models\Connection;
use DB;
use Illuminate\Http\Request;
use Validator;
use Modules\Builder\Integrations\campaignmonitor\Handler;

;
use Modules\Builder\Integrations\IntegrationController;

class Controller extends IntegrationController
{
    protected $name = 'campaignmonitor';
    
    public function getCampaigns(Request $request)
    {
        $connects = Connection::where('name', $this->name)->where('user_id', auth()->user()->id)->get();
        $rs = [];
        if (sizeof($connects)) {
            foreach ($connects as $connect) {
                $wrap = $this->getRestClient($connect);
                $result = $wrap->get_lists();
                if ($result->http_status_code != 200) {
                    $rs['error'] = print_r($result->response, true);
                    continue;
                }
                $rs[$connect->id] = ['id'=>$connect->id, 'name'=>$connect->account_name, 'list'=>[]];
                $response = $result->response;
                foreach ($response as $campaign) {
                    $rs[$connect->id]['list'][] = ['id'=>$campaign->ListID, 'name'=>$campaign->Name];
                }
            }
        }
        return $rs;
    }
    public function getFields(Request $request)
    {
        $connection_id = $request->input('connection_id');
        $list_id = $request->input('list_id');
        $connect = Connection::where('id', $connection_id)->first();
        $mapping_fields = [];
        if (isset($connect)) {
            $wrap = $this->getRestClient($connect, \CS_REST_Lists::class, $list_id);
            $mapping_fields = $this->getMappingFields($wrap);
        }
        return $mapping_fields;
    }

    
    public function postAuthorize(Request $request)
    {
        $key = $request->input('key');
        $client_id = $request->input('client_id');
        $auth = array('api_key' => $key);
        $wrap = new \CS_REST_Clients($client_id, $auth, $this->getProtocol());
        $result = $wrap->get();
        if ($result->http_status_code != 200) {
            throw new \Exception($result->response->Message);
        }
        $response = $result->response;
        $account_name = $response->BasicDetails->CompanyName;
        $account_id = $response->BasicDetails->ClientID;
        $record = Connection::where('account_id', $account_id)->where('name', $this->name)->where('user_id', auth()->user()->id)->first();
        if ($record === null) {
            $record = Connection::create([
                'name' => $this->name,
                'user_id' => auth()->user()->id,
                'account_id'=>$account_id ,
                'account_name'=> $account_name,
                'details'=>serialize($response),
                'token'=>$key,
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now(),
             ]);
        } else {
            $record->fill([
                'account_name' => $account_name,
                'updated_at' => \Carbon\Carbon::now(),
                'details' => serialize($response)
            ])->save();
        }
        
        return 1;
    }
    protected function getProtocol()
    {
        return (request()->secure() ? 'https': 'http');
    }
    protected function getMappingFields($cs)
    {
        $map_fields = [
            "EmailAddress"=>[ "name"=>"Email", 'required'=>true, "type"=>"mapping_field" ],
            "Name"=>[ "name"=>"Name", 'required'=>false, "type"=>"mapping_field" ],
            "custom_fields"=>[
            ]
        ];
        $rs = $cs->get_custom_fields();
        if ($rs->http_status_code == 200) {
            $custom_fields = [];
            $response = $rs->response;
            foreach ($response as $field) {
                $custom_fields[] = ['id'=>$field->Key, 'name'=>$field->FieldName];
            }
            $map_fields['custom_fields'] = $custom_fields;
        }
        return $map_fields;
    }
    protected function getRestClient($connection, $class = \CS_REST_Clients::class, $list = null)
    {
        return Handler::getRestClient($connection, $class, $list);
    }
}
