<?php

namespace App\Stellar;

class Constants
{
    const MEMO_ID = 'id';
    const MEMO_TEXT = 'text';
    const MEMO_HASH = 'hash';
    const MEMO_RETURN = 'return';
    
    public static function memoTypes()
    {
        return [
            self::MEMO_ID,
            self::MEMO_TEXT,
            self::MEMO_HASH,
            self::MEMO_RETURN,
        ];
    }
}