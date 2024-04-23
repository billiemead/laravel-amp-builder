<?php

namespace Modules\Builder\Integrations\mailwizz\Controllers;

use App\Models\Connection;
use Illuminate\Http\Request;
use Hash;
use Modules\Builder\Integrations\IntegrationController;
use Modules\Builder\Integrations\mailwizz\Handler;

class Controller extends IntegrationController
{
    
    //Fetch Mailwizz custom fields
    public function getFields(Request $request)
    {
        $map_fields = [
            "EMAIL"=>[ "name"=>"Email", 'required'=>true, "type"=>"mapping_field" ],
            
        ];
        $list = $request->input('list_id');
        $ids = explode('-', $list);
        $connection_id = $ids[0];
        $list = $ids[1];
        $connection = Connection::find($connection_id);
        $this->setupMailwizz($connection);
        $endpoint = new \MailWizzApi_Endpoint_ListFields();
        $response = $endpoint->getFields($list);
        $response = $response->body->toArray();
        if (isset($response['status']) && $response['status'] == 'success' && sizeof($response['data']['records'])) {
            $records = $response['data']['records'];
            foreach ($records as $record) {
                $tag = $record['tag'];
                $label = $record['label'];
                $required = ($record['required'] == 'yes' ? true : false);
                $map_fields[$tag] = ['name'=>$label, 'required'=>$required, "type"=>"mapping_field"];
            }
        }
        return $map_fields;
    }
    
    // Return mailwizz list of an api credential
    protected function _getList($connection)
    {
        $rs = [];
        $this->setupMailwizz($connection);
        $endpoint = new \MailWizzApi_Endpoint_Lists();
        $response = $endpoint->getLists($pageNumber = 1, $perPage = 50);
        $response = $response->body->toArray();
        if (isset($response['status']) && $response['status'] == 'success' && !empty($response['data']['records'])) {
            $records = $response['data']['records'];
            foreach ($records as $record) {
                $list_id = $record['general']['list_uid'];
                $list_name = $record['general']['display_name'];
                $rs[] = ['id'=>$list_id, 'name'=>$list_name];
            }
        } elseif (isset($response['status']) && $response['status'] == 'error') {
            $rs = $response['error'];
        } else {
            $rs = print_r($response, true);
        }
        return $rs;
    }
    
    // Process get list request from client
    public function getList(Request $request)
    {
        $connects = Connection::where('name', 'mailwizz')->where('user_id', auth()->user()->id)->get();
        $rs = ['list'=>[]];
        if (sizeof($connects)) {
            foreach ($connects as $connect) {
                $list = $this->_getList($connect);
                if (is_array($list)) {
                    $rs['list'][$connect->id] = ['id'=>$connect->id, 'name'=>$connect->account_name, 'list'=>$list];
                } elseif (is_string($list)) {
                    $rs['error'] = $list;
                }
            }
        }
        return $rs;
    }
    
    // Determine if mailwizz API Credential is valid
    public function postAuthorize(Request $request)
    {
        $url = $request->input('url');
        $mailwizz_name = $request->input('mailwizz_name');
        $public_key = $request->input('public_key');
        $private_key = $request->input('private_key');
        $config = new \MailWizzApi_Config(array(
            'apiUrl'        => $url,
            'publicKey'     => $public_key,
            'privateKey'    => $private_key,
            'components' => array(
                'cache' => array(
                    'class'     => 'MailWizzApi_Cache_File',
                    'filesPath' => dirname(__FILE__) . '/../MailWizzApi/Cache/data/cache', // make sure it is writable by webserver
                )
            ),
        ));
        
        \MailWizzApi_Base::setConfig($config);
        $endpoint = new \MailWizzApi_Endpoint_Lists();
        $response = $endpoint->getLists($pageNumber = 1, $perPage = 10);
        $response = $response->body->toArray();
        if (!isset($response['status']) || $response['status'] != 'success') {
            throw new \Exception('Mailwizz credentials is invalid!');
        }
        $string2hash = $url.':'.$public_key.':'.$private_key;
        $account_id = hash('sha256', $string2hash, false);
        $account_name = $mailwizz_name;
        $existing_record = Connection::where('account_id', $account_id)->where('name', 'mailwizz')->where('user_id', auth()->user()->id)->first();
        $details = ['url'=>$url, 'private_key'=>$private_key, 'public_key'=>$public_key];
        if ($existing_record === null) {
            $existing_record = Connection::create(
                [
                'name' => 'mailwizz',
                'user_id' => auth()->user()->id,
                'account_id'=>$account_id,
                'account_name'=> $account_name,
                'details'=>serialize($details),
                'token'=>$public_key,
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now(),
                ]
            );
        } else {
            $existing_record->fill([
                'account_name'=> $account_name,
                'details'=>serialize($details),
                'updated_at' => \Carbon\Carbon::now(),
            ])->save();
        }
        return 1;
    }
    protected function checkContactExists($email, $ac)
    {
        $result = $ac->api("contact/view?email=".$email);
        $success = (int)$result->success;
        if (!$success) {
            return false;
        }
        return (empty($result->id) ? false : $result->id);
    }
   
    protected function setupMailwizz($connection)
    {
        return Handler::setupMailwizz($connection);
    }
}
