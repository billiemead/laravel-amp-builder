<?php

namespace App\Tracking\Models;

;

use Illuminate\Database\Eloquent\Model;

class Visitor extends Model
{

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'visitortracker_visitors';
    protected $guarded = ['url'];
    protected $casts = [
        'is_ajax' => 'boolean',
        'is_login_attempt' => 'boolean',
        'is_bot' => 'boolean',
        'is_mobile' => 'boolean',
    ];
}
