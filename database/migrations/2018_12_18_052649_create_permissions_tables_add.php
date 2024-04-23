<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreatePermissionsTablesAdd extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::table('roles')->delete();
        
        \DB::table('roles')->insert(array(
            0 =>
            array(
                'id' => 1,
                'name' => 'super_admin',
                'guard_name' => 'web',
                'created_at' => '2018-08-19 02:40:11',
                'updated_at' => '2018-08-19 02:40:11',
            ),
            1 =>
            array(
                'id' => 2,
                'name' => 'admin',
                'guard_name' => 'web',
                'created_at' => '2018-08-19 04:08:57',
                'updated_at' => '2018-08-19 04:08:57',
            ),
        ));
        \DB::table('permissions')->delete();
        
        \DB::table('permissions')->insert(array(
            0 =>
            array(
                'id' => 1,
                'name' => 'user_admin',
                'guard_name' => 'web',
                'created_at' => '2018-08-19 03:02:05',
                'updated_at' => '2018-08-19 03:02:05',
            ),
            1 =>
            array(
                'id' => 2,
                'name' => 'manage_template',
                'guard_name' => 'web',
                'created_at' => '2018-08-19 06:27:14',
                'updated_at' => '2018-08-19 06:27:14',
            ),
        ));
        \DB::table('role_has_permissions')->delete();
        
        \DB::table('role_has_permissions')->insert(array(
            0 =>
            array(
                'permission_id' => 2,
                'role_id' => 1,
            ),
            1 =>
            array(
                 'permission_id' => 2,
                'role_id' => 2,
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
        \DB::table('roles')->delete();
        \DB::table('permissions')->delete();
    }
}
