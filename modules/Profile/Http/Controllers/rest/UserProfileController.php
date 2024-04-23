<?php

namespace Modules\Profile\Http\Controllers\rest;

use App\Models\User;
use App\Http\Controllers\Controller;
use File;
use DB;
use Validator;
use Hash;

class UserProfileController extends Controller
{
    /**
     * Get information of current logged user
     * @return false|string
     */
    public function index()
    {
        $id = auth()->user()->id;
        $user = User::where('id', $id)->first();
        
        return json_encode($user);
    }

    /**
     * Update information of current logged user
     * @return int
     */
    public function store()
    {
        $request = request();
        $validator = Validator::make($request->all(), array(
            'name' => 'required|max:255',
        ));
        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        $id = auth()->user()->id;
        $attributes = array(
            'name' => $request->input('name'),
        );
        
        User::where('id', $id)->update($attributes);
        return 1;
    }

    /**
     * Change password of current logged user
     * @return array
     */

    public function changeMyPassword()
    {
        $request = request();
        $id = auth()->user()->id;
        $validator = Validator::make($request->all(), array(
            'old_password' => 'required|min:6',
            'new_password' => 'required|min:6|different:old_password',
        ));
        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        $user = User::findOrFail($id);
        if (!Hash::check($request->input("old_password"), $user->password)) {
            return ["Old password doesn't match!"];
        }
        $user->update(array("password"=>bcrypt($request->input("new_password"))));
        return 1;
    }
    
    public function closeAccount()
    {
        $request = request();
        $id = auth()->user()->id;
        $validator = Validator::make($request->all(), array(
            'password' => 'required|min:6|confirmed',
        ));
        if ($validator->fails()) {
            return $validator->errors();
        }
        $validate_user = User::findOrFail($id);
        if (!Hash::check($request->input("password"), $validate_user->password)) {
            return ["Password doesn't match!"];
        }
        
        auth()->logout();
        $validate_user->delete();
        
        return redirect('/auth/login');
    }
}
