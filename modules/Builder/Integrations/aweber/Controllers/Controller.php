<?php

namespace Modules\Builder\Integrations\aweber\Controllers;

use App\Models\Connection;
use Illuminate\Http\Request;
use Modules\Builder\Integrations\aweber\Handler;
use Modules\Builder\Integrations\IntegrationController;
use League\Oauth2\Client\Provider\GenericProvider;



class Controller extends IntegrationController
{
	
    protected $name = 'aweber';
    public function getHandleCallback()
    {
        $aweberAPI = $this->getApi();
		
        $request = request();
        $redirectUri = route('integrationCallbackUrl', ['provider'=>$this->name]);
		// Create a OAuth2 client configured to use OAuth for authentication
		$provider = Handler::getOauth2Provider($redirectUri);
		

        if (!isset($_GET['code'])) {
            // If we don't have an authorization code then get one
			$authorizationUrl = $provider->getAuthorizationUrl();
			$_SESSION['oauth2state'] = $provider->getState();
            $authUrl = $aweberAPI->getAuthorizeUrl();
            return redirect()->away($authorizationUrl);
        } else {
            if (request()->ajax()) {
				$code = $_GET['code'];
                $token = $provider->getAccessToken('authorization_code', [
					'code' => $code
				]);
				$accessToken = $token->getToken();
				$refreshToken = $token->getRefreshToken();
                try {
                    // We got an access token, let's now get the user's details
					$account = Handler::getUser($accessToken);
					if(empty($account)) {
						throw new \Exception('Something wrong happened');
					}
                    $id = $account['id'];
                    $accounts = Connection::where('name', $this->name)->where('account_id', $id)->where('user_id', auth()->user())->get();
                    if (sizeof($accounts) == 0) {
                        Connection::create(
                            [
                            'name' => $this->name,
                            'user_id' => auth()->user()->id,
                            'account_id'=>$id ,
                            'account_name'=> $accessToken,
                            'details'=>serialize($token),
                            'token'=>$accessToken,
                            'created_at' => \Carbon\Carbon::now(),
                            'updated_at' => \Carbon\Carbon::now(),
                            ]
                        );
                    } else {
                        Connection::where('id', $accounts[0]->id)
                        ->update(
                            [
                            'account_name'=> $accessTokenSecret,
                            'details'=>serialize($user),
                            'token'=>$accessToken,
                            'updated_at' => \Carbon\Carbon::now(),
                            ]
                        );
                        return view('integration/callback');
                    }
                } catch (\Exception $e) {
					throw $e;
                   // exit('Oh dear...');
                }
            }
        }
    }
    public function getList(Request $request)
    {
        $connects = Connection::where('name', $this->name)->where('user_id', auth()->user()->id)->get();
        $rs = [];
        if (!empty($connects)) {
            $aweberAPI = $this->getApi();
            foreach ($connects as $connect) {
				Handler::refreshToken($connect);
                $accessToken = $connect->token;
				$account = Handler::getUser($accessToken);
                $lists = Handler::getList($connect->account_id, $accessToken);
                $lst = [];
                foreach ($lists as $list) {
                    $lst[ $list['id'] ] = ['id'=>$list['id'], 'name'=>$list['name'] ];
                }
                $rs[$connect->id] = [
                    'id'=>$connect->id,
                    'name'=>$account['id'],
                    'lists'=>$lst
                ];
            }
        }
        return json_encode($rs);
    }
    public function getFields(Request $request)
    {
        $connection_id = $request->input('connection_id');
        $listId = $request->input('list_id');
        $connect = Connection::find($connection_id);
        $mapping_fields = [];
        if (!empty($connect)) {
			Handler::refreshToken($connect);
            $accessToken = $connect->token;
            $accountId = $connect->account_id;
            $mapping_fields = $this->getMappingFields($accountId, $listId, $accessToken);
        }
        return $mapping_fields;
    }
    protected function getMappingFields($accountId, $listId, $accessToken)
    {
        $map_fields = [
            "email"=>[ "name"=>"Email", 'required'=>true, "type"=>"mapping_field" ],
            "name"=>[ "name"=>"Name", 'required'=>false, "type"=>"mapping_field" ],
            "misc_notes"=>[ "name"=>"Notes", 'required'=>false, "type"=>"mapping_field" ],
            "ad_tracking"=>[ "name"=>"Ad tracking", 'required'=>false, "type"=>"mapping_field" ],
            "ip_address"=>[ "name"=>"IP Adress", 'required'=>false, "type"=>"default_value", "value"=> request()->ip() ],
            "custom_fields"=>[
            
            ]
        ];
        $custom_fields = Handler::getCustomFields($accountId, $listId, $accessToken);//$list->custom_fields;
        $size = sizeof($custom_fields);
        if ($size) {
            for ($i = 0; $i < $size; $i++) {
                $entry = $custom_fields[$i];
                if (!is_null($entry)) {
                    $map_fields['custom_fields'][] = $entry->name;
                }
            }
        }
        return $map_fields;
    }
    
    protected function getApi()
    {
        return Handler::getApi();
    }
}
