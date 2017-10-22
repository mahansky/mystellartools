<?php

namespace App\Helpers;

class Encrypter
{
    protected $encrypter;

    public function __construct($password)
    {
        $key = str_pad(substr($password, 0, 32), 32, '-');

        $this->encrypter = new \Illuminate\Encryption\Encrypter($key, 'AES-256-CBC');
    }

    public function encrypt($value)
    {
        return $this->encrypter->encryptString($value);
    }

    public function decrypt($value)
    {
        return $this->encrypter->decryptString($value);
    }
}