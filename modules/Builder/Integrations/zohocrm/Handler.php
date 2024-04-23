<?php

namespace Modules\Builder\Integrations\zohocrm;

use App\Models\Connection;
use DB;
use Illuminate\Http\Request;
use Validator;

class Handler
{
    public function subscribe($post_data, $integration)
    {
        $list = array_get($integration, 'list');
        $account = array_get($integration, 'account');
        $connect = Connection::find($account);
        if (!empty($connect)) {
            $config = config('integrations.zohocrm');
            \ZohoOAuth::initializeWithOutInputStream($config);
            \ZCRMRestClient::initialize();
            \ZCRMConfigUtil::setConfigValue("currentUserEmail", $connect->account_id);
            $zcrmModuleIns = \ZCRMModule::getInstance("Leads");
            $record = \ZCRMRecord::getInstance("Leads", null);
            foreach ($post_data as $name => $value) {
                $record->setFieldValue($name, $value);
            }
    
            $result = $zcrmModuleIns->upsertRecords([$record]);
            $entityResponses = $result->getEntityResponses();
            $entityResponse = $entityResponses[0];
            $rs = [];
            if ("success" == $entityResponse->getStatus()) {
                $createdRecordInstance=$entityResponse->getData();
                $entityId = $createdRecordInstance->getEntityId();
                if (!empty($list)) {
                    $parentRecord = \ZCRMRecord::getInstance("Campaigns", $list);
                    $junctionRecord = \ZCRMJunctionRecord::getInstance("Leads", $entityId);
                    $responseIns = $parentRecord->addRelation($junctionRecord);
                }
                $upsertData=$entityResponse->getUpsertDetails();
                $rs = [
                    "Status"=>$entityResponse->getStatus(),
                    "Message"=>$entityResponse->getMessage(),
                    "Code"=>$entityResponse->getCode(),
                    
                    "UPSERT_ACTION"=>$upsertData['action'],
                    "UPSERT_DUPLICATE_FIELD"=>$upsertData['duplicate_field'],
                    
                    "EntityID"=>$createdRecordInstance->getEntityId(),
                    "moduleAPIName"=>$createdRecordInstance->getModuleAPIName()
                ];
            } else {
                $rs =[
                    "Status"=>$entityResponse->getStatus(),
                    "Message"=>$entityResponse->getMessage()
                ];
            }
            return $rs;
        }
        return json_encode(1);
    }
}
