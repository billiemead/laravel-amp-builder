<?php

namespace App\Tracking\Models;

use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'visitortracker_conversion_goals';
    protected $guarded = ['url'];
}
