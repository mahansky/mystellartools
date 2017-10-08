<?php

namespace App\Http\Controllers;

use App\Address;
use Illuminate\Support\Facades\Validator;

class FederationController extends Controller
{
    /**
     * Search for stellar addresses and the other way around
     *
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        $validator = Validator::make(request()->all(), [
            'q'    => 'required',
            'type' => 'required|in:name,id',
        ]);

        if ($validator->fails()) {
            return response([
                'detail' => 'Invalid request'
            ], 400);
        }

        if (request('type') === 'name') {
            $name = request('q');

            if (strpos($name, '*') !== false) {
                $name = explode('*', $name)[0];
            }

            $address = Address::where('stellar_address', $name)->first();
        } else {
            $address = Address::where('account_id', request('q'))->first();
        }

        if ( ! $address) {
            return response([
                'detail' => 'Not found'
            ], 404);
        }

        return response([
            'stellar_address' => $address->stellar_address . '*' . parse_url(config('APP_URL'), PHP_URL_HOST),
            'account_id'      => $address->account_id,
        ], 200);
    }

    public function store()
    {
        $data = request()->validate([
            'account_id' => 'required',
            'stellar_address' => 'required',
        ]);

        if (Address::where('account_id', request('account_id'))->exists()) {
            return response(['detail' => 'Account already has an adress.'], 409);
        }

        if (Address::where('stellar_address', request('stellar_address'))->exists()) {
            return response(['detail' => 'Stellar address already taken.'], 409);
        }

        $address = Address::create($data);

        return response([
            'stellar_address' => $address->stellar_address . '*' . parse_url(config('APP_URL'), PHP_URL_HOST),
            'account_id'      => $address->account_id,
        ], 200);
    }
}
