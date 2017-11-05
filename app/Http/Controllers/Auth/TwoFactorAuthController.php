<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;

class TwoFactorAuthController extends Controller
{
    public function check()
    {
        $user = auth()->user();

        if ($user->google2fa) {
            return response(['enabled' => true]);
        }

        $secret = app('2FA')->generateSecretKey();
        $imageUrl = app('2FA')->getQRCodeGoogleUrl('MyStellar.Tools', $user->email, $secret);

        Cache::put('2fa-' . auth()->id(), encrypt($secret), now()->addMinutes(10));

        return response([
            'enabled' => false,
            'image_url' => $imageUrl,
        ]);
    }

    public function enable()
    {
        request()->validate([
            'secret' => 'required|digits:6',
        ]);

        $storedSecret = Cache::get('2fa-' . auth()->id());

        if (! $storedSecret) {
            return response(['message' => 'Timeout. Start again.'], 400);
        }

        if (! app('2FA')->verifyKey(auth()->user()->google2fa, request('secret'))) {
            return response(['message' => 'Invalid secret.'], 400);
        }

        auth()->user()->update([
           'google2fa' => decrypt($storedSecret),
        ]);

        return response(['message' => '2FA Enabled.'], 200);
    }

    public function disable()
    {
        auth()->user()->update([
            'google2fa' => null,
        ]);

        return response(['message' => '2FA Disabled.']);
    }
}
