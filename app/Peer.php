<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Peer extends Model
{
    protected $guarded = [];

    public function ledgers()
    {
        return $this->hasMany(PeerLedger::class)->orderByDesc('ledger');
    }
}
