<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\Resource;

class Accounts extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'name'       => $this->name,
            'public_key' => $this->public_key,
            'sss'        => !! $this->secret_key,
        ];
    }
}
