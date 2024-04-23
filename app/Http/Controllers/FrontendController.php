<?php

namespace App\Http\Controllers;

use App\Tracking\Tracker;
use Validator;
use Illuminate\Http\Request;
use App\Notifications\ContactForm;
use Notification;

class FrontendController extends Controller
{
    /**
     * Render the landing page
     * @param int $account
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index($account = 1)
    {
        return redirect('/profile');
    }

    /**
     * @param $path
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function viewUrl($path)
    {
        return view($path);
    }

    /**
     * Handle landing page contact form submission
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function sendContact(Request $request)
    {
        $rules = [
            'name' => 'required|max:255',
            'email' => 'required|email',
            'message'=>'required',
        ];
        if (config('gdpr.enabled')) {
            $rules['term_accept'] = 'required|boolean';
        }
        $validator = Validator::make($request->all(), $rules);
        
        $url = url('/').'#contact';
        if ($validator->fails()) {
            return redirect($url)->withErrors($validator);
        }
        $address = config('mail.from.address');
        Notification::route('mail', $address)
        ->notify(new ContactForm($request->all()));


        return redirect($url)->with('submitSuccess', true);
    }

    /**
     * Analytic for landing page
     */
    public function tracking()
    {
        $type = request()->input('type', 'pageview');
        $page_id = request()->input('page_id');
        if (empty($page_id)) {
            return;
        }
        switch ($type) {
            case 'pageview':
                $visit = Tracker::recordVisit();
                if (!empty($visit)) {
                    $visit->site_id = 0;
                    $visit->page_id = 0;
                    $visit->save();
                }
                break;
        }
    }
    
    /**
     * Policy page
     */
    public function privacyPolicy()
    {
        return view('frontend.privacy_policy');
    }
    
    /**
     * Terms and Conditions page
     */
    public function termCondition()
    {
        return view('frontend.term_condition');
    }
}
