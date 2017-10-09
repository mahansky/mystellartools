<?php

namespace App\Http\Controllers;

use App\Price;

class PriceController extends Controller
{
    function __invoke()
    {
        $prices = Price::first() ?? new Price;

        return [
            'prices' => [
                'btc' => $prices->btc ?? '0',
                'usd' => $prices->usd ?? '0',
                'eur' => $prices->eur ?? '0',
                'gbp' => $prices->gbp ?? '0',
            ],
        ];
    }
}
