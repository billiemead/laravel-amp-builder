<?php

namespace Modules\Builder\Integrations\zohocrm\Controllers;

use App\Models\Connection;
use Modules\Builder\Integrations\IntegrationController;

use Illuminate\Http\Request;
use Validator;

class Controller extends IntegrationController
{
    protected function getMappingFields($list_id, $fields)
    {
        $map_fields = [
            "Email"=>[ "name"=>"Email", 'required'=>true, "type"=>"mapping_field" ],
            "Company"=>[ "name"=>"Company", 'required'=>true, "type"=>"mapping_field" ],
            "First_Name"=>[ "name"=>"First Name", 'required'=>true, "type"=>"mapping_field" ],
            "Last_Name"=>[ "name"=>"Last Name", 'required'=>true, "type"=>"mapping_field" ],
            "merge_fields"=>[
            ]
        ];
        foreach ($fields as $field) {
            $name = $field->getApiName();
            $fieldLabel = $field->getFieldLabel();
            if (!empty($map_fields[$name])) {
                continue;
            }
            $map_fields[$name] = [
                'name'=>$fieldLabel,
                'required'=>false,
                "type"=>"mapping_field"
            ];
        }
        return $map_fields;
    }
    protected function getRedirectUrl()
    {
        $url = route('integrationCallbackUrl', ['provider'=>'zohocrm']);
        return $url;
    }
    
    public function getHandleCallback()
    {
        $config = config('integrations.zohocrm');
        $config['redirect_uri'] = $this->getRedirectUrl();
        \ZohoOAuth::initializeWithOutInputStream($config);
        \ZCRMRestClient::initialize();
        if (!empty($_GET['code'])) {
            if (request()->ajax()) {
                $grantToken = $_GET['code'];
                if (!empty($_GET['location'])) {
                    $location = $_GET['location'];
                }
                if (!empty($_GET['accounts-server'])) {
                    $accounts_server = $_GET['accounts-server'];
                }
                $oAuthClient = \ZohoOAuth::getClientInstance();
                $oAuthTokens = $oAuthClient->generateAccessToken($grantToken);
                return response()->success(1);
            }
        } else {
            $oAuthClient = \ZohoOAuth::getClientInstance();
            $url = $oAuthClient->getAccessTokenUrl();
            return redirect()->away($url);
        }
    }

    public function getList(Request $request)
    {
        $config = config('integrations.zohocrm');
        $connection_id = $request->input('connection_id');
        $connect = Connection::find($connection_id);
        $rs = ['list'=>[]];
        \ZohoOAuth::initializeWithOutInputStream($config);
        \ZCRMRestClient::initialize();
        if (!empty($connect)) {
            \ZCRMConfigUtil::setConfigValue("currentUserEmail", $connect->account_id);
            $zcrmModuleIns = \ZCRMModule::getInstance("Campaigns");
            $bulkAPIResponse=$zcrmModuleIns->getRecords();
            $recordsArray = $bulkAPIResponse->getData();
            foreach ($recordsArray as $record) {
                $id = $record->getEntityId();
                $data = $record->getData();
                $name = $data['Campaign_Name'];
                $rs['list'][] = ['id'=>$id, 'name'=>$name];
            }
            $zcrmModuleIns = \ZCRMModule::getInstance("Leads");
            $bulkAPIResponse=$zcrmModuleIns->getAllFields();
            $recordsArray = $bulkAPIResponse->getData();
            $mapping_fields = $this->getMappingFields($connect->id, $recordsArray);
            $rs['mapping_fields'] = $mapping_fields;
        }
        return $rs;
    }
    public function getZohoListField(Request $request)
    {
        $connection_id = $request->input('connection_id');
        $list_id = $request->input('list_id');
        $connect = Connection::find($connection_id);
        $mapping_fields = [];
        if (!empty($connect)) {
            \ZCRMConfigUtil::setConfigValue("currentUserEmail", $connect->account_id);
            $zcrmModuleIns = \ZCRMModule::getInstance("Campaigns");
            $bulkAPIResponse=$zcrmModuleIns->getAllFields();
            $recordsArray = $bulkAPIResponse->getData();
            $mapping_fields = $this->getMappingFields($list_id, $recordsArray);
        }
        return $mapping_fields;
    }
}
