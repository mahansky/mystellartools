<?php

namespace App\Stellar;

use GuzzleHttp\Client;
use ZuluCrypto\StellarSdk\Horizon\ApiClient;
use ZuluCrypto\StellarSdk\Keypair;
use ZuluCrypto\StellarSdk\Server;
use ZuluCrypto\StellarSdk\XdrModel\Operation\AccountMergeOp;
use ZuluCrypto\StellarSdk\XdrModel\Operation\SetOptionsOp;
use ZuluCrypto\StellarSdk\XdrModel\Signer;
use ZuluCrypto\StellarSdk\XdrModel\SignerKey;

class Stellar
{
    /**
     * @var Client
     */
    protected $http;

    /**
     * @var string
     */
    protected $horizonUrl;

    /**
     * @var Server
     */
    protected $horizon;

    public function __construct(Client $http)
    {
        $this->http = $http;
        $this->horizonUrl = config('stellar.horizon_url');
        $this->horizon = new Server(new ApiClient($this->horizonUrl, ApiClient::NETWORK_PASSPHRASE_PUBLIC));
    }

    /**
     * Generates new Keypair
     *
     * @return object with public_key and secret_key
     */
    public function generateKeypair()
    {
        $keypair = Keypair::newFromRandom();

        return (object) [
            'public_key' => $keypair->getPublicKey(),
            'secret_key' => $keypair->getSecret(),
        ];
    }

    /**
     * Gets account data from Horizon
     *
     * @param $publicKey
     * @return mixed|null
     */
    public function accountDetails($publicKey)
    {
        return $this->getJSON(implode('', [
            $this->horizonUrl,
            '/accounts',
            "/{$publicKey}",
        ]));
    }

    /**
     * Returns public key of the account's creator
     *
     * @param $publicKey
     * @return string
     */
    public function accountCreator($publicKey)
    {
        $data = $this->payments($publicKey);

        $firstPayment = $data[0];

        return $firstPayment['source_account'];
    }

    /**
     * @param $publicKey
     * @param string $order
     * @param int $limit
     * @return mixed
     */
    public function payments($publicKey, $order = 'asc', $limit = 10)
    {
        return $this->getJSON(implode('', [
            $this->horizonUrl,
            '/accounts',
            "/{$publicKey}",
            '/payments',
            "?order={$order}",
            "&limit={$limit}",
        ]))['_embedded']['records'];
    }

    /**
     * Adds signer to Stellar account
     *
     * @param string $signer public key of new signer
     * @param string $secretKey secret key of account
     * @param int $weight
     * @return mixed
     */
    public function addSignerToAccount($signer, $secretKey, $weight = 1)
    {
        $signerKeypair = \App\Stellar\Keypair::newFromRandom();
        $signerKeypair->setTempPublicKey($signer);

        $keypair = Keypair::newFromSeed($secretKey);

        $setOptions = new SetOptionsOp();
        $setOptions->updateSigner(new Signer(SignerKey::fromKeypair($signerKeypair), $weight));

        return $this->horizon->buildTransaction($keypair)
            ->addOperation($setOptions)
            ->submit($secretKey)
            ->getRawData();
    }

    /**
     * @param $secretKey
     * @param $destination
     * @return mixed
     */
    public function mergeAccounts($secretKey, $destination)
    {
        return $this->horizon->buildTransaction(Keypair::newFromSeed($secretKey))
            ->addMergeOperation($destination)
            ->submit($secretKey)
            ->getRawData();
    }

    /**
     * @param $url
     * @return mixed|null
     */
    private function getJSON($url)
    {
        try {
            $response = $this->http->get($url);

            return json_decode((string)$response->getBody(), true);
        } catch (\Exception $exception) {
            return null;
        }
    }
}