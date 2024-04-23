<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateSitesTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sites', function (Blueprint $table) {
            $table->bigInteger('id', true);
			$table->uuid('uuid')->index();
            $table->string('name');
            $table->string('display_name')->nullable();
            $table->string('theme', 100)->nullable();
            $table->string('variant', 50)->nullable();
            $table->bigInteger('template')->default(0);
            $table->mediumText('structure')->nullable();
			$table->string('title')->nullable();
            $table->string('description')->nullable();
            $table->string('keywords')->nullable();
            $table->integer('asset_size')->default(0);
            $table->integer('priority')->default(0);
            $table->integer('type')->default(1);
            $table->bigInteger('owner_id')->nullable();
            $table->boolean('published')->default(0);
            $table->integer('last_modified_id')->nullable();
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
        Schema::drop('sites');
    }
}
