<?php

namespace App\Stellar;

// Temporary class
use ZuluCrypto\StellarSdk\AddressableKey;

class Keypair extends \ZuluCrypto\StellarSdk\Keypair
{
    protected $tempPublicKey;

    public static function newFromRandom()
    {
        return new Keypair(AddressableKey::seedFromRawBytes(random_bytes(32)));
    }

    public function getTempPublicKey()
    {
        return $this->tempPublicKey;
    }

    public function setTempPublicKey($tempPublicKey)
    {
        $this->tempPublicKey = $tempPublicKey;
    }

    public function getPublicKeyBytes()
    {
        return $this->tempPublicKey;
    }
}