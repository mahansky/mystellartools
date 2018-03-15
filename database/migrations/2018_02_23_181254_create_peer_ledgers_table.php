<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePeerLedgersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('peer_ledgers', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('peer_id');
            $table->unsignedInteger('ledger');
            $table->string('hash')->nullable();
            $table->string('phase');
            $table->unsignedInteger('agree')->nullable();
            $table->json('disagree')->nullable();
            $table->unsignedInteger('fail_at')->nullable();
            $table->json('fail_with')->nullable();
            $table->json('missing')->nullable();
            $table->json('quorum')->nullable();
            $table->timestamps();

            $table->foreign('peer_id')->references('id')->on('peers');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('peer_ledgers');
    }
}
