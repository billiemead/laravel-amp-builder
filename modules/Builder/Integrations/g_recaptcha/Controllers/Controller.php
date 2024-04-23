<?php

namespace Modules\Builder\Integrations\g_recaptcha\Controllers;

use App\Models\Connection;
use DB;
use Illuminate\Http\Request;
use Validator;
use Hash;
use Modules\Builder\Integrations\IntegrationController;

class Controller extends IntegrationController
{
    public function authorizeAccount(Request $request)
    {
        $secret_key = $request->input('secret_key');
        $site_key = $request->input('site_key');
        $display_name = $request->input('display_name');
        $response = ['secret_key'=>$secret_key, 'site_key'=>$site_key];
        $record = Connection::where('account_id', $secret_key)->where('name', 'g_recaptcha')->where('user_id', auth()->user()->id)->first();
        if ($record === null) {
            $record = Connection::create(
                [
                'name' => 'g_recaptcha',
                'user_id' => auth()->user()->id,
                'account_id'=>$secret_key ,
                'account_name'=> $site_key,//$display_name,
                'details'=>serialize($response),
                'token'=>$site_key,
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now(),
                ]
            );
        } else {
            $record->fill([
                'account_name' => $display_name,
                'updated_at' => \Carbon\Carbon::now(),
                'details' => serialize($response)
            ])->save();
        }
        
        return 1;
    }
}
