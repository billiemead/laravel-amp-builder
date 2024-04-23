<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThemeCategory extends Model
{
    protected $guarded = [];
    public $table = "themes_categories";
    public function getUniqueSlug($value)
    {
        $slug = str_slug($value);
        $slugCount = count($this->whereRaw("slug REGEXP '^{$slug}(-[0-9]+)?$' and id != '{$this->id}'")->get());

        return ($slugCount > 0) ? "{$slug}-{$slugCount}" : $slug;
    }
}
