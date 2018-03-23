<?php

namespace App\Http\Controllers;

use App\Peer;
use Illuminate\Support\Facades\DB;

class PeersController extends Controller
{
    public function index()
    {
        return Peer::with('ledger')->where('updated_at', '>', now()->subMinutes(10))->get();
    }

    public function store()
    {
        $this->middleware('api.token');

        foreach (request()->all() as $peer) {
            [$ip, $port] = explode(':', $peer['address']);

            Peer::updateOrCreate([
                'public_key' => $peer['id']
            ], [
                'ip'         => $ip,
                'port'       => $port,
                'version'    => $peer['ver'],
                'olver'      => $peer['olver'],
                'updated_at' => now(),
            ]);
        }
    }
}
