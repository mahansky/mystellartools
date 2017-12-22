<?php

namespace Tests\Feature\Recovery;

use App\Helpers\Encrypter;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RecoveryTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @var Encrypter
     */
    protected $encrypter;

    protected function setUp()
    {
        parent::setUp();

        $this->encrypter = new Encrypter('MyPassword123');

        $userId = DB::table('users')->insert([
            'email' => 'user@test.com',
            'password' => 'password',
        ]);

        DB::table('accounts')->insert([
            'user_id' => $userId,
            'name' => 'something',
            'public_key' => '123',
            'secret_key' => $this->encrypter->encrypt('ABC'),
        ]);
    }

    /** @test */
    public function it_recovers_the_secret_key()
    {
        $response = $this->post(url('recovery'), [
            'email' => 'user@test.com',
            'password' => 'MyPassword123',
        ]);

        $response->assertSeeText('Secret key: ABC');
    }

    /** @test */
    public function it_does_not_recover_the_secret_key_with_wrong_password()
    {
        $response = $this->post(url('recovery'), [
            'email' => 'user@test.com',
            'password' => 'AnotherPassword',
        ]);

        $response->assertDontSeeText('Secret key: ABC');
    }
}
