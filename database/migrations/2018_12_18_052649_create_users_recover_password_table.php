<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateUsersRecoverPasswordTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users_recover_password', function (Blueprint $table) {
            $table->bigInteger('user_id');
            $table->string('code', 100);
            $table->boolean('is_active')->default(1);
            $table->boolean('is_used')->default(0);
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
        Schema::drop('users_recover_password');
    }
}
