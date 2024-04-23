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



$websiteBuilderApiRoute = 'builder';


//API Builder route
Route::group(['middleware' => ['auth','api.auth', 'VerifyBuilderApi'], 'prefix'=> $websiteBuilderApiRoute], function () {
    Route::get('/', array('as'=>'apiRoute', 'uses' => 'ViewProjectController@viewInCanvas'));
    
    Route::get('site/structure', 'rest\WebsiteBuilderController@getStructure');
    Route::get('site/color', 'rest\WebsiteBuilderController@getColors');
    Route::get('template/structure/{template_id}', 'rest\TemplateBuilderController@getStructureInMainBuilder')->middleware(['VerifyBuilderApi:template,template_id']);
    Route::post('site/update', 'rest\WebsiteBuilderController@updateInBuilder');
    Route::get('site/font/url', 'rest\FileController@getFontFromUrl');
    Route::post('site/fetchPageContent', 'rest\WebsiteBuilderController@fetchPageContent');
    Route::get('file', 'rest\FileController@show');
    Route::get('file/UploadSize', 'rest\FileController@getMaxUploadSize');
    Route::get('file/{name}', 'rest\FileController@showDisk');
    Route::post('file', 'rest\FileController@upload');
    Route::post('file/delete', 'rest\FileController@delete');
    Route::post('file/new_folder', 'rest\FileController@newFolder');
    Route::post('file/delete_folder', 'rest\FileController@deleteFolder');
    Route::post('file/icon', 'rest\FileController@getIcon');
    
    Route::get('variants', 'rest\WebsiteBuilderController@getAllVariants');
    
    Route::get('theme_categories', '\App\Http\Controllers\rest\ThemeCategoriesController@index');
    Route::post('template/saveMySection', 'rest\TemplateController@saveMySection');
    Route::resource('template/category', '\App\Http\Controllers\rest\ThemeCategoriesController')->only([
        'index', 'show'
    ]);
    Route::post('template/nextPage', '\App\Http\Controllers\rest\TemplateController@nextPage');
    Route::resource('template', 'rest\TemplateController')->only([
        'index', 'show'
    ]);
	Route::get('page_history', 'rest\PageHistoryController@index');
	Route::post('page_history/revert', 'rest\PageHistoryController@restore');
	Route::delete('page_history/{id}', 'rest\PageHistoryController@destroy');
});

Route::group(['middleware' => ['auth', 'api.auth', 'VerifyBuilderApi', 'permission:manage_template'], 'prefix'=> $websiteBuilderApiRoute], function () {
    Route::post('template/createFromWebsite', 'rest\TemplateController@createFromWebsite');
});
Route::group(['middleware'=>['web', 'VerifyBuilderApi']], function () {
    Route::get('/site/{account}/variants', 'rest\WebsiteBuilderController@getAllVariants');
});



/**
 * Template Builder route
 */
$websiteBuilderApiRoute = 'template_builder';



//API Builder route
Route::group(['middleware' => ['auth', 'api', 'api.auth', 'VerifyBuilderApi:template'], 'prefix'=> $websiteBuilderApiRoute], function () {
    Route::get('/', array('as'=>'templateApiRoute', 'uses' => 'TemplateController@viewEdit'));
    Route::get('site/color', 'rest\TemplateBuilderController@getColors');
    Route::get('site/structure', 'rest\TemplateBuilderController@getStructure');
    Route::get('site/font', 'rest\TemplateBuilderController@getFonts');
    Route::get('site/font/url', 'rest\FileController@getFontFromUrl');
    Route::post('site/update', 'rest\TemplateBuilderController@updateInBuilder');
    Route::post('screenshot/upload', 'rest\TemplateBuilderController@uploadScreenshot');
    Route::post('screenshot', 'rest\TemplateBuilderController@postScreenshot');
    Route::get('file', 'rest\FileController@show');
    Route::get('file/UploadSize', 'rest\FileController@getMaxUploadSize');
    Route::get('file/{name}', 'rest\FileController@showDisk');
    Route::post('file', 'rest\FileController@upload');
    Route::post('file/delete', 'rest\FileController@delete');
    Route::post('file/new_folder', 'rest\FileController@newFolder');
    Route::post('file/delete_folder', 'rest\FileController@deleteFolder');
    Route::post('file/icon', 'rest\FileController@getIcon');
	Route::get('theme_categories', '\App\Http\Controllers\rest\ThemeCategoriesController@index');
    Route::post('template/saveMySection', 'rest\TemplateController@saveMySection');
    Route::get('template/structure', 'rest\TemplateBuilderController@getStructureInMainBuilder');
	Route::get('template_history', 'rest\TemplateHistoryController@index');
	Route::post('template_history/revert', 'rest\TemplateHistoryController@restore');
	Route::delete('template_history/{id}', 'rest\TemplateHistoryController@destroy');
});
Route::group(['middleware' => ['api.auth', 'permission:manage_template', 'VerifyBuilderApi:template'], 'prefix'=> $websiteBuilderApiRoute], function () {
    Route::post('template/createFromWebsite', 'rest\TemplateController@createFromWebsite');
});
