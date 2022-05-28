<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
        // https://qiita.com/ghibi/items/cb4faa2d86f5866cbfd4
        if (\App::environment(['production'])) {
            \URL::forceScheme('https');
        }
    }
}
