<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreatePagesTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->bigInteger('id', true);
			$table->uuid('uuid')->index();
            $table->bigInteger('site_id');
            $table->string('name');
            $table->string('variant', 50)->nullable();
            $table->integer('weight')->default(0);
            $table->text('content', 65535)->nullable();
            $table->mediumText('structure')->nullable();
            $table->bigInteger('viewed')->default(0);
            $table->integer('is_template')->default(0);
            
            
            $table->string('title')->nullable();
            $table->string('description')->nullable();
            $table->string('keywords')->nullable();
			$table->timestamps();
			$table->dateTime('deleted_at')->nullable();
        });
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('pages');
    }
}
