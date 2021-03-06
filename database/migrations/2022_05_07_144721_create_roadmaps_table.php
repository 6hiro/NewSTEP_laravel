<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('roadmaps', function (Blueprint $table) {
            // $table->id();
            $table->uuid('id')->primary();
            $table->string('title', '60');
            $table->text('overview')->nullable();
            $table->boolean('is_public')->default(true);
            // Foreign key.
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
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
        Schema::dropIfExists('roadmaps');
    }
};
