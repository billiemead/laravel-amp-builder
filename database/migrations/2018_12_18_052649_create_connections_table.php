<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateConnectionsTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('connections', function (Blueprint $table) {
            $table->bigInteger('id', true);
			$table->bigInteger('user_id');
            $table->string('name');
            $table->string('account_id', 100)->nullable();
            $table->string('account_name')->nullable();
            $table->string('token', 100)->nullable();
            $table->string('refresh_token')->nullable();
            $table->dateTime('expired_in')->nullable();
            $table->text('details', 65535)->nullable();
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
        Schema::drop('connections');
    }
}
