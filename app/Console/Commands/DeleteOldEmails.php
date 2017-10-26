<?php

namespace App\Console\Commands;

use App\Email;
use Illuminate\Console\Command;

class DeleteOldEmails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'interstellar:delete-emails';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deletes old emails';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        // Soft delete non-claimed
        Email::where('created_at', '<=', now()->subDay())
            ->whereNull('token')
            ->delete();

        // Permanently delete claimed
        Email::where('created_at', '<=', now()->subWeek())
            ->onlyTrashed()
            ->forceDelete();
    }
}
