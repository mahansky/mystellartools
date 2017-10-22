<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\User;
use GuzzleHttp\Client;

class AuthController extends Controller
{
    /**
     * @var Client
     */
    private $http;

    public function __construct(Client $http)
    {
        $this->http = $http;
    }

    public function login()
    {
        $data = request()->validate([
            'email'    => 'required',
            'password' => 'required',
        ]);

        $response = $this->oAuthLogin($data);

        if ($response['success']) {
            $user = User::whereEmail($data['email'])->first();

            return response()->json(['user' => $user] + $response, 200);
        }

        return response()->json($response, 400);
    }

    public function refresh()
    {
        $data = request()->validate([
            'refresh_token' => 'required',
        ]);

        $response = $this->oAuthRefreshToken($data);

        return response()->json($response, $response['success'] ? 200 : 400);
    }

    public function register()
    {
        $data = request()->validate([
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        $user = User::create($data);

        $response = $this->oAuthLogin($data);

        return response()->json(['user' => $user] + $response, $response['success'] ? 200 : 400);
    }

    private function oAuthLogin($data)
    {
        try {
            $response = $this->http->post(config('app.url') . '/oauth/token', [
                'form_params' => [
                    'grant_type'    => 'password',
                    'client_id'     => config('auth.client_id'),
                    'client_secret' => config('auth.client_secret'),
                    'username'      => $data['email'],
                    'password'      => $data['password'],
                ]
            ]);
        } catch (\Exception $exception) {
            return [
                'success' => false,
                'message' => 'Invalid credentials',
                'errors'  => [
                    'email' => [
                        'Invalid credentials',
                    ],
                ],
            ];
        }

        return json_decode((string)$response->getBody(), true) + ['success' => true];
    }

    private function oAuthRefreshToken($data)
    {
        try {
            $response = $this->http->post(config('app.url') . '/oauth/token', [
                'form_params' => [
                    'grant_type'    => 'refresh_token',
                    'refresh_token' => $data['refresh_token'],
                    'client_id'     => config('auth.client_id'),
                    'client_secret' => config('auth.client_secret'),
                ]
            ]);
        } catch (\Exception $exception) {
            return [
                'success' => false,
                'message' => 'Invalid token',
                'errors'  => [
                    'refresh_token' => [
                        'Invalid token',
                    ],
                ],
            ];
        }

        return json_decode((string)$response->getBody(), true) + ['success' => true];
    }
}
