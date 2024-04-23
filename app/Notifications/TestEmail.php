<?php
namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class TestEmail extends Notification
{
    private $formData;

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
        $subject = "New test email via $siteName admin page";
        $mail_config = config('mail');
        $address = config('mail.from.address');
        $message = 'This is test email. Your email system worked properly.';
        return (new MailMessage)
            ->subject($subject)
            ->greeting($subject)
            ->line($message);
    }
}
