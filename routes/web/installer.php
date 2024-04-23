<?php
/**
 * Installer routes
 */
    Route::get('/install', 'InstallerController@index');
    Route::post('/install/{step}', 'InstallerController@step');
