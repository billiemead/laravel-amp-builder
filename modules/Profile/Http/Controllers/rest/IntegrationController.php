<?php

namespace Modules\Profile\Http\Controllers\rest;

use App\Models\Connection;
use App\Http\Controllers\Controller;
use File;
use DB;
use Validator;

class IntegrationController extends Controller
{
    /**
     * Get user social connections
     * @return mixed
     */
    public function index()
    {
        $connections = Connection::where('user_id', auth()->user()->id)->get();
        return response()->success($connections);
    }
    /**
     * Remove an user social connection
     * @return mixed
     */
    public function destroy()
    {
        $id = request()->input('id');
        $connection = Connection::where('id', $id)->where('user_id', auth()->user()->id)->firstOrFail();
        $connection->delete();
        return response()->success(1);
    }
}
