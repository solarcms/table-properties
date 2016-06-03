<?php

namespace Solarcms\Core\TableProperties;

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


        // For publishing configuration file
        $this->publishes([
            __DIR__ . '/Config/tableproperties.php' => config_path('tp_config.php'),
        ], 'tp-config');

        // For publishing assets
        $this->publishes([
            __DIR__ . DIRECTORY_SEPARATOR . 'Assets'. DIRECTORY_SEPARATOR . 'dist' => public_path('shared/table-properties'),
            __DIR__ . DIRECTORY_SEPARATOR . 'Assets'. DIRECTORY_SEPARATOR . 'src'. DIRECTORY_SEPARATOR . 'vendor'. DIRECTORY_SEPARATOR . 'handsontable' => public_path('shared/table-properties/handsontable'),
        ], 'tp');
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