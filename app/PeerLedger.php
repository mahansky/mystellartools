<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PeerLedger extends Model
{
    protected $guarded = [];

    protected $casts = [
        'disagree'  => 'array',
        'fail_with' => 'array',
        'missing'   => 'array',
        'quorum'    => 'array',
    ];
}
