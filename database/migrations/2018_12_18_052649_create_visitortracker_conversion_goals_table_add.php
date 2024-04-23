<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateVisitortrackerConversionGoalsTableAdd extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		\DB::table('visitortracker_conversion_goals')->delete();
        
        \DB::table('visitortracker_conversion_goals')->insert(array(
            0 =>
            array(
                'id' => 1,
                'name' => 'form_submission',
                'priority' => 1,
            )
        ));
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \DB::table('visitortracker_conversion_goals')->delete();
    }
}
