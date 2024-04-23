<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateVisitortrackerConversionGoalsTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('visitortracker_conversion_goals', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->string('name');
            $table->integer('priority');
        });
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('visitortracker_conversion_goals');
    }
}
