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
        Schema::create('steps', function (Blueprint $table) {
            // $table->id();
            $table->uuid('id')->primary();
            $table->text('content');
            $table->text('memo')->nullable();
            $table->string('state', '20');
            $table->integer('order');
            // Foreign key.
            $table->uuid('roadmap_id');
            $table->foreign('roadmap_id')->references('id')->on('roadmaps')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('steps');
    }
};
