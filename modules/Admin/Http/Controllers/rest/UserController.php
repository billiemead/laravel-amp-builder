<?php

namespace Modules\Admin\Http\Controllers\rest;

use Hash;
use App\Http\Controllers\Controller;

use Input;
use Validator;
use Datatables;
use Spatie\Permission\Contracts\Role as RoleContract;
use \App\Models\User;
use \Carbon\Carbon;

class UserController extends Controller
{
    
    /**
     * Add new user
     *
     * @return Boolean
     */
    public function store()
    {
        $request = request();
        $validator = Validator::make($request->all(), array(
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users|max:255',
            'password' => 'required|min:'.config('auth.validators.password.min'),

        ));

        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        $model = new User();
        $model->name = $request->get('name');
        $model->email = $request->get('email');
        $model->password = Hash::make($request->get('password'));
        
        
        $model->is_active = $request->get('is_active');
        if ($request->input('activated')) {
            $model->email_verified_at = Carbon::now();
        }
        $model->save();
        $permissions = $request->input('permissions', []);
        $roleClass = app(RoleContract::class);
        foreach ($permissions as $permission => $enable) {
            $role = $roleClass::where('id', $permission)->first();
            if ($enable) {
                $model->assignRole($role->name);
            }
        }
        return 1;
    }

