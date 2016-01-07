<?php

namespace Solarcms\TableProperties;

use Illuminate\Support\ServiceProvider as ServiceProvider;

class TablePropertiesServiceProvider extends ServiceProvider
{


    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {

        // Route
        include __DIR__ . DIRECTORY_SEPARATOR .'routes.php';


        // For publishing configuration file
        $this->publishes([
            __DIR__ . '/Config/tableproperties.php' => config_path('solar_tableproperties.php'),
        ], 'tableproperties_config');

        // For publishing assets
        $this->publishes([
            __DIR__ . DIRECTORY_SEPARATOR . 'Assets'. DIRECTORY_SEPARATOR . 'dist' => public_path('shared/table-properties'),
        ], 'shared');
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {

        $this->mergeConfigFrom(__DIR__ . '/Config/tableproperties.php', 'TableProperties');

        // View
        $this->loadViewsFrom(__DIR__ . DIRECTORY_SEPARATOR .'Views', 'TableProperties');

        $this->app['TableProperties'] = $this->app->share(function ($app) {
            return new TableProperties;
        });
    }
}