<?php
namespace App\Factories;

use App\Models\User;
use App\Repositories\ActivationRepository;
use Illuminate\Mail\Mailer;
use Illuminate\Mail\Message;

//http://jimfrenette.com/2016/07/laravel-user-registration-with-email-activation/?utm_source=learninglaravel.net

class ActivationFactory
{
    protected $activationRepo;
    protected $mailer;
    protected $resendAfter = 24;

    /**
     * ActivationFactory constructor.
     * @param ActivationRepository $activationRepo
     * @param Mailer $mailer
     */
    public function __construct(ActivationRepository $activationRepo, Mailer $mailer)
    {
        $this->activationRepo = $activationRepo;
        $this->mailer = $mailer;
    }

    /**
     * @param $user
     */
    public function sendActivationMail($user)
    {
        if ($user->activated || !$this->shouldSend($user)) {
            return;
        }

        $token = $this->activationRepo->createActivation($user);

        $link = route('user.activate', $token);
        $message = sprintf('Activate account %s', $link, $link);

        $this->mailer->raw($message, function (Message $m) use ($user) {
            $m->to($user->email)->subject('Activation mail');
        });
    }

    /**
     * @param $token
     * @return |null
     */
    public function activateUser($token)
    {
        $activation = $this->activationRepo->getActivationByToken($token);

        if ($activation === null) {
            return null;
        }

        $user = User::find($activation->user_id);

        $user->activated = true;
        $user->is_active = true;
        $user->save();

        $this->activationRepo->deleteActivation($token);

        return $user;
    }

    /**
     * @param $user
     * @return bool
     */
    private function shouldSend($user)
    {
        $activation = $this->activationRepo->getActivation($user);
        return $activation === null || strtotime($activation->created_at) + 60 * 60 * $this->resendAfter < time();
    }
}
