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



/**
 * Auth routes
 */
Route::group(['middleware' => ['jwt.refresh']], function () {
    Route::get('auth/refresh_token', 'Auth\AuthController@refreshToken');
});
Auth::routes(['verify' => true]);

Route::group(['middleware' => ['auth']], function () {
	Route::get('/logout', array('as'=>'logout','uses' => 'Auth\LoginController@logout'));

});
Route::get('auth/login', function (){
	return redirect('login');
});
Route::get('auth/register', function (){
	return redirect('register');
});
Route::group(array('domain' => config('app.main_domain')), function () {

	Auth::routes();
	Route::get('file/icon', 'rest\FileController@getIcon');


	Route::get('/home', 'HomeController@index')->name('home');
	Route::get('/', 'HomeController@index');
});
