<?php

namespace App\Http\Middleware;

use Closure;

class Recaptcha
{
    protected $except = [
        //
    ];
    public function handle($request, Closure $next)
    {
        if ($this->isRecaptchaRequest($request)) {
            $recaptcha_token = $this->getPostToken();
            $rs = $this->checkToken($recaptcha_token);
            if ($rs !== true) {
                $url = $request->url();
                $message = trans('auth.recaptcha_error');//'Recaptcha token mismatch. Details: '.implode(', ', $rs['error-codes']);
                //if(config('app.debug'))
                $message.= print_r($rs, true);
                //throw new \Exception($message);
                return redirect($url)->with('captchaErrors', $message);
            }
        }
        return $next($request);
    }
    protected function checkToken($token)
    {
        $secretKey = config('auth.reCAPTCHA.secret_key');
        $url = "https://www.google.com/recaptcha/api/siteverify?response=$token&secret=$secretKey";
        $client = new \GuzzleHttp\Client();
        $res = $client->request('POST', $url);
        $body = $res->getBody();
        $response = json_decode($body, true);
        
        if (!empty($response) && !empty($response['success']) && $response['success']) {
            if (config('auth.reCAPTCHA.version') == 3) {
                return $response["score"] >= 0.5;
            }
            return true;
        }
        $response['url'] = $url;
        return $response;
    }
    
    protected function isRecaptchaRequest($request)
    {
        return config('auth.reCAPTCHA.enable');
    }
    protected function getPostToken()
    {
        $recaptcha_token = request()->input(config('auth.reCAPTCHA.input_field_id'));
        return $recaptcha_token;
    }
}
