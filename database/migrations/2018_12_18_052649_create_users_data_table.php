<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateUsersDataTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users_data', function (Blueprint $table) {
            $table->bigInteger('id');
            $table->bigInteger('user_id');
            $table->text('data', 65535);
            $table->string('name', 100);
            $table->dateTime('date_added');
            $table->dateTime('date_modified');
        });
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('users_data');
    }
}
