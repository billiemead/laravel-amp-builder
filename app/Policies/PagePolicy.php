<?php

namespace App\Policies;

use App\Models\Page;
use App\Models\User;

class PagePolicy
{
    public function update(User $user, Page $model)
    {
        $site = $model->parent_site;
        
        return $user->can('update', $site);
    }
    public function create(User $user, Page $model)
    {
        return true;
    }
    public function delete(User $user, Page $model)
    {
        $site = $model->parent_site;
        return $user->can('delete', $site);
    }
}
