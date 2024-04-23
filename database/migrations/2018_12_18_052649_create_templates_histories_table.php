<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateTemplatesHistoriesTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('templates_histories', function (Blueprint $table) {
            $table->bigInteger('id', true);
			$table->uuid('uuid')->index();
			$table->bigInteger('template_id');
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
        });
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('templates_histories');
    }
}
