<?php
namespace App\Policies;

use App\Models\Site;
use App\Models\User;

/**
 * Class SitePolicy
 * @package App\Policies
 */
class SitePolicy
{
    public function update(User $user, Site $model)
    {
        return $model->owner_id == $user->id || $user->hasRole('super_admin') || $user->hasRole('admin');
    }
    public function create(User $user, Site $model)
    {
        return true;
    }
   
    public function delete(User $user, Site $model)
    {
        return $model->owner_id == $user->id || $user->hasRole('super_admin') || $user->hasRole('admin');
    }
}
