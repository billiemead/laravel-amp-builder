<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateThemesCategoriesTableAdd extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::table('themes_categories')->delete();
        
        \DB::table('themes_categories')->insert(array (
            0 => 
            array (
                'id' => 1,
                'title' => 'App',
                'description' => '',
                'created_at' => '2017-09-29 10:01:27',
                'updated_at' => '2016-12-20 03:22:17',
                'page' => 1,
                'section' => 1,
                'popup' => 1,
            ),
            1 => 
            array (
                'id' => 2,
                'title' => 'Comming Soon',
                'description' => 'Comming Soon',
                'created_at' => '2018-08-20 15:57:46',
                'updated_at' => '2019-04-24 02:38:55',
                'page' => 1,
                'section' => 0,
                'popup' => 0,
            ),
            2 => 
            array (
                'id' => 3,
                'title' => 'Click Through',
                'description' => 'Click Through',
                'created_at' => '2018-08-20 15:58:06',
                'updated_at' => '2019-04-24 02:39:05',
                'page' => 1,
                'section' => 0,
                'popup' => 0,
            ),
            3 => 
            array (
                'id' => 4,
                'title' => 'Lead Generation',
                'description' => 'Lead Generation',
                'created_at' => '2018-09-20 09:38:24',
                'updated_at' => '2019-04-24 02:38:44',
                'page' => 1,
                'section' => 0,
                'popup' => 0,
            ),
            4 => 
            array (
                'id' => 5,
                'title' => 'Header',
                'description' => '',
                'created_at' => '2019-04-23 22:06:15',
                'updated_at' => '2019-04-23 22:06:15',
                'page' => 0,
                'section' => 1,
                'popup' => 0,
            ),
            5 => 
            array (
                'id' => 6,
                'title' => 'Call to action',
                'description' => '',
                'created_at' => '2019-04-23 22:06:38',
                'updated_at' => '2019-04-23 22:06:38',
                'page' => 0,
                'section' => 1,
                'popup' => 0,
            ),
            6 => 
            array (
                'id' => 7,
                'title' => 'Testimonials',
                'description' => '',
                'created_at' => '2019-04-23 22:06:51',
                'updated_at' => '2019-04-23 22:06:51',
                'page' => 0,
                'section' => 1,
                'popup' => 0,
            ),
            7 => 
            array (
                'id' => 8,
                'title' => 'Features',
                'description' => '',
                'created_at' => '2019-04-23 22:07:09',
                'updated_at' => '2019-04-23 22:07:09',
                'page' => 0,
                'section' => 1,
                'popup' => 0,
            ),
            8 => 
            array (
                'id' => 9,
                'title' => 'Footer',
                'description' => '',
                'created_at' => '2019-04-23 22:07:26',
                'updated_at' => '2019-04-23 22:07:26',
                'page' => 0,
                'section' => 1,
                'popup' => 0,
            ),
            9 => 
            array (
                'id' => 10,
                'title' => 'Thank you',
                'description' => '',
                'created_at' => '2019-04-23 22:08:23',
                'updated_at' => '2019-04-23 22:08:23',
                'page' => 0,
                'section' => 1,
                'popup' => 1,
            ),
            10 => 
            array (
                'id' => 11,
                'title' => 'Pricetable',
                'description' => '',
                'created_at' => '2019-04-23 22:08:50',
                'updated_at' => '2019-04-23 22:08:50',
                'page' => 0,
                'section' => 1,
                'popup' => 0,
            ),
            11 => 
            array (
                'id' => 12,
                'title' => 'FAQ',
                'description' => '',
                'created_at' => '2019-04-23 22:09:10',
                'updated_at' => '2019-04-23 22:09:14',
                'page' => 0,
                'section' => 1,
                'popup' => 0,
            ),
            12 => 
            array (
                'id' => 13,
                'title' => 'Form',
                'description' => '',
                'created_at' => '2019-04-23 22:09:44',
                'updated_at' => '2019-04-23 22:09:44',
                'page' => 0,
                'section' => 1,
                'popup' => 1,
            ),
            13 => 
            array (
                'id' => 14,
                'title' => 'Welcome',
                'description' => '',
                'created_at' => '2019-04-23 22:09:56',
                'updated_at' => '2019-04-23 22:09:56',
                'page' => 0,
                'section' => 0,
                'popup' => 1,
            ),
            14 => 
            array (
                'id' => 15,
                'title' => 'Content',
                'description' => '',
                'created_at' => '2019-04-23 22:10:05',
                'updated_at' => '2019-04-23 22:10:05',
                'page' => 0,
                'section' => 0,
                'popup' => 1,
            ),
            15 => 
            array (
                'id' => 16,
                'title' => 'Teams',
                'description' => '',
                'created_at' => '2019-04-24 01:02:30',
                'updated_at' => '2019-04-24 01:02:30',
                'page' => 0,
                'section' => 1,
                'popup' => 0,
            ),
        ));

    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }
}
