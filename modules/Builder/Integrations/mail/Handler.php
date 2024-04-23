<?php

namespace Modules\Builder\Integrations\mail;

use App\Models\User;
use DB;
use Illuminate\Http\Request;
use Validator;
use Hash;
use Mail;

class Handler
{
    // Send form data to an email
    public function subscribe($post_data, $integration)
    {
        $address = array_get($integration, 'address');
        $subject = array_get($integration, 'subject');
        $fields = array_get($integration, 'fields');
        $form = [];
        $form_key = [];
        foreach ($post_data as $name => $value) {
            if (!empty($fields) && is_array($fields)) {
                $fieldName = $name;//array_get($fields, $name);
                $form_key[] = $fieldName;
				if(is_array($value))
					$value = implode(', ', $value);
                $form[] = $value;
            }
        }
        Mail::send('emails.sendContact', ['form' => $form, 'form_key' => $form_key], function ($mail) use ($address, $subject) {
            $mail_config = config('mail');
            $from = array_get($mail_config, 'from');
            $from_address = array_get($from, 'address');
            $from_name = array_get($from, 'name');
            $mail->from($from_address, $from_name);

            $mail->to($address)->subject($subject);
        });
        return 1;
    }
}
