<?php

namespace App\Http\Controllers;

use App\Peer;
use App\PeerLedger;

class PeerLedgersController extends Controller
{
    public function store($publicKey)
    {
        $this->middleware('api.token');

        $peer = Peer::wherePublicKey($publicKey)->firstOrFail();

        foreach (request()->all() as $ledger => $data) {
            PeerLedger::updateOrCreate([
                'peer_id' => $peer->id,
                'ledger'  => $ledger,
            ], [
                'phase'     => $data['phase'],
                'hash'      => $data['hash'] ?? null,
                'agree'     => $data['agree'] ?? null,
                'disagree'  => $data['disagree'] ?? null,
                'fail_at'   => $data['fail_at'] ?? null,
                'fail_with' => $data['fail_with'] ?? null,
                'missing'   => $data['missing'] ?? null,
                'quorum'    => $data['value'] ?? null,
            ]);
        }

        $ledgers = $peer->ledgers()->limit(10)->orderBy('ledger', 'desc')->get();

        if ($ledgers->count() === 10) {
            $peer->ledgers()->where('ledger', '<', $ledgers->last()->ledger)->delete();
        }
    }
}
