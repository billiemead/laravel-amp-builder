<?php

namespace Modules\Builder\Integrations\zohocrm;

use DB;
use \App\Models\Connection;

class ZohoOAuthPersistenceHandler implements \ZohoOAuthPersistenceInterface
{
    public function saveOAuthData($zohoOAuthTokens)
    {
        $account_id = $zohoOAuthTokens->getUserEmailId();
        $account_name = $zohoOAuthTokens->getUserEmailId();
        $token = $zohoOAuthTokens->getAccessToken();
        $refreshtoken = $zohoOAuthTokens->getRefreshToken();
        $expirytime =$zohoOAuthTokens->getExpiryTime();
        $details = serialize(['account_id'=>$account_id,  'token'=>$token,'refreshtoken'=>$refreshtoken, 'expirytime'=>$expirytime]);
        $existing_record = Connection::where('account_id', $account_id)->where('name', 'zohocrm')->where('user_id', auth()->user()->id)->first();
        if ($existing_record === null) {
            $existing_record = Connection::create(
                [
                'name' => 'zohocrm',
                'user_id' => auth()->user()->id,
                'account_id'=>$account_id,
                'account_name'=> $account_name,
                'details'=>$details,
                'token'=>$token,
                'refresh_token'=>$refreshtoken,
                'expired_in'=> \Carbon\Carbon::createFromTimestamp($expirytime / 1000),
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now(),
                ]
            );
        } else {
            $existing_record->fill([
                'account_name'=> $account_name,
                'refresh_token'=>$refreshtoken,
                'token'=>$token,
                'details'=>$details,
                'updated_at' => \Carbon\Carbon::now(),
            ])->save();
        }
    }
    
    public function getOAuthTokens($userEmailId)
    {
        $existing_record = Connection::where('account_id', $userEmailId)->where('name', 'zohocrm')->where('user_id', auth()->user()->id)->first();
        $oAuthTokens=new \ZohoOAuthTokens();
        if ($existing_record !== null) {
            $oAuthTokens=new \ZohoOAuthTokens();
            $details = unserialize($existing_record->details);
            $oAuthTokens->setExpiryTime($details['expirytime']);
            $oAuthTokens->setRefreshToken($existing_record->refresh_token);
            $oAuthTokens->setAccessToken($existing_record->token);
            $oAuthTokens->setUserEmailId($existing_record->account_id);
        }
        return $oAuthTokens;
    }
    
    public function deleteOAuthTokens($userEmailId)
    {
        Connection::where('account_id', $userEmailId)->where('name', 'zohocrm')->where('user_id', auth()->user()->id)->delete();
    }
}
