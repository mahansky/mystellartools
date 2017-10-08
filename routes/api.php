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

Route::get('qrcode', 'QRCodeController');

Route::get('federation', 'FederationController@show')->name('federation');
Route::post('federation', 'FederationController@store')->name('federation.store');
