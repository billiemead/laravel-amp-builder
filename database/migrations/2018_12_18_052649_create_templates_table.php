<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateTemplatesTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('templates', function (Blueprint $table) {
            $table->bigInteger('id', true);
			$table->uuid('uuid')->index();
			$table->char('source_uuid', 36)->nullable();
            $table->string('name');
            $table->text('content', 65535)->nullable();
            $table->mediumText('structure')->nullable();
            $table->bigInteger('category');
            $table->string('screenshot_url', 255)->nullable();
            $table->string('type', 40)->default('page');
			$table->tinyInteger('is_active')->default(1);
			$table->tinyInteger('is_global')->default(1);
			$table->bigInteger('site_id')->default(0);
            $table->bigInteger('viewed')->default(0);
            $table->timestamps();
            $table->string('title')->nullable();
            $table->string('description')->nullable();
            $table->string('keywords')->nullable();
            $table->bigInteger('owner_id');
        });
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('templates');
    }
}
