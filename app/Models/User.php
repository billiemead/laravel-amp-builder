<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Notifications\Notifiable;

use DB;
use Hash;
use Storage;
use Carbon\Carbon;
use Spatie\Permission\Traits\HasRoles;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Spatie\Permission\Contracts\Permission as PermissionContract;
use Spatie\Permission\Contracts\Role as RoleContract;
use Dyrynda\Database\Support\GeneratesUuid;
use Dialect\Gdpr\Portable;
use Dialect\Gdpr\Anonymizable;

use App\Models\Site;
use App\Models\Template;
use App\Models\Connection;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\VerifyEmail;
use App\Notifications\WelcomeEmail;

class User extends Model implements
    AuthenticatableContract,
    AuthorizableContract,
    CanResetPasswordContract,
    MustVerifyEmail,
    JWTSubject
{
    use GeneratesUuid;
    use Authenticatable, Authorizable, CanResetPassword;
    use HasRoles;
    use Notifiable;
    use Portable;
    use Anonymizable{
        anonymize as panonymize;
    }
    
    protected $activationFactory;
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'email', 'password', 'username', 'plan_id', 'email_verified_at', 'provider', 'provider_id', 'is_active', 'is_admin', 'activated', 'never_expire', 'expire_at', 'last_activity', 'accepted_gdpr', 'isAnonymized'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['password', 'remember_token'];
    protected $dates = ['expire_at', 'trial_ends_at'];
    protected $conditions = ['max_site', 'max_visitor', 'upload_size'];
    protected $gdprWith = ['sites', 'connections', 'templates'];

    protected $with = array('roles');
    protected $gdprAnonymizableFields = [
        'name' => 'Anonymized User',
        'email' => 'anonymous@mail.com',
        'username' => 'anonymous@mail.com',
        'password'=>'',
    ];
    
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
    public function isAdmin()
    {
        return $this->hasRole('super_admin');
    }
    public function templates()
    {
        return $this->hasMany('App\Models\Template', 'owner_id');
    }
    public function sites()
    {
        return $this->hasMany('App\Models\Site', 'owner_id');
    }
    public function connections()
    {
        return $this->hasMany('App\Models\Connection', 'user_id');
    }
    public function getUserRoles()
    {
        $userRoles = [];
        $roles = $this->roles;
        foreach ($roles as $role) {
            $userRoles[] = $role->name;
        }
        return $userRoles;
    }
    public function getRolesAbilities()
    {
        $abilities = [];
        $roleClass = app(RoleContract::class);
        $roles = $roleClass::all();

        foreach ($roles as $role) {
            if (!empty($role->name)) {
                $abilities[$role->name] = [];
                $rolePermission = $role->permissions()->get();

                foreach ($rolePermission as $permission) {
                    if (!empty($permission->name)) {
                        array_push($abilities[$role->name], $permission->name);
                    }
                }
            }
        }

        return $abilities;
    }


    
    public function delete(array $options = [])
    {
        Site::where('owner_id', $this->id)->delete();
        Template::where('owner_id', $this->id)->delete();
        Connection::where('user_id', $this->id)->delete();
        Storage::disk('uploads')->deleteDirectory($this->id);
        parent::delete();
    }
    public function isExpired()
    {
        return false;
    }
    public function isSiteOwner(Site $site)
    {
        return $site->owner_id == $this->id;
    }
    public function isSiteEditable(Site $site)
    {
        return $this->isSiteOwner($site) || $this->hasRole('super_admin') || $this->hasRole('admin');
    }
    public function anonymize($modelChecker = [])
    {
        $this->panonymize($modelChecker);
        Storage::disk('uploads')->deleteDirectory($this->id);
    }
    public function hasVerifiedEmail()
    {
        return !config('auth.activation.enabled') || !is_null($this->email_verified_at);
    }
    public function markEmailAsVerified()
    {
        $this->email_verified_at = \Carbon\Carbon::now();
        $this->save();
    }
    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmail);
    }
    public function sendWelcomeNotification()
    {
        $this->notify(new WelcomeEmail);
    }
}
