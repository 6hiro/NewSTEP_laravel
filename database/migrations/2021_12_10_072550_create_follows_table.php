<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFollowsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('follows', function (Blueprint $table) {
            $table->id();
            // $table->uuid('id')->primary();
            // $table->bigInteger('follower_id');
            // $table->foreign('follower_id')
            //     ->references('id')
            //     ->on('users')
            //     ->onDelete('cascade');
            // Foreign key.
            $table->uuid('follower_id');
            $table->foreign('follower_id')->references('id')->on('users')->onDelete('cascade');
            
            // $table->bigInteger('followee_id');
            // $table->foreign('followee_id')
            //     ->references('id')
            //     ->on('users')
            //     ->onDelete('cascade');
            // Foreign key.
            $table->uuid('followee_id');
            $table->foreign('followee_id')->references('id')->on('users')->onDelete('cascade');

            // $table->timestamps();
            $table->timestamps(6);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('follows');
    }
}
