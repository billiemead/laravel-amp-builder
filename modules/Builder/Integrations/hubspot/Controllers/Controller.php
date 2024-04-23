<?php

namespace Modules\Builder\Integrations\hubspot\Controllers;

use App\Models\Connection;
use Illuminate\Http\Request;
use Modules\Builder\Integrations\IntegrationController;
use Modules\Builder\Integrations\hubspot\Handler;
use SevenShores\Hubspot\Resources\Forms;

class Controller extends IntegrationController
{
    protected $name = 'hubspot';
    public function getForms(Request $request)
    {
        $connection_id = $request->input('connection_id');
        $connect = Connection::where('id', $connection_id)->first();
        $rs = [];
        if (!is_null($connect)) {
            $client = $this->_getHttpClient($connect);

            $hubspot = new Forms($client);
            $response = $hubspot->all();
            $forms = $response->getData();
            $mapping_fields = [];
            foreach ($forms as $form) {
                $portalId = $form->portalId;
                $guid = $form->guid;
                $name = $form->name;
                $formFieldGroups = $form->formFieldGroups;
                foreach ($formFieldGroups as $formFieldGroup) {
                    $field = $formFieldGroup->fields[0];
                    $mapping_fields[$field->name] = [
                        'name'=>$field->label,
                        'required'=>$field->required,
                        'type'=>$field->fieldType
                    ];
                }
                $rs[$portalId.':'.$guid] = [
                    'id'=>$portalId.':'.$guid,
                    'name'=>$name,
                    'mapping_fields'=>$mapping_fields
                    
                ];
            }
            return $rs;
        }
        
        return $rs;
    }
  
    protected function getRedirectUrl()
    {
        $calbackURI = $url = route('integrationCallbackUrl', ['provider'=>$this->name]);
        $url = preg_replace("/^http:/i", "https:", $url);
        if ($calbackURI != $url) {
            $url.= '/r';
        }
        return $url;
    }
    public function getHandleCallback()
    {
        $config = config('integrations.hubspot');
        $client = new \SevenShores\Hubspot\Http\Client([
            'key'=>$config['secret']
        ]);
        $hubspot = new \SevenShores\Hubspot\Resources\OAuth2($client);
        if (empty($_GET['code'])) {
            $redirectUrl = $this->getRedirectUrl();
            $url = $hubspot->getAuthUrl($config['client_id'], $redirectUrl, ['contacts', 'oauth', 'forms']);
            return redirect()->away($url);
        } else {
            if (request()->ajax()) {
                $redirectUrl = $this->getRedirectUrl();
                $code = $_GET['code'];
                $response = $hubspot->getTokensByCode($config['client_id'], $config['secret'], $redirectUrl, $code);
                $status_code = $response->getStatusCode();
                if ($status_code != 200) {
                    $reason = $response->getReasonPhrase();
                    throw new \Exception($reason);
                }
                $access_token = $response['access_token'];
                $refresh_token = $response['refresh_token'];
                $info = $hubspot->getAccessTokenInfo($access_token);
                $expired_in = \Carbon\Carbon::now();
                $expired_in = $expired_in->addSeconds($response['expires_in']);
                if ($info->getStatusCode() != 200) {
                    throw new \Exception($info->getReasonPhrase());
                }
                $account_id = $info['user_id'];
                $account_name = $info['user'];

                $record = Connection::where('account_id', $account_id)->where('name', $this->name)->where('user_id', auth()->user()->id)->first();

                if ($record == null) {
                    Connection::create(
                        [
                        'name' => $this->name,
                        'user_id' => auth()->user()->id,
                        'account_id'=>$account_id ,
                        'account_name'=> $account_name,
                        'details'=>serialize($response->toArray()),
                        'token'=>$access_token,
                        'refresh_token'=>$refresh_token,
                        'expired_in'=>$expired_in,
                        'created_at' => \Carbon\Carbon::now(),
                        'updated_at' => \Carbon\Carbon::now(),
                        ]
                    );
                } else {
                    $record->fill(
                        [
                        'account_id'=>$account_id ,
                        'account_name'=> $account_name,
                        'details'=>serialize($response->toArray()),
                        'token'=>$access_token,
                        'refresh_token'=>$refresh_token,
                        'expired_in'=>$expired_in,
                        'updated_at' => \Carbon\Carbon::now(),
                        ]
                    )->save();
                }
                return response()->success(1);
            }
            return view('integration/callback');
        }
        return 1;
    }
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
            $rs[] = ['id'=>$field->customFieldId, 'name'=>$field->name];
        }
        return  $rs;
    }
   
    protected function _getHttpClient($connection)
    {
        return Handler::getHttpClient($connection);
    }
    protected function _getList($connection)
    {
    }
}
