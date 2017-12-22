<?php

Route::view('recovery', 'recovery.index');
Route::post('recovery', 'RecoveryController')->middleware('throttle:10,1');

Route::view('{path}', 'index')->where('path', '(.*)');
