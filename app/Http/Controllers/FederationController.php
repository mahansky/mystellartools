<?php

namespace App\Http\Controllers;

use App\Address;
use App\Email;
use App\Stellar\Stellar;
use Illuminate\Support\Facades\Validator;

class FederationController extends Controller
{
    protected $headers = ['Access-Control-Allow-Origin' => '*'];

    /**
     * Search for stellar addresses and the other way around
     *
     * @param Stellar $stellar
     * @return \Illuminate\Http\Response
     */
    public function show(Stellar $stellar)
    {
        $validator = Validator::make(request()->all(), [
            'q'    => 'required',
            'type' => 'required|in:name,id',
        ]);

        if ($validator->fails()) {
            return response([
                'detail' => 'Invalid request'
            ], 400, $this->headers);
        }

        // If this is a name->account_id lookup
        if (request('type') === 'name') {
            $name = request('q');

            // Extract name part from request
            if (strpos($name, '*') !== false) {
                $name = explode('*', $name)[0];
            }

            // Find it in DB
            $address = Address::where('stellar_address', $name)->first();

            // If it doesn't exist and it is an email
            if ( ! $address && filter_var($name, FILTER_VALIDATE_EMAIL)) {
                // Create it
                $keypair = $stellar->generateKeypair();

                $address = Address::create([
                    'account_id'      => $keypair->public_key,
                    'stellar_address' => $name,
                ]);

                Email::create([
                    'email'      => $name,
                    'public_key' => $keypair->public_key,
                    'secret_key' => $keypair->secret_key,
                ]);
            }
        } else {
            $address = Address::where('account_id', request('q'))->first();
        }

        if ( ! $address) {
            return response([
                'detail' => 'Not found.'
            ], 404, $this->headers);
        }

        $response = [
            'stellar_address' => $address->stellar_address . '*' . config('app.domain'),
            'account_id'      => $address->account_id,
        ];

        $response['all'] = Address::where('account_id', $address->account_id)->get()->map(function ($addr) {
            return $addr->stellar_address . '*' . config('app.domain');
        });

        return response($response, 200, $this->headers);
    }

    public function store()
    {
        $data = request()->validate([
            'account_id'      => 'required',
            'stellar_address' => 'required',
        ]);

        $count = Address::where('account_id', request('account_id'))->count();

        if ($count > 2) {
            return response(['detail' => 'Maximum limit of Stellar addresses per account reached.'], 409, $this->headers);
        }

        if (Address::where('stellar_address', request('stellar_address'))->exists()) {
            return response(['detail' => 'Stellar address already taken.'], 409, $this->headers);
        }

        if (! filter_var($data['stellar_address'], FILTER_VALIDATE_EMAIL)) {
            if (! preg_match('/^[\w]+$/', $data['stellar_address'])) {
                return response(['detail' => 'Invalid input'], 400, $this->headers);
            }
        }

        $address = Address::create($data);

        return response([
            'stellar_address' => $address->stellar_address . '*' . config('app.domain'),
            'account_id'      => $address->account_id,
        ], 200, $this->headers);
    }
}
