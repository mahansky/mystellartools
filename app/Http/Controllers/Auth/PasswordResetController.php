<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class PasswordResetController extends Controller
{
    public function send()
    {
        request()->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $response = Password::broker()->sendResetLink(request()->only('email'));

        if ($response !== Password::RESET_LINK_SENT) {
            return response(['message' => $response], 400);
        }

        return response(['message' => 'Email with instructions sent.']);
    }

    public function reset()
    {
        request()->validate([
            'email'    => 'required|email',
            'password' => 'required|min:6|confirmed',
            'token'    => 'required',
        ]);

        $response = Password::broker()->reset(
            $this->credentials(request()),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        if ($response !== Password::PASSWORD_RESET) {
            return response(['message' => 'Invalid token.'], 400);
        }

        return response(['message' => 'Email with instructions sent.']);
    }

    private function credentials($request)
    {
        return $request->only(
            'email', 'password', 'password_confirmation', 'token'
        );
    }
}
