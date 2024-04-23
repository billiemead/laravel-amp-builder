<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateThemesCategoriesTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('themes_categories', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->string('title', 1000);
            $table->text('description', 65535)->nullable();
			$table->tinyInteger('page')->default(1);
			$table->tinyInteger('section')->default(1);
			$table->tinyInteger('popup')->default(1);
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('themes_categories');
    }
}
