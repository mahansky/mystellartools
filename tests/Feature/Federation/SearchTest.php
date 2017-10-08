<?php

namespace Tests\Feature\Federation;

use App\Address;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SearchTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function normal_search()
    {
        $address = Address::create([
            'account_id'      => 'abcdefgh',
            'stellar_address' => 'test'
        ]);

        $this->get(route('federation', ['q' => 'test', 'type' => 'name']))
            ->assertStatus(200)
            ->assertJsonFragment([
                'account_id'      => $address->account_id,
                'stellar_address' => $address->stellar_address . '*' . parse_url(config('APP_URL'), PHP_URL_HOST),
            ]);
    }

    /** @test */
    public function non_existing_account_returns_404()
    {
        Address::create([
            'account_id'      => 'abcdefgh',
            'stellar_address' => 'test'
        ]);

        $this->get(route('federation', ['q' => 'testing', 'type' => 'name']))
            ->assertStatus(404);
    }

    /** @test */
    public function reverse_search()
    {
        $address = Address::create([
            'account_id'      => 'abcdefgh',
            'stellar_address' => 'test'
        ]);

        $this->get(route('federation', ['q' => 'abcdefgh', 'type' => 'id']))
            ->assertStatus(200)
            ->assertJsonFragment([
                'account_id'      => $address->account_id,
                'stellar_address' => $address->stellar_address . '*' . parse_url(config('APP_URL'), PHP_URL_HOST),
            ]);
    }
}
