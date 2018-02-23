<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Peer extends Model
{
    protected $guarded = [];

    public function ledger()
    {
        return $this->hasOne(PeerLedger::class)->orderByDesc('ledger');
    }

    public function ledgers()
    {
        return $this->hasMany(PeerLedger::class)->orderByDesc('ledger');
    }
}
