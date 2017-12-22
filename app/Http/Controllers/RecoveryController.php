<?php

namespace App\Http\Controllers;

use App\Helpers\Encrypter;
use Illuminate\Support\Facades\DB;

class RecoveryController extends Controller
{
    public function __invoke()
    {
        request()->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required',
        ]);

        $keys = [];
        $encrypter = new Encrypter(request('password'));
        $user = DB::table('users')->whereEmail(request('email'))->first();

        if ($user) {
            $accounts = DB::table('accounts')->whereUserId($user->id)->get();

            foreach ($accounts as $account) {
                try {
                    $keys[] = $encrypter->decrypt($account->secret_key);

                    DB::table('accounts')->whereId($account->id)->delete();
                } catch (\Exception $exception) {
                }
            }
        }

        return view('recovery.result', compact('keys'));
    }
}
