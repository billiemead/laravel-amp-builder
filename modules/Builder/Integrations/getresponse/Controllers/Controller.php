<?php

namespace Modules\Builder\Integrations\getresponse\Controllers;

use App\Models\Connection;
use Illuminate\Http\Request;
use Modules\Builder\Integrations\IntegrationController;
use Modules\Builder\Integrations\getresponse\Handler;
use Getresponse\Sdk\GetresponseClientFactory;

class Controller extends IntegrationController
{
    protected $name = 'getresponse';
    
    /**
     * @param $getresponse
     * @return array
     */
    protected function getMappingFields($getresponse)
    {
        $map_fields = [
            "name"=>[ "name"=>"Name", 'required'=>false, "type"=>"mapping_field" ],
            "email"=>[ "name"=>"Email", 'required'=>true, "type"=>"mapping_field" ],
            "dayOfCycle"=>[ "name"=>"Day of cycle", 'required'=>false, "type"=>"mapping_field" ],
            "scoring"=>[ "name"=>"Scoring", 'required'=>false, "type"=>"mapping_field" ],
            "ipAddress"=>[ "name"=>"IP", 'required'=>false, "type"=>"default_value", "value"=> request()->ip() ],
            "custom_fields"=>[
            
            ]
        ];
        $custom_fields = $this->_getCustomFields($getresponse);
        if (!empty($custom_fields)) {
            $map_fields['custom_fields'] = $custom_fields;
        }
        return $map_fields;
    }
    protected function _getCustomFields($getresponse)
    {
        $rs = [];
        $response = $getresponse->getCustomFields();
        
        foreach ($response as $field) {
            $rs[$field['customFieldId']] = ['id'=>$field['customFieldId'], 'name'=>$field['name']];
        }
        return  $rs;
    }
    protected function _getList($connection, $getresponse)
    {
        $rs = [];
        $response = $getresponse->getCampaigns();
        if (!empty($response->httpStatus) && $response->httpStatus == 401) {
            return [];
        }
        foreach ($response as $campaign) {
            $rs[] = ['connection_id'=>$connection->id, 'id'=>$campaign['campaignId'], 'name'=>$campaign['name'] ];
        }
        return  $rs;
    }
    protected function getApi($connection)
    {
        return Handler::getApi($connection);
    }
    public function getCampaigns(Request $request)
    {
        $connects = Connection::where('name', $this->name)->where('user_id', auth()->user()->id)->get();
        $rs = ['list'=> [] ];
        if (!empty($connects)) {
            foreach ($connects as $connect) {
                $rs['list'][$connect->id] = ['name'=>$connect->account_name, 'id'=>$connect->id, 'list'=>[]];
                $api = $this->getApi($connect);
                $list = $this->_getList($connect, $api);
                if (!empty($list)) {
                    $rs['list'][$connect->id]['list'] = array_merge($rs['list'][$connect->id]['list'], $list);
                }
                $rs['mapping_fields'] = $this->getMappingFields($api);
                return $rs;
            }
        }
        
        return $rs;
    }
    
    public function postAuthorize(Request $request)
    {
        $key = $request->input('key');
        $api = Handler::getApi($key);
        $data = $api->validate();
        $account_id = $data['accountId'];
        $account_name = $data['firstName']. ' '. $data['lastName'];

        $record = Connection::where('account_id', $account_id)->where('name', $this->name)->where('user_id', auth()->user()->id)->first();
        if (is_null($record)) {
            Connection::create(
                [
                'name' => $this->name,
                'user_id' => auth()->user()->id,
                'account_id'=>$account_id ,
                'account_name'=> $account_name,
                'details'=>serialize($data),
                'token'=>$key,
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now(),
                ]
            );
        } else {
            $record->update(
                [
                'account_id'=>$account_id ,
                'account_name'=> $account_name,
                'details'=>serialize($data),
                'token'=>$key,
                'updated_at' => \Carbon\Carbon::now(),
                ]
            );
        }
        
        
        return 1;
    }
}
