<?php

namespace Modules\Admin\Http\Controllers\rest;

use App\Http\Controllers\Controller;
use Mail;
use App\Notifications\TetEmail;
use Notification;

class MailController extends Controller
{
    /**
     * Send a test email
     * @return mixed
     */
    public function sendTestEmail()
    {
        $to = request()->input('to');
        $response = Mail::send('emails.test', [], function ($message) use ($to) {
            $message->to($to)->subject('Testing email');
        });
        return response()->success($response);
    }
}
