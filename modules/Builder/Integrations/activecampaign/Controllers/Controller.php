<?php

namespace Modules\Builder\Integrations\activecampaign\Controllers;

use Illuminate\Http\Request;
use ActiveCampaign;
use App\Models\Connection;
use Modules\Builder\Integrations\IntegrationController;
use Carbon\Carbon;

class Controller extends IntegrationController
{
    protected $name = 'activecampaign';
    
    public function getCampaigns(Request $request)
    {
        $connections = Connection::where('name', $this->name)->where('user_id', auth()->user()->id)->get();
        $rs = ['list'=>[]];
        $ac = null;
        if (sizeof($connections)) {
            foreach ($connections as $connection) {
                $details = unserialize($connection->details);
                $api_key = array_get($details, 'api_key');
                $api_url = array_get($details, 'api_url');
                
                try {
                    $ac = new ActiveCampaign($api_url, $api_key);
                    $list = $this->getList($connection, $ac);
                    if (is_array($list)) {
                        $rs['list'][$connection->id] = ['id'=>$connection->id, 'name'=>$connection->account_name, 'list'=>$list];
                    } elseif (is_string($list)) {
                        $rs['error'] = $list;
                    }
                } catch (\Exception $e) {
                    $rs['error'] = $e->getMessage();
                }
            }
        }
        $rs['mapping_fields'] = $this->getMappingFields($ac);
        return $rs;
    }
    
    public function postAuthorize(Request $request)
    {
        $api_key = $request->input('api_key');
        $api_url = $request->input('api_url');
        $ac = new ActiveCampaign($api_url, $api_key);
        
        if (!(int)$ac->credentials_test()) {
            throw new \Exception("<p>Access denied: Invalid credentials (URL and/or API key).</p>");
        }
        $account = $ac->api("account/view");
        $account_id = $account->account;
        $account_name = $account->fname.' '.$account->lname;
        $record = Connection::where('account_id', $account_id)->where('name', $this->name)->where('user_id', auth()->user()->id)->first();
        if (is_null($record)) {
            $record = Connection::create([
                'name' => $this->name,
                'user_id' => auth()->user()->id,
                'account_id'=>$account_id,
                'account_name'=> $account_name,
                'details'=>serialize(['api_key'=>$api_key, 'api_url'=>$api_url]),
                'token'=>$api_key,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        } else {
            $record->fill([
                'account_name' => $account_name,
                'updated_at' => Carbon::now(),
                'details' => serialize(['api_key'=>$api_key, 'api_url'=>$api_url])
            ])->save();
        }
        return 1;
    }
    
    /**
     * Get ActiveCampaign custom fields
     * @param $ac
     * @return array
     */
    protected function getMappingFields($ac)
    {
        $map_fields = [
            "email"=>["name"=>"Email", 'required'=>true, "type"=>"mapping_field" ],
            "first_name"=>["name"=>"First name", 'required'=>false, "type"=>"mapping_field" ],
            "last_name"=>["name"=>"Last name", 'required'=>false, "type"=>"mapping_field" ],
            "phone"=>["name"=>"Phone", 'required'=>false, "type"=>"mapping_field" ],
            "tags"=>["name"=>"Tags", 'required'=>false, "type"=>"mapping_field" ],
            "ip_signup"=>["name"=>"Language", 'required'=>false, "type"=>"default_value", "value"=> request()->ip() ],
            "timestamp_signup"=>["name"=>"Language", 'required'=>false, "type"=>"default_value", "value"=> Carbon::now()],
            "custom_fields"=>[]
        ];
        if (!empty($ac)) {
            $fields = $ac->api("list/field_view?ids=all");
            $success = (int)$fields->success;
            if ($success) {
                $list_fields = [];
                foreach ($fields as $k => $v) {
                    if (is_numeric($k)) {
                        $field_id = $v->id;
                        $list_fields[] = [
                            "id" => $field_id,
                            "name" => $v->title,
                            "type" => $v->type,
                            "required" => $v->isrequired,
                            "tag" => $v->tag
                        ];
                    }
                }
                $rs['custom_fields'] = $list_fields;
            }
        }

        return $map_fields;
    }
    /**
     * Get ActiveCampaign email list
     * @param $connection
     * @param $ac
     * @return array|string
     */
    protected function getList($connection, $ac)
    {
        $rs = [];
        $args = [
            "ids" => "all",
        ];
        
        $list = $ac->api("list/list", $args);
        $success = (int)$list->success;
        if (!$success) {
            return "Get list error: ".$list->error.'. Account: '.$connection->account_id;
        }
        foreach ($list as $k => $v) {
            if (is_numeric($k)) {
                $list_id = $v->id;
                $rs[] = [
                    "id" => $list_id,
                    "name" => $v->name
                ];
            }
        }
        return $rs;
    }
}
