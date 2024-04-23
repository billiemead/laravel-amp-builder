<?php

namespace Modules\Builder\Integrations\salesforce\Controllers;

use App\Models\Connection;
use Modules\Builder\Integrations\IntegrationController;

use Illuminate\Http\Request;
use Forrest;

class Controller extends IntegrationController
{
    protected $name = 'salesforce';
    
    
    /**
     * Return custom lead fields of customer Saleforce instance
     * @param Request $request
     * @return array
     */
    protected function getMappingFields($forest)
    {
        $map_fields = [
            "Email"=>[ "name"=>"Email", 'required'=>true, "type"=>"mapping_field" ],
            "LastName"=>[ "name"=>"Last name", 'required'=>true, "type"=>"mapping_field"],
            "Company"=>[ "name"=>"Company", 'required'=>true, "type"=>"mapping_field"],
            "merge_fields"=>[
            
            ]
        ];
        $response = $forest->sobjects('Lead/describe');
        
        $fields = $response['fields'];
        foreach ($fields as $field) {
            if ($field['updateable']) {
                if (empty($map_fields[$field['name']])) {
                    $map_fields[$field['name']] = [
                        "name" => $field['label'],
                        'required' => false,
                        "type" => $field['type']
                    ];
                }
            }
        }
        return $map_fields;
    }
    
    public function getHandleCallback()
    {
        if (request()->has('code')) {
            if (request()->ajax()) {
                return Forrest::callback();
            }
            return;
        }
        return Forrest::authenticate();
    }
    protected function _getList($connection, $forest)
    {
        $result = [];
        
        $response = $forest->query('select id,name from Campaign');
        $totalSize = $response['totalSize'];
        $records = $response['records'];
        for ($i = 0; $i < $totalSize; $i++) {
            $item = $records[$i];
            $result[] = ['id'=>$item['Id'], 'name'=>$item['Name']];
        }
        return $result;
    }
    
    public function getList(Request $request)
    {
        $result = [];
        $connection_id = $request->input('connection_id');
        $connect = Connection::find($connection_id);
        try {
            $forest = app()['forrestObj'];
            $forest->restoreRepositiesFromDB($connect);
            $result['list'] = $this->_getList($connect, $forest);
            $result['mapping_fields'] = $this->getMappingFields($forest);
        } catch (\Exception $e) {
            $result['error'] = $e->getMessage();
        }
        return $result;
    }
}
