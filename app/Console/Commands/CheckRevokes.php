<?php

namespace App\Console\Commands;

use App\Address;
use App\Email;
use App\Revoke;
use App\Stellar\Stellar;
use Illuminate\Console\Command;

class CheckRevokes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'interstellar:check-revokes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check revokes';

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
        Revoke::get()->each(function ($revoke) {
            // Was the account created using MyStellar.Tools?
            $email = Email::where('public_key', $revoke->public_key)->first();

            if ( ! $email) {
                return;
            }

            // Does it exist on the network?
            $account = $this->stellar->accountDetails($revoke->public_key);

            if ( ! $account) {
                return;
            }

            // Find signer other than the original
            $signer = collect($account['signers'])->first(function ($signer) use ($account) {
                return $signer['public_key'] !== $account['account_id'];
            });

            if ( ! $signer) {
                return;
            }

            // Look at the latest payment to see if this operation was initiated by account creator
            $payment = collect($this->stellar->payments($revoke->public_key, 'desc'))
                ->first(function ($payment) use ($signer) {
                    return $payment['type'] === 'payment'
                        && $payment['from'] === $signer['public_key'];
                });

            if ( ! $payment) {
                return;
            }

            $response = $this->stellar->mergeAccounts($email->secret_key, $signer['public_key']);

            if (isset($response['hash'])) {
                $revoke->delete();
                $email->delete();

                Address::where('stellar_address', $email->email)->delete();
            }
        });
    }
}
