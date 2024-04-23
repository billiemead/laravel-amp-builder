<?php
namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ContactForm extends Notification
{
    private $formData;

    public function __construct($formData)
    {
        $this->formData = $formData;
    }
    public function via($notifiable)
    {
        return ['mail'];
    }
    public function toMail($notifiable)
    {
        $siteName = config('general.brand_name');

        $from_address = array_get($this->formData, 'email');
        $from_name = array_get($this->formData, 'name');
        $subject = "New message via $siteName contact page from $from_name($from_address)";
        $message_subject = array_get($this->formData, 'subject');
        $message = array_get($this->formData, 'message');
        return (new MailMessage)
            ->subject($subject)
            ->greeting($subject)

            ->from($from_address, $from_name)
            ->line($message_subject)
            ->line($message);
    }
}
