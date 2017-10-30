@component('mail::message')
# You have received Stellar Lumens (XLM)

Somebody sent you Stellar Lumens (XLM) using MyStellar.Tools.

@component('mail::button', ['url' => url('/claim', ['token' => $token])])
Get My Lumens
@endcomponent
@endcomponent
