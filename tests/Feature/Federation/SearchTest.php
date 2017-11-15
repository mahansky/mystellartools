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
                'stellar_address' => $this->fullAddress($address->stellar_address),
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
                'stellar_address' => $this->fullAddress($address->stellar_address),
            ]);
    }

    /** @test */
    public function it_has_all_results()
    {
        $address1 = Address::create([
            'account_id'      => 'x',
            'stellar_address' => 'a',
        ]);

        $address2 = Address::create([
            'account_id'      => 'x',
            'stellar_address' => 'b',
        ]);

        $this->get(route('federation', ['q' => 'x', 'type' => 'id']))
            ->assertStatus(200)
            ->assertJsonFragment([
                'account_id'      => $address1->account_id,
                'all'             => [
                    $this->fullAddress($address1->stellar_address),
                    $this->fullAddress($address2->stellar_address),
                ],
            ]);
    }

    private function fullAddress($name)
    {
        return $name . '*' . parse_url(config('app.url'), PHP_URL_HOST);
    }
}
