<?php

namespace App\Console\Commands;

use App\Price;
use GuzzleHttp\Client;
use Illuminate\Console\Command;

class PriceTicker extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'interstellar:fetch-prices';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch prices';

    /**
     * @var Client
     */
    protected $client;

    protected $currencies = [
        'EUR',
        'GBP',
    ];

    /**
     * Create a new command instance.
     *
     * @param Client $client
     */
    public function __construct(Client $client)
    {
        parent::__construct();

        $this->client = $client;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        foreach ($this->currencies as $currency) {
            $response = $this->client->get('https://api.coinmarketcap.com/v1/ticker/stellar/?convert=' . $currency);
            $data = json_decode((string)$response->getBody(), true)[0];

            $otherPrice[strtolower($currency)] = $data['price_' . strtolower($currency)];

            Price::updateOrCreate([], [
                'btc' => $data['price_btc'],
                'usd' => $data['price_usd'],
            ] + $otherPrice);
        }
    }
}
