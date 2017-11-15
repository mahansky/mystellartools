<?php

namespace App\Http\Controllers;

use App\Revoke;

class RevokeController extends Controller
{
    public function __invoke()
    {
        $data = request()->validate([
            'public_key' => 'required|exists:emails,public_key',
        ]);

        Revoke::updateOrCreate($data, $data);

        return response(['message' => 'Success. It might take a minute to complete.']);
    }
}
