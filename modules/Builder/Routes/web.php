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

Route::prefix('builder')->group(function () {
    Route::get('/', 'BuilderController@index');
});

Route::get('/themes/{theme}/style', array('uses' => 'ThemeController@viewStyle'));
Route::get('/themes/{theme}/{file}.scss', array('uses' => 'ThemeController@viewStyle'));
Route::get('/variants/{page_uuid}/iframe', array('as'=>'iframe', 'uses' => 'CanvasController@viewInCanvas'));

$websiteBuilderApiRoute = 'builder';

Route::group(['middleware' => ['auth']], function () {
    Route::get('/project/{project_uuid}/edit', array('as'=>'editChampionVariantRoute', 'uses' => 'WebsiteBuilderController@openProjectBuilder'));
    Route::get('/pages/{page_uuid}/edit', array('as'=>'editSiteRoute', 'uses' => 'WebsiteBuilderController@openVariantBuilder'));
    

    
    Route::get('/download_site/{project_uuid}', array('as'=>'downloadSiteRoute', 'uses' => 'WebsiteBuilderController@download'));
});
Route::get('/pages/history/{page_uuid}/view', array('as'=>'viewVariantHistoryRoute_full', 'uses'=>'ViewHistoryController@view'));

Route::get('/projects/{account}/{name}.html', array('as'=>'viewSiteRoute_full', 'uses'=>'ViewProjectController@view'));
Route::get('/pages/{page_uuid}/view', array('as'=>'viewVariantRoute_full', 'uses'=>'ViewProjectController@viewVariant'));
Route::get('/projects/{account}', array('as'=>'viewSiteRoute', 'uses' => 'ViewProjectController@view'));
Route::get('/project/{account}/preview', array('as'=>'previewSiteRoute', 'uses' => 'ViewProjectController@preview'));
Route::get('/site/{account}', 'ViewProjectController@view');
Route::get('/site/{account}/{name}.html', 'ViewProjectController@view');
Route::post('/track/{variant}', array('middleware' => 'ampcors:variant', 'as'=>'trackingUrl', 'uses'=>'WebsiteBuilderController@tracking'));





$websiteBuilderApiRoute = 'template_builder';
Route::group(['middleware' => ['auth']], function () use ($websiteBuilderApiRoute) {
    Route::get('/template/{account}/edit', array('as'=>'editTemplateRoute', 'uses' => 'TemplateController@index'));
    
    Route::get('/template/{account}/iframe', array('as'=>'iframeTemplate', 'uses' => 'CanvasController@viewTemplateInCanvas'));
    
    Route::resource('api/'.$websiteBuilderApiRoute.'template/category', 'rest\ThemeCategoriesController')->only([
        'index', 'show'
    ]);
    Route::post('api/'.$websiteBuilderApiRoute.'template/nextPage', 'rest\TemplateController@nextPage');
});

Route::get('/template/history/{page_uuid}/view', array('as'=>'viewTemplateHistoryRoute_full', 'uses'=>'ViewTemplateHistoryController@view'));

Route::get('/template/{account}/preview', array('as'=>'previewSiteTemplateRoute', 'uses' => 'TemplateController@preview'));

Route::get('/template/{account}/view', array('as'=>'viewSiteTemplateRoute', 'uses' => 'TemplateController@view'));
