<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            // $table->id();
            $table->uuid('id')->primary();
            $table->text('content')->nullable();
            $table->uuid('parent_id')->nullable();
            // $table->foreign('parent_id')->references('id')
            //       ->on('posts')->onUpdate('cascade')->onDelete('SET NULL');
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            // $table->timestamps();
            $table->timestamps(6);
        });

        Schema::table('posts', function (Blueprint $table) 
        {
            $table->foreign('parent_id')->references('id')
                ->on('posts')->onUpdate('cascade')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('posts');
    }
}
