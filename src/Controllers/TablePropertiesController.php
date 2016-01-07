<?php

namespace Solarcms\Core\TableProperties\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Solarcms\TableProperties\TableProperties;
use Request;
use Solarcms\Core\TableProperties\Tp\Tp;
class TablePropertiesController extends Controller {

    public function __construct(){

    }
    public function index() {
        $tp = new Tp();

        $tp->table = 'acticle_category';
        $tp->page_name = 'Мэдээ бүлэг';

        $tp->identity_name = 'id';


        return $tp->run();

    }

    public function todo() {
        $test = [
            ["text"=> "hello world1", 'completed'=> false],
            ["text"=> "hello world2", 'completed'=> true],
            ["text"=> "hello world3", 'completed'=> false],

        ];


        return $test;
    }


    public function TableProperties($slug, $action = 'index') {

        switch($slug){
            case "acticle_category":          return $this->acticle_category($action);        break;
            case "article":          return $this->article($action);        break;
            case "locales":          return $this->locales($action);        break;
            default:              return $this->acticle_category($action);
        }



    }
    public function acticle_category ($action){

        $tp = new Tp();
        $tp->table = 'acticle_category';
        $tp->page_name = 'Мэдээ бүлэг';
        $tp->identity_name = 'id';
        $tp->grid_columns = ['active', 'name', 'id'];
        $tp->grid_default_order_by = 'id DESC';
        $tp->formType = 'inline';

        $tp->form_input_control = [
            ['column'=>'active', 'title'=>'Идвэхтэй', 'type'=>'--checkbox', 'value'=>0, 'validate'=> ''],
            ['column'=>'name', 'title'=>'Нэр', 'type'=>'--text', 'value'=>null, 'validate'=>'required|max:7'],


        ];
        return $tp->run($action);


    }
    public function article ($action){

        $tp = new Tp();
        $tp->table = 'article';
        $tp->page_name = 'Мэдээ';
        $tp->identity_name = 'id';
        $tp->grid_columns = ['active', 'name', 'category_id', 'id'];
        $tp->grid_default_order_by = 'id DESC';
        $tp->formType = 'inline';

        $tp->form_input_control = [
            ['column'=>'active', 'title'=>'Идвэхтэй', 'type'=>'--checkbox', 'value'=>0, 'validate'=> ''],
            ['column'=>'name', 'title'=>'Нэр', 'type'=>'--text', 'value'=>null, 'validate'=>'required|max:7'],
            ['column'=>'category_id', 'title'=>'Бүлэг', 'type'=>'--combogrid', 'value'=>null, 'validate'=>'required', 'options'=>[
                'valueField'=> 'id',
                'textField'=> 'name',
                'columns'=>[
                    ['column'=>'active', 'title'=>'Идвэхтэй', 'type'=>'--checkbox'],
                    ['column'=>'name', 'title'=>'Нэр', 'type'=>'--text'],
                ],
                'table'=>'acticle_category',
                'selectFields'=>['id', 'active', 'name'],
                'defaultOrder'=>'id DESC'
            ]],
            ['column'=>'intro', 'title'=>'Оршил', 'type'=>'--textarea', 'value'=>null, 'validate'=>'required'],
            ['column'=>'body', 'title'=>'Агуулага', 'type'=>'--textarea', 'value'=>null, 'validate'=>'required'],

        ];
        return $tp->run($action);


    }

    public function locales ($action){

        $tp = new Tp();
        $tp->table = 'locales';
        $tp->page_name = 'Хэл';
        $tp->identity_name = 'id';
        $tp->grid_default_order_by = 'id DESC';
        $tp->grid_columns = ['code', 'language', 'flag', 'id'];
        $tp->form_input_control = [

            ['column'=>'code', 'title'=>'Улсын код', 'type'=>'--text', 'value'=>null, 'validate'=>'required|max:7'],
            ['column'=>'language', 'title'=>'Хэл', 'type'=>'--text', 'value'=>null, 'validate'=>'required|max:7'],
            ['column'=>'flag', 'title'=>'Туг', 'type'=>'--text', 'value'=>null, 'validate'=>'required|max:7'],

        ];
        $tp->formType = 'page';
        return $tp->run($action);


    }



}