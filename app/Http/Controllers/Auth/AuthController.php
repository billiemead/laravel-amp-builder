<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function __construct()
    {
        \Assets::addScripts(['profile_app']);
        \Assets::addStyles(['profile']);
        if (request()->isMethod('post') && config('auth.reCAPTCHA.enable')) {
            $this->middleware('recaptcha')->except('logout');
        }
    }
    /**
     * Get user current context.
     *
     * @return JSON
     */
    public function getMe()
    {
        $user = User::find(auth()->user()->id);
        $user['roles'] = $user->getUserRoles();
        $user['abilities'] = $user->getRolesAbilities();
        return response()->success($user);
    }
}
