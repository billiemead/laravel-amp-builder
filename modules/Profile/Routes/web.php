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

Route::prefix('profile')->group(function () {
    Route::get('/', 'ProfileController@index');
});
Route::group(array( 'middleware' => ['auth', 'verified', 'gdpr.terms']), function () {
    Route::get('/profile', array('uses' => 'ProfileController@index'));
});
Route::group(array( 'middleware' => 'auth'), function () {
    Route::get('/analytic/{account}/view_url', array('uses' => 'AnalyticController@viewUrl'));
    Route::get('/export_project/{account}', array('as'=>'exportProjectRoute', 'uses' => 'rest\TemplateController@exportProject'));
});
