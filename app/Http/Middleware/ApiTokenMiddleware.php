<?php

namespace App\Http\Middleware;

use Closure;

class ApiTokenMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($request->header('Bearer', null) !== config('auth.api_token')) {
            return response()->json(['error' => 'invalid api token provided']);
        }

        return $next($request);
    }
}
