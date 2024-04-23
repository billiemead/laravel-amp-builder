<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Dialect\Gdpr\Anonymizable;

class Connection extends Model
{
    use Anonymizable;

    protected $table = 'connections';
    protected $fillable = ['name', 'user_id', 'account_id', 'account_name', 'details', 'token', 'expired_in', 'refresh_token', 'created_at', 'updated_at'];
}
