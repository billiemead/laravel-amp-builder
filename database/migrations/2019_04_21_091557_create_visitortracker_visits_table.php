<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateVisitortrackerVisitsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('visitortracker_visits', function(Blueprint $table)
		{
			$table->bigInteger('id', true)->unsigned();
			$table->bigInteger('user_id')->unsigned()->nullable();
			$table->integer('visitor_id');
			$table->bigInteger('site_id')->default(0);
			$table->bigInteger('page_id')->default(0);
			$table->string('ip', 40);
			$table->string('method')->nullable();
			$table->boolean('is_ajax')->default(0);
			$table->text('url', 65535)->nullable();
			$table->text('referer', 65535)->nullable();
			$table->string('user_agent')->nullable();
			$table->boolean('is_desktop')->default(0);
			$table->boolean('is_mobile')->default(0);
			$table->boolean('is_bot')->default(0);
			$table->string('bot')->nullable();
			$table->string('os_family')->default('');
			$table->string('os')->default('');
			$table->string('browser_family')->default('');
			$table->string('browser')->default('');
			$table->boolean('is_login_attempt')->default(0);
			$table->string('country')->default('');
			$table->string('country_code')->default('');
			$table->string('city')->default('');
			$table->float('lat', 10, 0)->nullable();
			$table->float('long', 10, 0)->nullable();
			$table->string('browser_language_family', 4)->default('');
			$table->string('browser_language', 7)->default('');
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
		Schema::drop('visitortracker_visits');
	}

}
