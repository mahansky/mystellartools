<?php

namespace App\Http\Controllers;

use App\Peer;

class PeersController extends Controller
{
    public function store()
    {
        $this->middleware('api.token');

        foreach (request()->all() as $peer) {
            Peer::updateOrCreate([
                'public_key' => $peer['id']
            ], [
                'ip'      => $peer['ip'],
                'port'    => $peer['port'],
                'version' => $peer['ver'],
                'olver'   => $peer['olver'],
            ]);
        }
    }
}
