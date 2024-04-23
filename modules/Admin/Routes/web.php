<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::group(array('middleware' => 'admin', 'prefix'=> 'admin'), function () {
    Route::get('export_template/{account}', array('as'=>'exportTemplateRoute', 'uses' => 'rest\TemplateController@exportTemplate'));
    Route::get('/', array('uses' => 'AdminController@index'));
});

Route::group(array('middleware' => 'super_admin', 'prefix'=> 'admin'), function () {
    Route::get('reinstall', array('uses' => 'AdminController@reinstall'));
    Route::get('update', array('uses' => 'UpdateController@index'));
    Route::post('update/wait', array('uses' => 'UpdateController@wait'));
    Route::post('update/overview', array('uses' => 'UpdateController@overview'));
    Route::post('update/final', array('uses' => 'UpdateController@finalize'));
    Route::get('config/clearCache', 'rest\SettingsController@clearCache');
});
