<?php


Route::group([
    'namespace' => 'Solarcms\Core\TableProperties\Controllers',
    'prefix' =>'solar/tp',
    'as' => 'Solar.TableProperties::'], function() {


    Route::get('/{slug}/', 'TablePropertiesController@TableProperties');
    Route::post('/{slug}/{action}', 'TablePropertiesController@TableProperties');




});