<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Email extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    protected $dates = [
        'deleted_at',
    ];

    public function setSecretKeyAttribute($value)
    {
        return $this->attributes['secret_key'] = encrypt($value);
    }

    public function getSecretKeyAttribute()
    {
        return decrypt($this->attributes['secret_key']);
    }
}