    /**
     * Update user current context.
     *
     * @return JSON success message
     */
    public function update()
    {
        $request = request();
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
        ]);
        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        $id = $request->input('id');
        $user = User::find($id);
        $attributes = [
            'name' => $request->input('name'),
            'is_active' => $request->input('is_active'),
        ];
        if ($request->input('activated')) {
            $attributes['email_verified_at'] = Carbon::now();
        }
        if (config('app.demo_mode')) {
            unset($attributes['name']);
        }
        if (!empty($request->input('password'))) {
            $attributes['password']= Hash::make($request->get('password'));
        }
        $permissions = $request->input('permissions', []);
        $roleClass = app(RoleContract::class);
        foreach ($permissions as $permission => $enable) {
            $role = $roleClass::where('id', $permission)->first();
            if ($enable) {
                $user->assignRole($role->name);
            } else {
                $user->removeRole($role->name);
            }
        }
        $user->update($attributes);
        return response()->success(1);
    }

    /**
     * Get all users.
     *
     * @return JSON
     */
    public function getIndex()
    {
        $users = User::all();

        return response()->success(compact('users'));
    }
    /**
     * Get all users.
     *
     * @return JSON
     */
    public function index()
    {
        $users = User::all();

        return response()->success($users);
    }

    /**
     * Get user details referenced by id.
     *
     * @param int User ID
     *
     * @return JSON
     */
    public function show($id)
    {
        $user = User::find($id);
        if (config('app.demo_mode')) {
            $user->email = config('app.demo_auth.anynomized_email');
            $user->username = config('app.demo_auth.anynomized_email');
            $user->name = config('app.demo_auth.anynomized_name');
        }
        $user->activated = $user->hasVerifiedEmail() ? 1 : 0;
        return response()->success($user);
    }

    /**
     * Update user data.
     *
     * @return JSON success message
     */
    public function putShow()
    {
        $request = request();
        $userForm = array_dot(
            app('request')->only(
                'data.name',
                'data.email',
                'data.id'
            )
        );

        $userId = intval($userForm['data.id']);

        $user = User::find($userId);

        $this->validate($request, [
            'data.id' => 'required|integer',
            'data.name' => 'required|min:3',
            'data.email' => 'required|email|unique:users,email,'.$user->id,
        ]);

        $userData = [
            'name' => $userForm['data.name'],
            'email' => $userForm['data.email'],
        ];

        $affectedRows = User::where('id', '=', $userId)->update($userData);

        $user->detachAllRoles();

        foreach (Input::get('data.role') as $setRole) {
            $user->attachRole($setRole);
        }

        return response()->success('success');
    }

    /**
     * Delete User Data.
     *
     * @return JSON success message
     */
    public function deleteUser($id)
    {
        // $user = User::find($id);
        // $user->delete();
        return response()->success('success');
    }

    /**
     * Get all user roles.
     *
     * @return JSON
     */
    public function getRoles()
    {
        $roles = Role::all();

        return response()->success(compact('roles'));
    }

    /**
     * Get role details referenced by id.
     *
     * @param int Role ID
     *
     * @return JSON
     */
    public function getRolesShow($id)
    {
        $role = Role::find($id);

        $role['permissions'] = $role
                        ->permissions()
                        ->select(['permissions.name', 'permissions.id'])
                        ->get();

        return response()->success($role);
    }

    /**
     * Update role data and assign permission.
     *
     * @return JSON success message
     */
    public function putRolesShow()
    {
        $roleForm = Input::get('data');
        $roleData = [
            'name' => $roleForm['name'],
            'slug' => $roleForm['slug'],
            'description' => $roleForm['description'],
        ];

        $roleForm['slug'] = str_slug($roleForm['slug'], '.');
        $affectedRows = Role::where('id', '=', intval($roleForm['id']))->update($roleData);
        $role = Role::find($roleForm['id']);

        $role->detachAllPermissions();

        foreach (Input::get('data.permissions') as $setPermission) {
            $role->attachPermission($setPermission);
        }

        return response()->success('success');
    }

    /**
     * Create new user role.
     *
     * @return JSON
     */
    public function postRoles()
    {
        $role = Role::create([
            'name' => Input::get('role'),
            'slug' => str_slug(Input::get('slug'), '.'),
            'description' => Input::get('description'),
        ]);

        return response()->success(compact('role'));
    }

    /**
     * Delete user role referenced by id.
     *
     * @param int Role ID
     *
     * @return JSON
     */
    public function deleteRoles($id)
    {
        Role::destroy($id);

        return response()->success('success');
    }

    /**
     * Get all system permissions.
     *
     * @return JSON
     */
    public function getPermissions()
    {
        $permissions = Permission::all();

        return response()->success(compact('permissions'));
    }

    /**
     * Create new system permission.
     *
     * @return JSON
     */
    public function postPermissions()
    {
        $permission = Permission::create([
            'name' => Input::get('name'),
            'slug' => str_slug(Input::get('slug'), '.'),
            'description' => Input::get('description'),
        ]);

        return response()->success(compact('permission'));
    }

    /**
     * Get system permission referenced by id.
     *
     * @param int Permission ID
     *
     * @return JSON
     */
    public function getPermissionsShow($id)
    {
        $permission = Permission::find($id);

        return response()->success($permission);
    }

    /**
     * Update system permission.
     *
     * @return JSON
     */
    public function putPermissionsShow()
    {
        $permissionForm = Input::get('data');
        $permissionForm['slug'] = str_slug($permissionForm['slug'], '.');
        $affectedRows = Permission::where('id', intval($permissionForm['id']))->update($permissionForm);

        return response()->success($permissionForm);
    }

    /**
     * Delete system permission referenced by id.
     *
     * @param int Permission ID
     *
     * @return JSON
     */
    public function deletePermissions($id)
    {
        Permission::destroy($id);

        return response()->success('success');
    }

    /**
     * @return mixed
     */
    public function getPagedList()
    {
        $query = Datatables::eloquent(User::query());
        $query = $query
            ->addColumn('roles', function ($user) {
                return $user->getUserRoles();
            })
            ->filter(function ($query) {
                if (request()->has('filters.role')) {
                    $query = $query->orWhereHas('roles', function ($query) {
                        $query->where('id', request()->input('filters.role'));
                    });
                }
                if (request()->has('filters.is_active')) {
                    $query->where('is_active', request()->input('filters.is_active'));
                }
            }, true);
        // Hide user information in demo mode
        if (isDemoMode()) {
            $query = $query->editColumn('email', function ($user) {
                return config('app.demo_auth.anynomized_email');
            })->editColumn('username', function ($user) {
                return config('app.demo_auth.anynomized_email');
            })->editColumn('name', function ($user) {
                return config('app.demo_auth.anynomized_name');
            });
        }
        $result = $query->make(true)->getData();

        return response()->success($result);
    }
    /**
     * Delete a category
     * @return mixed
     */
    public function destroy()
    {
        $id = request()->input('id');
        User::where('id', $id)->delete();
        return response()->success(1);
    }
}
