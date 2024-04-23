<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateSiteDomainsTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('site_domains', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->bigInteger('site_id');
            $table->string('name', 100);
            $table->integer('subdomain')->default(1);
			$table->integer('secured')->default(0);
            $table->string('path', 255)->nullable();
            $table->timestamps();
            $table->bigInteger('creator_id');
            $table->bigInteger('last_modified_by');
        });
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('site_domains');
    }
}
