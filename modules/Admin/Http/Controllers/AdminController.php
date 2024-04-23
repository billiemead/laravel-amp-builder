<?php

namespace Modules\Admin\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    public function __construct()
    {
        \Assets::addScripts(['admin_app']);
        \Assets::addStyles(['admin']);
    }
    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function index()
    {
        return view('admin::index');
    }

  
    /**
     * Reinstall app
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function reinstall()
    {
        auth()->logout();
        Storage::delete('installed.chk');
        return redirect('install');
    }
}
