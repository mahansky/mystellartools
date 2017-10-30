<?php

namespace App\Stellar;

use GuzzleHttp\Client;

class Stellar
{
    const HORIZON = 'https://horizon.stellar.org';

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
        try {
            $response = $this->http->get(implode('', [
                self::HORIZON,
                '/accounts/',
                $publicKey,
            ]));

            return json_decode((string)$response->getBody(), true);
        } catch (\Exception $exception) {
            return null;
        }
    }

    /**
     * Returns public key of the account's creator
     *
     * @param $publicKey
     */
    public function accountCreator($publicKey)
    {
        $response = $this->http->get(implode('', [
            self::HORIZON,
            '/accounts',
            "/{$publicKey}",
            '/payments',
        ]));

        $data = json_decode((string)$response->getBody(), true);
        $firstPayment = $data['_embedded']['records'][0];

        return $firstPayment['source_account'];
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
}