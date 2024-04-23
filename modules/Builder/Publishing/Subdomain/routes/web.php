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


Route::group(array('domain' => '{account}.'.config('publishing.subdomain.domain')), function () {
    Route::get('/', ['as' => 'subdomainRoute', 'uses' => 'Subdomain\ViewController@viewSubdomain']);
    Route::get('/{name}.html', ['as' => 'subdomainRoute', 'uses' => 'Subdomain\ViewController@viewSubdomain']);
});
Route::group(array('domain' => config('publishing.subdomain.domain')), function () {
});
