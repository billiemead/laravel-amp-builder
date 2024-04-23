<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware('api.auth')->get('/auth/users/me', 'Auth\AuthController@getMe');
Route::group(array('middleware'=>'api.auth','domain' => config('publishing.subdomain.domain')), function () {
    Route::get('view_url/path/{path}', ['as' => 'viewPath', 'uses' => 'FrontendController@viewUrl']);
});