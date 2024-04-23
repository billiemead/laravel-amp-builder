<?php

namespace Modules\Admin\Http\Controllers\rest;

use App\Models\User;
use App\Http\Controllers\Controller;
use File;
use DB;
use Validator;
use Spatie\Permission\Contracts\Role as RoleContract;

class RoleController extends Controller
{

    /**
     * Get list of roles
     * @return mixed
     */
    public function index()
    {
        $roleClass = app(RoleContract::class);
        $special_roles = config('permission.only_set_in_console');
        $roles = $roleClass::all()->toArray();
        $roles = array_filter($roles, function ($item) use ($special_roles) {
            if (is_array($special_roles) && !empty($special_roles)) {
                foreach ($special_roles as $special_role) {
                    if ($item['name']
                    == $special_role) {
                        return false;
                    }
                }
            }
            return true;
        });
        return response()->success(array_values($roles));
    }
}
