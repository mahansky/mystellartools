<?php

/*
| --------------------------------------------------------------------------
| Public routes
| --------------------------------------------------------------------------
*/

Route::group(['middleware' => 'throttle:60,1'], function () {
    Route::get('federation', 'FederationController@show')->name('federation');
    Route::post('federation', 'FederationController@store')->name('federation.store');

    Route::get('prices', 'PriceController')->name('prices');

    Route::get('claim', 'ClaimController')->middleware('throttle:10,1');
    Route::post('revoke', 'RevokeController')->middleware('throttle:10,1');

    Route::get('peers', 'PeersController@index');
    Route::get('peers/{public_key}', 'PeerLedgersController@index');
});

Route::group(['middleware' => 'throttle:500,1'], function () {
    Route::post('peers', 'PeersController@store');
    Route::post('peers/{public_key}', 'PeerLedgersController@store');
});
