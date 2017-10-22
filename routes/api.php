<?php

/*
| --------------------------------------------------------------------------
| Public routes
| --------------------------------------------------------------------------
*/

Route::get('qrcode', 'QRCodeController')->name('qrcode');

Route::get('federation', 'FederationController@show')->name('federation');
Route::post('federation', 'FederationController@store')->name('federation.store');

Route::get('prices', 'PriceController')->name('prices');

Route::post('register', 'Auth\AuthController@register');
Route::post('login', 'Auth\AuthController@login');
Route::post('refresh', 'Auth\AuthController@refresh');

/*
| --------------------------------------------------------------------------
| Member routes
| --------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function () {

    Route::get('user', 'UserController');

    Route::get('accounts', 'AccountController@index');
    Route::post('accounts', 'AccountController@store');
    Route::delete('accounts', 'AccountController@destroy');
    Route::post('unlock', 'AccountController@unlock');

});