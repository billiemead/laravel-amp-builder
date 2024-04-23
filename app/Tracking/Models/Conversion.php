<?php

namespace App\Tracking\Models;

;

use Illuminate\Database\Eloquent\Model;

class Conversion extends Model
{

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'visitortracker_conversions';
    protected $guarded = ['url'];
}
