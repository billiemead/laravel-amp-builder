<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TemplateToCategory extends Model
{
    protected $table = 'templates_to_categories';
    protected $guarded = [];
    protected $fillable = ['template_id', 'category_id'];
}
