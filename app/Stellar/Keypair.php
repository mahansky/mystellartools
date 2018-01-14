<?php

namespace App\Stellar;

use ZuluCrypto\StellarSdk\AddressableKey;

// Temporary class
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
        return AddressableKey::getRawBytesFromBase32AccountId($this->tempPublicKey);
    }
}