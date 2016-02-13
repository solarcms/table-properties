<?php
namespace Solarcms\Core\TableProperties\Facade;

use Illuminate\Support\Facades\Facade as Facade;

class TableProperties extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'TableProperties';
    }
}