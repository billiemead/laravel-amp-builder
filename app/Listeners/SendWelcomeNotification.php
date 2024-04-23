<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Registered;

class SendWelcomeNotification
{
    /**
     * Handle the event.
     *
     * @param  \Illuminate\Auth\Events\Registered  $event
     * @return void
     */
    public function handle(Registered $event)
    {
        if (config('auth.welcome_email_enabled')) {
            $event->user->sendWelcomeNotification();
        }
    }
}
