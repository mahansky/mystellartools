<?php

namespace App\Http\Controllers;

use App\Helpers\Encrypter;
use App\Http\Resources\Accounts;
use Illuminate\Support\Facades\Cache;

class AccountController extends Controller
{
    public function index()
    {
        return Accounts::collection(auth()->user()->accounts);
    }

    public function store()
    {
        $data = request()->validate([
            'name'       => 'required',
            'public_key' => 'required',
            'secret_key' => 'nullable',
            'password'   => 'required_with:secret_key|min:6',
        ]);

        if (auth()->user()->accounts()->where('public_key', $data['public_key'])->exists()) {
            return response()->json(['message' => 'Already exists'], 400);
        }

        if (isset($data['secret_key'])) {
            $encrypter = new Encrypter($data['password']);
            $data['secret_key'] = $encrypter->encrypt($data['secret_key']);
        }

        unset($data['password']);

        auth()->user()->accounts()->create($data);

        return Accounts::collection(auth()->user()->accounts);
    }

    public function destroy()
    {
        request()->validate([
            'public_key' => 'required',
        ]);

        auth()->user()->accounts()->where('public_key', request('public_key'))->delete();

        return Accounts::collection(auth()->user()->accounts);
    }

    public function unlock()
    {
        request()->validate([
            'public_key' => 'required',
            'password'   => 'required',
        ]);

        $account = auth()->user()->accounts()->where('public_key', request('public_key'))->first();
        $encrypter = new Encrypter(request('password'));
        $isOk = false;

        try {
            $encrypter->decrypt($account->secret_key);
            $isOk = true;
        } catch (\Exception $exception) {
        }

        if ($isOk) {
            Cache::put('account-' . $account->id, encrypt(request('password')), 30);
        }

        return response()->json([
            'message' => $isOk ? 'Password ok' : 'Invalid password',
        ], $isOk ? 200 : 400);
    }
}
