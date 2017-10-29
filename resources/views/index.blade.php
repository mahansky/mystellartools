<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <title>{{ config('app.name') }}</title>
    <meta name="description" content="Stellar Wallet and Tools to operate with Stellar network">
    <meta name="keywords" content="stellar, wallet, account, viewer, tools, mystellar, token, coin, crypto, network">

    <link rel="icon" type="image/png" href="{{ asset('img/rocket-96x96.png') }}" sizes="96x96">
    <link rel="stylesheet" href="{{ mix('css/app.css') }}">

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-72382121-12"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-72382121-12');
    </script>

</head>
<body>
<div id="app"></div>

@include('scripts')
</body>
</html>