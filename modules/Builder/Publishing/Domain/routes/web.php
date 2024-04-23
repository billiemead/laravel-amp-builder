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

Route::group(array('domain' => '{custom_domain}'), function () {
    Route::get('/', ['as' => 'customDomainNonePathRoute', 'uses' => 'Domain\ViewController@viewDomain']);
    Route::get('/{name}.html', ['as' => 'customDomainNonePathRoute', 'uses' => 'Domain\ViewController@viewDomainNonePath']);
    Route::get('/{path}', ['as' => 'customDomainWithPathRoute', 'uses' => 'Domain\ViewController@viewDomain']);
    Route::get('/{path}/{name}.html', ['as' => 'customDomainWithPathRoute', 'uses' => 'Domain\ViewController@viewDomain']);
});
