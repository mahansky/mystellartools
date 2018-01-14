<?php

namespace App\Console\Commands;

use App\Email;
use App\Notifications\ClaimLumensEmail;
use App\Stellar\Stellar;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class StellarEmailCheck extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'interstellar:check-emails';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Checks new accounts';

    /**
     * @var Stellar
     */
    protected $stellar;

    /**
     * Create a new command instance.
     *
     * @param Stellar $stellar
     */
    public function __construct(Stellar $stellar)
    {
        parent::__construct();

        $this->stellar = $stellar;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        Email::whereNull('token')->get()->each(function ($email) {
            $account = $this->stellar->accountDetails($email->public_key);

            if ($account !== null) {
                // Find account creator
                $creator = $this->stellar->accountCreator($email->public_key);

                // Set him as signer
                $response = $this->stellar->addSignerToAccount($creator, $email->secret_key);

                if ( ! isset($response['hash'])) {
                    // TODO: Do something about it
                    return;
                }

                // Generate token
                $email->update([
                    'token' => str_random(32),
                ]);

                // Send email to owner
                Notification::route('mail', $email->email)->notify(new ClaimLumensEmail($email->token));
            }
        });
    }
}
