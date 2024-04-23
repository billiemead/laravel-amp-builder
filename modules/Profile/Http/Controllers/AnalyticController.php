<?php

namespace Modules\Profile\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Site;
use Illuminate\Http\Request;

class AnalyticController extends Controller
{

    /**
     * Render Analytic widget in profile page analytic
     * @param $id
     * @param Request $request
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View|string
     */
    public function viewUrl($id, Request $request)
    {
        $site = Site::withCount(['conversions', 'visits'])->findOrFail($id);
        
        if (!isset($site)) {
            return "Site doesn't exitst.";
        }
        $startDate = \Carbon\Carbon::now()->subMonths(1);
        if ($request->has('startDate')) {
            $startDate = \Carbon\Carbon::createFromFormat('Y-n-j', $request->input('startDate'));
        }
        $endDate = \Carbon\Carbon::now();
        if ($request->has('endDate')) {
            $endDate = \Carbon\Carbon::createFromFormat('Y-n-j', $request->input('endDate'));
        }
        $path = $request->input('path');
        return view('profile::analytic/'.$path, ['site'=>$site,'startDate'=>$startDate->toDateString(), 'endDate'=>$endDate->toDateString()]);
    }
}
