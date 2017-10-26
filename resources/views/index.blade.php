<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <title>{{ config('app.name') }}</title>
    <meta name="description" content="Stellar Wallet / Account Viewer with a lot of tools">
    <meta name="keywords" content="stellar, wallet, account, viewer, tools, mystellar, token, coin, crypto">

    <link rel="stylesheet" href="{{ mix('css/app.css') }}">
</head>
<body>
<div id="app"></div>

@include('scripts')
</body>
</html>