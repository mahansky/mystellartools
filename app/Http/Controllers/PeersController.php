<?php

namespace App\Http\Controllers;

use App\Peer;
use Illuminate\Support\Facades\DB;

class PeersController extends Controller
{
    public function index()
    {
//        return Peer::with('ledger')->where('updated_at', '>', now()->subMinutes(10))->get();
        return Peer::with('ledger')->get();
    }

    public function store()
    {
        $this->middleware('api.token');

        foreach (request()->all() as $peer) {
            Peer::updateOrCreate([
                'public_key' => $peer['id']
            ], [
                'ip'         => $peer['ip'],
                'port'       => $peer['port'],
                'version'    => $peer['ver'],
                'olver'      => $peer['olver'],
                'updated_at' => now(),
            ]);
        }
    }
}
