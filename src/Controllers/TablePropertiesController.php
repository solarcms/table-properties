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
            case "category":          return $this->category($action);        break;
            case "product_detail":          return $this->product_detail($action);        break;
            default:              return $this->acticle_category($action);
        }



    }
    public function acticle_category ($action){

        $tp = new Tp();
        $tp->table = 'acticle_category';
        $tp->page_name = 'Бүлэг';
        $tp->identity_name = 'id';
        $tp->grid_columns = ['active', 'name', 'id'];
        $tp->grid_default_order_by = 'id DESC';
        $tp->formType = 'inline';

        $tp->grid_output_control = [
            ['column'=>'active', 'title'=>'Идвэхтэй', 'type'=>'--checkbox', 'fixed'=>false],
            ['column'=>'name', 'title'=>'Нэр', 'type'=>'--text'],
        ];

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
        $tp->grid_columns = ['article.active', 'article.name', 'acticle_category.name as category_id_name', 'article.id', 'locales.code', 'article.test_tag'];
        $tp->grid_default_order_by = 'id DESC';
        $tp->formType = 'page';

        $tp->grid_output_control = [
            ['column'=>'active', 'title'=>'Идвэхтэй', 'type'=>'--checkbox', 'fixed'=>true],
            ['column'=>'name', 'title'=>'Нэр', 'type'=>'--text'],
            ['column'=>'category_id_name', 'title'=>'Бүлэг', 'type'=>'--text'],
            ['column'=>'code', 'title'=>'Хэл', 'type'=>'--text'],
        ];

        $tp->form_input_control = [
            ['column'=>'active', 'title'=>'Идвэхтэй', 'type'=>'--checkbox', 'value'=>0, 'validate'=> ''],
            ['column'=>'name', 'title'=>'Нэр', 'type'=>'--text', 'value'=>null, 'validate'=>'required|max:7'],
            ['column'=>'category_id', 'title'=>'Бүлэг', 'type'=>'--combogrid', 'value'=>null, 'validate'=>'required', 'options'=>[
                'valueField'=> 'id',
                'textField'=> 'name',
                'grid_output_control'=>[
                    ['column'=>'active', 'title'=>'Идвэхтэй', 'type'=>'--checkbox'],
                    ['column'=>'name', 'title'=>'Нэр', 'type'=>'--text'],
                ],
                'form_input_control' => [
                    ['column'=>'active', 'title'=>'Идвэхтэй', 'type'=>'--checkbox', 'value'=>0, 'validate'=> '', 'error'=>null],
                    ['column'=>'name', 'title'=>'Нэр', 'type'=>'--text', 'value'=>null, 'validate'=>'required|max:7', 'error'=>null],
                ],
                'table'=>'acticle_category',
                'identity_name'=>'id',
                'grid_columns'=>['id', 'active', 'name'],
                'grid_default_order_by'=>'id DESC'
            ]],
            ['column'=>'hel', 'title'=>'Хэл', 'type'=>'--combobox', 'value'=>null, 'validate'=>'required', 'options'=>[
                'valueField'=> 'id',
                'textField'=> 'code',
                'table'=>'locales',
                'identity_name'=>'id',
                'grid_columns'=>['id', 'code'],
                'grid_default_order_by'=>'id DESC'
            ]],
            ['column'=>'test_tag', 'title'=>'Төрөл', 'type'=>'--tag', 'value'=>null, 'validate'=>'required', 'options'=>[
                'valueField'=> 'ID',
                'textField'=> 'category_name',
                'table'=>'category',
                'identity_name'=>'ID',
                'grid_columns'=>['ID', 'category_name'],
                'grid_default_order_by'=>'ID DESC'
            ]],
            ['column'=>'test_ungu', 'title'=>'Color', 'type'=>'--tag', 'value'=>null, 'validate'=>'required', 'options'=>[
                'valueField'=> 'id',
                'textField'=> 'ungu',
                'table'=>'ungu',
                'identity_name'=>'id',
                'grid_columns'=>['id', 'ungu'],
                'grid_default_order_by'=>'ungu DESC'
            ]],
            ['column'=>'test_radio', 'title'=>'test radio', 'type'=>'--radio', 'value'=>null, 'choices'=>[['value'=>'a', 'text'=>'A'], ['value'=>'b', 'text'=>'B'], ['value'=>'c', 'text'=>'C']], 'validate'=>'required'],
            ['column'=>'intro', 'title'=>'Оршил', 'type'=>'--textarea', 'value'=>null, 'validate'=>'required'],
            ['column'=>'body', 'title'=>'Агуулага', 'type'=>'--textarea', 'value'=>null, 'validate'=>'required'],
            ['column'=>'test_date', 'title'=>'Огноо', 'type'=>'--date', 'value'=>null, 'validate'=>'required'],
            ['column'=>'test_datetime', 'title'=>'Огноо цаг', 'type'=>'--datetime', 'value'=>null, 'validate'=>'required'],

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

        $tp->grid_output_control = [
            ['column'=>'code', 'title'=>'Улсын код', 'type'=>'--text'],
            ['column'=>'language', 'title'=>'Хэл', 'type'=>'--text'],
            ['column'=>'flag', 'title'=>'Туг', 'type'=>'--text'],
        ];
        $tp->form_input_control = [

            ['column'=>'code', 'title'=>'Улсын код', 'type'=>'--text', 'value'=>null, 'validate'=>'required|max:7'],
            ['column'=>'language', 'title'=>'Хэл', 'type'=>'--text', 'value'=>null, 'validate'=>'required|max:7'],
            ['column'=>'flag', 'title'=>'Туг', 'type'=>'--text', 'value'=>null, 'validate'=>'required|max:7'],

        ];
        $tp->formType = 'page';
        return $tp->run($action);


    }

    public function category ($action){

        $tp = new Tp();
        $tp->table = 'category';
        $tp->page_name = 'Бүлэг';
        $tp->identity_name = 'id';
        $tp->grid_default_order_by = 'id DESC';
        $tp->grid_columns = ['category_name', 'id'];
        $tp->grid_output_control = [
            ['column'=>'category_name', 'title'=>'Нэр', 'type'=>'--text']
        ];
        $tp->form_input_control = [
            ['column'=>'category_name', 'title'=>'Нэр', 'type'=>'--text', 'value'=>null, 'validate'=>'required']
        ];
        $tp->formType = 'page';
        return $tp->run($action);


    }

    public function product_detail ($action){

        $tp = new Tp();
        $tp->table = 'product_detail';
        $tp->page_name = 'Бараа';
        $tp->identity_name = 'id';
        $tp->grid_default_order_by = 'id DESC';
        $tp->grid_columns = ['title', 'description', 'price', 'images', 'size', 'colors', 'id'];
        $tp->grid_output_control = [
            ['column'=>'title', 'title'=>'Нэр', 'type'=>'--text', 'fixed'=>true],
            ['column'=>'price', 'title'=>'Үнэ', 'type'=>'--text'],
            ['column'=>'size', 'title'=>'Хэмжээ', 'type'=>'--text'],
            ['column'=>'colors', 'title'=>'Өнгө', 'type'=>'--text'],
        ];
        $tp->form_input_control = [
            ['column'=>'title', 'title'=>'Нэр', 'type'=>'--text', 'value'=>null, 'validate'=>'required'],
            ['column'=>'description', 'title'=>'Тайлбар', 'type'=>'--text', 'value'=>null, 'validate'=>'required'],
            ['column'=>'price', 'title'=>'Үнэ', 'type'=>'--text', 'value'=>null, 'validate'=>'required'],
            ['column'=>'size', 'title'=>'Хэмжээ', 'type'=>'--text', 'value'=>null, 'validate'=>'required'],
            ['column'=>'colors', 'title'=>'Өнгө', 'type'=>'--text', 'value'=>null, 'validate'=>'required'],
            ['column'=>'images', 'title'=>'Зураг', 'type'=>'--text', 'value'=>null, 'validate'=>'required']
        ];
        $tp->formType = 'page';
        return $tp->run($action);


    }



}