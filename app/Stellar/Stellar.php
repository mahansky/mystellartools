<?php

namespace App\Stellar;

use GuzzleHttp\Client;

class Stellar
{
    const HORIZON = 'https://mystellar.tools:8000';

    /**
     * @var Client
     */
    protected $http;

    /**
     * @var string
     */
    protected $exec;

    public function __construct(Client $http)
    {
        $this->http = $http;
        $this->exec = config('stellar.node_path') . ' ' . config('stellar.stellar_path');
    }

    /**
     * Generates new Keypair
     *
     * @return object with public_key and secret_key
     */
    public function generateKeypair()
    {
        $data = shell_exec(implode(' ', [
            $this->exec,
            'generate',
        ]));

        return json_decode($data);
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
            self::HORIZON,
            '/accounts/',
            $publicKey,
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
            self::HORIZON,
            '/accounts',
            "/{$publicKey}",
            '/payments',
            "?order={$order}",
            "&limit={$limit}"
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
        return $this->submit($secretKey, 'addSigner', [
            'signer' => $signer,
            'weight' => $weight,
        ]);
    }

    /**
     * @param $secretKey
     * @param $destination
     * @return mixed
     */
    public function mergeAccounts($secretKey, $destination)
    {
        return $this->submit($secretKey, 'mergeAccounts', [
            'destination' => $destination,
        ]);
    }

    /**
     * Submits transaction using node process and returns the output
     *
     * @param $secretKey
     * @param $action
     * @param $data
     * @return mixed
     */
    public function submit($secretKey, $action, $data)
    {
        $command = implode(' ', [
            $this->exec,
            escapeshellarg(json_encode([
                'action' => $action,
                'secret' => $secretKey,
                'data'   => $data,
            ])),
            '2>&1',
        ]);

        $response = trim(shell_exec($command));

        return json_decode($response, true);
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