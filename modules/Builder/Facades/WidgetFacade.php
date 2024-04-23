<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class WidgetFacade extends Facade
{
    /**
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'app.widget';
    }
}
