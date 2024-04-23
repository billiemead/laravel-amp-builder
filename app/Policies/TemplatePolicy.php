<?php
namespace App\Policies;

use App\Models\Template;
use App\Models\User;

class TemplatePolicy
{
    public function update(User $user, Template $model)
    {
        if ($user->can('manage_template')) {
            return true;
        }
        if ($model->is_global == 0) {
            return $model->owner_id == $user->id;
        }
    }
    public function create(User $user, Template $model)
    {
        if ($model->is_global == 0) {
            return true;
        }
        if ($user->can('manage_template')) {
            return true;
        }
    }
   
    public function delete(User $user, Template $model)
    {
        if ($user->can('manage_template')) {
            return true;
        }
        if ($model->is_global == 0) {
            return $model->owner_id == $user->id;
        }
    }
    public function view(User $user, Template $model)
    {
        if ($user->can('manage_template')) {
            return true;
        }
        if ($model->is_global == 0) {
            return $model->owner_id == $user->id;
        }
    }
}
