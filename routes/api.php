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

Route::get('claim', 'ClaimController')->middleware('throttle:10,1');
Route::post('revoke', 'RevokeController')->middleware('throttle:10,1');

Route::post('register', 'Auth\AuthController@register');
Route::post('login', 'Auth\AuthController@login');
Route::post('refresh', 'Auth\AuthController@refresh');

Route::post('password/send', 'Auth\PasswordResetController@send');
Route::post('password/reset', 'Auth\PasswordResetController@reset');

/*
| --------------------------------------------------------------------------
| Member routes
| --------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function () {

    Route::post('change-password', 'Auth\AuthController@changePassword');

    Route::get('user', 'UserController');

    Route::get('accounts', 'AccountController@index');
    Route::post('accounts', 'AccountController@store');
    Route::delete('accounts', 'AccountController@destroy');
    Route::post('unlock', 'AccountController@unlock');

    Route::post('transactions', 'TransactionController');

    Route::get('2fa/check', 'Auth\TwoFactorAuthController@check');
    Route::post('2fa/enable', 'Auth\TwoFactorAuthController@enable');
    Route::post('2fa/disable', 'Auth\TwoFactorAuthController@disable');

    Route::get('contacts', 'ContactController@index');
    Route::post('contacts', 'ContactController@store');
    Route::delete('contacts/{id}', 'ContactController@destroy');

});