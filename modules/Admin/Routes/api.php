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

Route::middleware('auth:api')->get('/admin', function (Request $request) {
    return $request->user();
});

Route::group(array('middleware' => ['auth', 'api', 'api.auth', 'admin'], 'prefix'=>'admin'), function () {
    Route::resource('user', 'rest\UserController');
    Route::resource('role', 'rest\RoleController');
    Route::resource('site', 'rest\SiteController');
    Route::get('template/clone/{id}', 'rest\TemplateController@cloneTemplate');
    Route::post('template/upload', 'rest\TemplateController@upload');
    Route::resource('template', 'rest\TemplateController');
    Route::resource('theme_category', 'rest\ThemeCategoriesController');
    
    Route::resource('domain', 'rest\SiteDomainController');
    Route::post('pagedList/site', 'rest\SiteController@getPagedList');
    Route::post('pagedList/templates', 'rest\TemplateController@getPagedList');
    Route::post('pagedList/user', 'rest\UserController@getPagedList');
    Route::post('pagedList/domain', 'rest\SiteDomainController@getPagedList');
    Route::post('pagedList/{name}', '\App\Http\Controllers\rest\GridController@getPagedList');
    

    Route::post('config', 'rest\SettingsController@updateConfig');
    Route::get('config/{name}', 'rest\SettingsController@getConfig');
    Route::post('config/getAll', 'rest\SettingsController@getConfigs');
    Route::post('config/rebuildCache', 'rest\SettingsController@rebuildConfigCache');
    Route::post('config/clearCache', 'rest\SettingsController@clearCache');
    Route::post('mail/test', 'rest\MailController@sendTestEmail');
});
