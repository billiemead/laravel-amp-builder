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

Route::middleware('auth:api')->get('/profile', function (Request $request) {
    return $request->user();
});
Route::group(array('middleware' => ['auth', 'api.auth'], 'prefix'=>'profile'), function () {
    Route::resource('user', 'rest\UserProfileController');
    Route::post('user/password', 'rest\UserProfileController@changeMyPassword');
    Route::resource('page/domain', 'rest\DomainController');
	Route::post('page/clearAnalytic', 'rest\SiteController@clearAnalytic');
    Route::post('page/variants/clone/{id}', 'rest\VariantController@cloneVariant');
    Route::post('page/variants/restore/{id}', 'rest\VariantController@restore');
    Route::post('page/variants/forceDelete/{id}', 'rest\VariantController@forceDelete');
    Route::resource('page/variants', 'rest\VariantController');
    Route::resource('page', 'rest\SiteController');
    Route::get('template/category', '\App\Http\Controllers\rest\ThemeCategoriesController@index');
	Route::post('template/upload', 'rest\TemplateController@upload');
	Route::get('template/clone/{id}', 'rest\TemplateController@cloneTemplate');
    Route::resource('template', 'rest\TemplateController', ['except' => ['create', 'index']]);
    Route::post('template/nextPage', 'rest\TemplateController@nextPage');
    Route::resource('theme_category', '\App\Http\Controllers\rest\ThemeCategoriesController');
    
    
    Route::resource('integration', 'rest\IntegrationController');
    
    Route::post('pagedList/templates', 'rest\TemplateController@getPagedList');
    Route::post('pagedList/domain', 'rest\DomainController@getPagedList');
});
