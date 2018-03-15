<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <title>Secure and easy to use Stellar Wallet - MyStellar.Tools</title>
    <meta name="description" content="MyStellar.Tools is a universal tool and wallet that gives users a one-stop web-based application to take advantage of all the features the Stellar network has to offer.">
    <meta name="keywords" content="stellar, wallet, account, viewer, tools, mystellar, token, coin, crypto, network, blockchain, explorer">

    <link rel="icon" type="image/png" href="{{ asset('img/rocket-96x96.png') }}" sizes="96x96">
    <link rel="stylesheet" href="{{ mix('css/app.css') }}">
</head>
<body>
<div id="app"></div>

@include('scripts')
</body>
</html>