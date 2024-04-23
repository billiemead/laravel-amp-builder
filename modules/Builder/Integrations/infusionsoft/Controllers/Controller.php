<?php

namespace Modules\Builder\Integrations\infusionsoft\Controllers;

use App\Models\Connection;
use Illuminate\Http\Request;
use Modules\Builder\Integrations\IntegrationController;
use Modules\Builder\Integrations\infusionsoft\Handler;

class Controller extends IntegrationController
{
    protected $name = 'infusionsoft';
    protected function _getInfusionApi($connection = "")
    {
        return Handler::getApi($connection);
    }
    public function getHandleCallback($connection_id = "")
    {
        $infusionsoft = $this->_getInfusionApi();
        if (isset($_SESSION['token'])) {
            $infusionsoft->setToken(unserialize($_SESSION['token']));
        }
        if (isset($_GET['code']) and !$infusionsoft->getToken()) {
            if (request()->ajax()) {
                $accessToken = $infusionsoft->requestAccessToken($_GET['code']);
                $token = $_SESSION['token'] = serialize($accessToken);
                $userInfo = $infusionsoft->userinfo()->get();
                $id = $userInfo['global_user_id'];
                $existing_record = Connection::where('account_id', '=', $id)->where('name', $this->name)->where('user_id', auth()->user()->id)->first();
                if (empty($existing_record)) {
                    Connection::create(
                        [
                        'name' => $this->name,
                        'user_id' => auth()->user()->id,
                        'account_id'=>$id ,
                        'account_name'=> $userInfo['given_name'],
                        'details'=>$token,
                        'token'=>$accessToken->getAccessToken(),
                        'refresh_token'=>$accessToken->getRefreshToken(),
                        'created_at' => \Carbon\Carbon::now(),
                        'updated_at' => \Carbon\Carbon::now(),
                        ]
                    );
                } else {
                    $existing_record->fill(
                        [
                        'account_name'=> $userInfo['given_name'],
                        'details'=>$token,
                        'token'=>$accessToken->getAccessToken(),
                        'refresh_token'=>$accessToken->getRefreshToken(),
                        'updated_at' => \Carbon\Carbon::now(),
                        ]
                    )->save();
                }
                return response()->success(1);
            }
            
            return view('integration/callback');
        }
        if ($infusionsoft->getToken()) {
            // Save the serialized token to the current session for subsequent requests
            $_SESSION['token'] = serialize($infusionsoft->getToken());

        // MAKE INFUSIONSOFT REQUEST
        } else {
            $authUrl = $infusionsoft->getAuthorizationUrl();
            return redirect()->away($authUrl);
        }
    }
    protected function _getCampaigns($connection, $api)
    {
        $rs = [];
        $campaigns = $api->campaigns()->get();
        $campaigns = $campaigns->all();
        foreach ($campaigns as $campaign) {
            $obj = $campaign->jsonSerialize();
            $rs[] = array_merge(['connection_id'=>$connection->id], $obj);
        }
        return $rs;
    }
    protected function getTags($connection, $api)
    {
        $rs = [];
        try {
            $tags = $api->tags()->get();
            $tags = $tags->all();
            foreach ($tags as $tag) {
                $obj = $tag->jsonSerialize();
                $rs[] = ['connection_id'=>$connection->id, 'id'=>$obj['id'], 'name'=>$obj['name']];
            }
        } catch (\Exception $e) {
        }
        
        return $rs;
    }
    protected function getMappingFields($api = null)
    {
        $map_fields = [
            "email_address"=>[ "name"=>"Email", 'required'=>true, "type"=>"mapping_field" ],
            "phone_number"=>[ "name"=>"Phone number", 'required'=>false, "type"=>"mapping_field" ],
            "given_name"=>[ "name"=>"First name", 'required'=>false, "type"=>"mapping_field" ],
            "family_name"=>[ "name"=>"Last name", 'required'=>false, "type"=>"mapping_field" ],
            "middle_name"=>[ "name"=>"Middle name", 'required'=>false, "type"=>"mapping_field" ],
            
        ];
        if (!empty($api)) {
            try {
                $contact_model = $api->contacts()->model();
                $contact_model = $contact_model->jsonSerialize();
                if (!empty($contact_model['optional_properties'])) {
                    $optional_properties = $contact_model['optional_properties'];
                    foreach ($optional_properties as $optional_property) {
                        $map_fields[$optional_property] = [
                            'name'=>$optional_property,
                            'required'=>false,
                            "type"=>"mapping_field"
                        ];
                    }
                }
            } catch (\Exception $e) {
            }
        }
        
        
        unset($map_fields['origin']);
        unset($map_fields['relationships']);
        unset($map_fields['social_accounts']);
        return $map_fields;
    }
    
    public function getCampaigns(Request $request)
    {
        $connection_id = $request->input('connection_id');
        $list_id = $request->input('list_id');
        $connect = Connection::find($connection_id);
        $rs = [];
        if (!empty($connect)) {
            $api = $this->_getInfusionApi($connect);
            $campaign = $api->campaigns()->with('sequences')->find($list_id);
            $campaign = $campaign->jsonSerialize();
            return $campaign;
        }
        return $rs;
    }
    
    
    public function getList(Request $request)
    {
        $connection_id = $request->get('connection_id');
        
        $connection = Connection::find($connection_id);
        $rs = [
            'list'=>[],
            'tags'=>[],
            'mapping_fields'=>$this->getMappingFields()
        ];
        if (!empty($connection)) {
            $api = $this->_getInfusionApi($connection);
            try {
                $campaigns = $this->_getCampaigns($connection, $api);
                $rs['list'] = array_merge($rs['list'], $campaigns);
                $rs['tags']= $this->getTags($connection, $api);
                $rs['mapping_fields']= $this->getMappingFields($api);
            } catch (\Exception $e) {
                $rs['error'] = $e->getMessage();
                ;
            }
        }
        return $rs;
    }
}
