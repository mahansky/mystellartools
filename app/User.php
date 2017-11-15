<?php

namespace App;

use App\Notifications\PasswordResetEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use Notifiable, HasApiTokens;

    protected $guarded = [];

    protected $hidden = [
        'password',
        'remember_token',
        'google2fa',
    ];

    public function accounts()
    {
        return $this->hasMany(Account::class);
    }

    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new PasswordResetEmail($token));
    }
}
