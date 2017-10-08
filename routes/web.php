<?php

Route::get('{path}', function () {
    $routes = collect(Route::getRoutes()->getRoutesByName())->map(function ($route) {
        return $route->uri;
    });

    return view('index', compact('routes'));
})->where('path', '(.*)');
