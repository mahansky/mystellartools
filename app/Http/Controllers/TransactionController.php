<?php

namespace App\Http\Controllers;

use App\Helpers\Encrypter;
use App\Stellar\Stellar;
use Illuminate\Support\Facades\Cache;

class TransactionController extends Controller
{
    public function __invoke(Stellar $stellar)
    {
        $data = request()->validate([
            'action' => 'required',
            'public_key' => 'required',
            'data' => 'required',
        ]);

        $account = auth()->user()->accounts()
            ->where('public_key', $data['public_key'])
            ->firstOrFail();

        $cachedKey = Cache::get('account-' . $account->id, null);

        if (! $cachedKey) {
            return response([
                'message' => 'Account not unlocked',
            ], 403);
        }

        $encrypter = new Encrypter(decrypt($cachedKey));
        $secret = $encrypter->decrypt($account->secret_key);

        $response = $stellar->submit($secret, $data['action'], $data['data']);

        return response()->json(
            $response,
            isset($response['tx_success']) && $response['tx_success'] ? 200 : 400
        );
    }
}
