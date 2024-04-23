<?php
namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class WelcomeEmail extends Notification
{
    public function __construct()
    {
    }
    public function via($notifiable)
    {
        return ['mail'];
    }
    public function toMail($notifiable)
    {
        $siteName = config('general.brand_name');
        $subject = "Welcome to $siteName";
        $message = 'Thank you for signing up! Here is some important information about your account. Please save this email, so you can refer to it later.
';
        $greeting ="Welcome to $siteName";
        return (new MailMessage)
            ->subject($subject)
            ->greeting($greeting)
            ->line($message)
            ->line('Your login url')
            ->action('Login', url(config('app.url').'/login'))
            ->line('Your username')
            ->line($notifiable->email);
    }
}
