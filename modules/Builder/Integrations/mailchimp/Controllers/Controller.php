<?php

namespace Modules\Builder\Integrations\mailchimp\Controllers;

use App\Models\Connection;
use Modules\Builder\Integrations\IntegrationController;
use Illuminate\Http\Request;
use Validator;
use Hash;
use Modules\Builder\Integrations\mailchimp\Handler;

class Controller extends IntegrationController
{
    protected $name = 'mailchimp';
    // Get mailchimp mapping fields
    protected function getMappingFields($list_id, $mailchimp)
    {
        $map_fields = [
            "email_address"=>[ "name"=>"Email", 'required'=>true, "type"=>"mapping_field" ],
            "ip_signup"=>[ "name"=>"Language", 'required'=>false, "type"=>"default_value", "value"=> request()->ip() ],
            "timestamp_signup"=>[ "name"=>"Language", 'required'=>false, "type"=>"default_value", "value"=> \Carbon\Carbon::now()],
            "merge_fields"=>[
            
            ]
        ];
        $response = $mailchimp->get("lists/$list_id/merge-fields");
        if (!empty($response['merge_fields'])) {
            $merge_fields = $response['merge_fields'];
            foreach ($merge_fields as $merge_field) {
                $map_fields['merge_fields'][$merge_field['tag']] = [
                    "name"=> $merge_field['name'],
                    "required"=> $merge_field['required'],
                    "type"=> $merge_field['type']
                ];
            }
        }
        return $map_fields;
    }
    protected function getProvider()
    {
        $config = config('integrations.mailchimp');

        $provider = new \ExpandOnline\OAuth2\Client\Provider\Mailchimp([
            'clientId'          => array_get($config, 'client_id'),
            'clientSecret'      => array_get($config, 'secret'),
            'redirectUri'       => route('integrationCallbackUrl', ['provider'=>$this->name])
        ]);
        return $provider;
    }

    public function getHandleCallback()
    {
        $provider = $this->getProvider();
        $request = request();
        if (!isset($_GET['code'])) {
            // If we don't have an authorization code then get one
            $authUrl = $provider->getAuthorizationUrl();
            session(['oauth2state' => $provider->getState()]);
            return redirect()->away($authUrl);

        // Check given state against previously stored one to mitigate CSRF attack
        } elseif (empty($_GET['state']) || ($_GET['state'] !== session('oauth2state'))) {
            $request->session()->forget('oauth2state');

            exit('Invalid state');
        } else {
            // Try to get an access token (using the authorization code grant)
            if (request()->ajax()) {
                $token = $provider->getAccessToken('authorization_code', [
                    'code' => $_GET['code']
                ]);

                // Optional: Now you have a token you can look up a users profile data
                try {
                    // We got an access token, let's now get the user's details
                    
                    $user = $provider->getResourceOwner($token);
                    $id = $user->getId();
                    $record = Connection::where('account_id', $id)->where('name', $this->name)->where('user_id', auth()->user()->id)->first();

                    if (empty($record)) {
                        Connection::create([
                            'name' => $this->name,
                            'user_id' => auth()->user()->id,
                            'account_id'=>$id ,
                            'account_name'=> $user->getName(),
                            'details'=>serialize($user),
                            'token'=>$token->getToken(),
                            'created_at' => \Carbon\Carbon::now(),
                            'updated_at' => \Carbon\Carbon::now(),
                        ]);
                    } else {
                        $record->fill(
                            [
                            'account_name'=> $user->getName(),
                            'details'=>serialize($user),
                            'token'=>$token->getToken(),
                            'updated_at' => \Carbon\Carbon::now(),
                            ]
                        )->save;
                    }
                    return response()->success(1);
                    //return view('integration/callback');
                } catch (Exception $e) {
                    // Failed to get user details
                    exit('Oh dear...');
                }
            }
        }
    }
    
    // Get Mailchimp email list
    protected function _getList($connection, $mailchimp)
    {
        $rs = [];
        $list = [];
        $mailchimp_list = $mailchimp->get('lists');
        if (!empty($mailchimp_list['lists'])) {
            foreach ($mailchimp_list['lists'] as $mailchimp_list_item) {
                $id = $mailchimp_list_item['id'];
                $list[$id] = [
                    "id"=>$id,
                    "name"=>$mailchimp_list_item['name'],
                ];
            }
        }
        $rs = [
            'id'=>$connection->id,
            'name'=>$connection->account_name,
            'lists'=> $list
        ];
        return $rs;
    }
    protected function getApi($connection)
    {
        return Handler::getApi($connection);
    }
    
    // Get Mailchimp List and Send to Client
    public function getList(Request $request)
    {
        $connections = Connection::where('name', $this->name)->where('user_id', auth()->user()->id)->get();
        $rs = [];
        if (!empty($connections)) {
            foreach ($connections as $connection) {
                $api = $this->getApi($connection);
                $rs[$connection->id] = $this->_getList($connection, $api);
            }
        }
        return response()->success($rs);
    }
    
    // Get mapping fields of a mailchimp email list
    public function getListField(Request $request)
    {
        $connection_id = $request->input('connection_id');
        $list_id = $request->input('list_id');
        $connection = Connection::find($connection_id);
        $mapping_fields = [];
        if (!empty($connection)) {
            $api = $this->getApi($connection);
            $mapping_fields = $this->getMappingFields($list_id, $api);
        }
        return response()->success($mapping_fields);
    }
}
