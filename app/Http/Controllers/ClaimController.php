<?php

namespace App\Http\Controllers;

use App\Email;
use App\Stellar\Stellar;

class ClaimController extends Controller
{
    public function __invoke(Stellar $stellar)
    {
        $data = request()->validate([
            'token' => 'required|size:32',
        ]);

        $email = Email::whereToken($data['token'])->firstOrFail();
        $email->delete();

        // Remove signer from account
        $creator = $stellar->accountCreator($email->public_key);
        $stellar->addSignerToAccount($creator, $email->secret_key, 0);

        return response([
            'secret' => $email->secret_key,
        ]);
    }
}
