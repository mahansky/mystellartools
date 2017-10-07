<?php

namespace App\Http\Controllers;

use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QRCodeController extends Controller
{
    function __invoke()
    {
        request()->validate([
            'text' => 'required'
        ]);

        return [
            'qrcode' => base64_encode(
                QrCode::format('png')
                    ->size(200)
                    ->margin(1)
                    ->generate(request('text'))
            ),
        ];
    }
}
