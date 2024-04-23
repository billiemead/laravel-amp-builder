<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use App\Models\Template;

class CreateTemplatesTableAdd extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::table('templates')->delete();
        $templatesFolder = base_path().DIRECTORY_SEPARATOR.'database'.DIRECTORY_SEPARATOR.'migrations'.DIRECTORY_SEPARATOR.'template_started';
        $files = \File::files($templatesFolder);
        foreach ($files as $file) {
            $model = Template::importFromFile($file->getRealPath());
        }
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }
}
