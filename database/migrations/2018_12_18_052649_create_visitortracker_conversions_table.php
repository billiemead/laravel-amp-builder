<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateVisitortrackerConversionsTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('visitortracker_conversions', function (Blueprint $table) {
            $table->increments('id');
            $table->bigInteger('goal_id');
            $table->bigInteger('visit_id')->unsigned()->nullable()->default(0);
            $table->bigInteger('visitor_id');
            $table->bigInteger('site_id')->default(0);
            $table->bigInteger('page_id')->default(0);
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
        Schema::drop('visitortracker_conversions');
    }
}
