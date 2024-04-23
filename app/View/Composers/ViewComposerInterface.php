<?php
namespace App\View\Composers;

use Illuminate\Contracts\View\View;

interface ViewComposerInterface
{
    /**
     * @param View $view
     */
    public function compose(View $view);
}
