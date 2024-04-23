<?php

namespace Modules\Builder\Integrations\acellemail\Controllers;

use App\Models\Connection;
use Illuminate\Http\Request;
use Hash;
use Modules\Builder\Integrations\IntegrationController;
use Modules\Builder\Integrations\acellemail\Handler;
use Modules\Builder\Integrations\acellemail\AcellemailAPI;

class Controller extends IntegrationController
{
    protected $name = 'acellemail';
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
        $api = AcellemailAPI::createWithConnection($connection);
        $list_details = $api->getListDetail($list);
        if (is_array($list_details) && !empty($list_details['list']['fields'])) {
            $fields = $list_details['list']['fields'];
            foreach ($fields as $record) {
                $tag = $record['key'];
                $label = $record['label'];
                $required = ($record['required'] == 1 ? true : false);
                $map_fields[$tag] = ['name'=>$label, 'required'=>$required, "type"=>"mapping_field"];
            }
        }
        return $map_fields;
    }
    
    public function getList(Request $request)
    {
        $connects = Connection::where('name', $this->name)->where('user_id', auth()->user()->id)->get();
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
    
   
    protected function setupacellemail($connection)
    {
        return Handler::setupacellemail($connection);
    }
    public function postAuthorize(Request $request)
    {
        $url = $request->input('url');
        $acellemail_name = $request->input('acellemail_name');
        $token = $request->input('token');
        $api = new AcellemailAPI($url, $token);
        $response = $api->call('lists', 'get');
        $body = $response->getBody()->getContents();
        if (!$api->isJSON($body)) {
            throw new \Exception('acellemail credentials is invalid!');
        }
        $string2hash = $url.':'.$token;
        $account_id = hash('sha256', $string2hash, false);
        $account_name = $acellemail_name;
        $existing_record = Connection::where('account_id', $account_id)->where('name', $this->name)->where('user_id', auth()->user()->id)->first();
        $details = ['url'=>$url, 'token'=>$token];
        if ($existing_record === null) {
            $existing_record = Connection::create(
                [
                'name' => $this->name,
                'user_id' => auth()->user()->id,
                'account_id'=>$account_id,
                'account_name'=> $account_name,
                'details'=>serialize($details),
                'token'=>$token,
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
    protected function _getList($connection)
    {
        $rs = [];
        $api = AcellemailAPI::createWithConnection($connection);
        $response = $api->getList();
        if (!is_null($response)) {
            foreach ($response as $record) {
                $list_id = $record['uid'];
                $list_name = $record['name'];
                $rs[] = ['id'=>$list_id, 'name'=>$list_name];
            }
        } else {
            $rs = print_r($response, true);
        }
        return $rs;
    }
}
