<?php

namespace App\Themes\Facades;

use App\Themes\Themes;
use Illuminate\Support\Facades\Facade;

/**
 * Class ThemesFacade.
 *
 */
class ThemesFacade extends Facade
{
    /**
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return Themes::class;
    }
}
