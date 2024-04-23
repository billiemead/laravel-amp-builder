<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateTemplatesToCategoriesTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('templates_to_categories', function (Blueprint $table) {
            $table->bigInteger('template_id');
            $table->bigInteger('category_id');
            $table->timestamps();
            $table->primary(['template_id','category_id']);
        });
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('templates_to_categories');
    }
}
