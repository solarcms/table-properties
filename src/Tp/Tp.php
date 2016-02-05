<?php

namespace Solarcms\Core\TableProperties\Tp;
use Solarcms\TableProperties\TableProperties;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Response;
use Request;
use Illuminate\Routing\ResponseFactory as Resp;

use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class Tp
{

    public $viewName = '';
    public $table = '';                     // required, table for use for sql_insert(), sql_update(), sql_update_grid() and sql_delete()
    public $identity_name = '';             // required, column name of id primary key

    public $page_name ='';
    public $permission = ['c'=>true, 'r'=>true, 'u'=>true, 'd'=>true]; // Create, Read, Update, Delete CRUD default is all true
    public $ifUpdateDisabledCanEditColumns = []; //['acitve', 'name']
    public $ifUpdateDisabledCanEditColumnsByValue = [];  //[['acitve'=>1]]
    public $read_condition = [];  //[['active'=>0], ['user_id'=>21]]
    public $search_columns = [];


    public $exclude_field = array();        // don't allow users to update or insert into these fields, even if data is posted. place the field name in the key of the array. example: $lm->exclude_field['is_admin'] = '';

    public $form_sql = '';                  // render form from fields retuned in sql statement. if blank then 'select * from table where identity_name = identity_id' is used. when no record is found then a blank form to ADD a record is displayed
    public $form_sql_param = array();       // associative array to bind named parameters to form_sql. use to pass in identity_id when specifiying form_sql.
    public $form_input_control = [];   // for form(), define inputs like select boxes, document uploads, etc... *info on usage below*


    public $grid_columns = [];
    public $grid_default_order_by = '';     // free-form 'order by' clause. Not used if grid_sql is specified. Example: column1 desc, column2 asc
    public $grid_input_control = [];   // for grid(), define inputs like select boxes, checkboxes, etc... *info on usage below*
    public $grid_output_control = [];  // for grid(). define outputs like --email to make a clickable mailto or --document to make a link. *info on usage below*
    public $pageLimit = 50;               // pagination limit number of records per page
    public $pagination_position = 'bottom'; // both, top, bottom


    //file upload
    public $file_upload_allow_list = 'mimes:mp3,jpg,jpeg,png,gif,doc,docx,xls,xlsx,txt,pdf|max:80000';
    public $image_upload_allow_list = 'mimes:png,gif,jpeg,jpg|max:80000';

    public $base_folder = 'uploaded';
    public $destination_folder = 'common';
    public $thumb_folder = 'thumb';



    // time stamp
    public $created_at = false;
    public $updated_at = false;

    //form types
    public $formType = 'page'; // page, inline, window

    //subitems
    public $subItems = [];

    //translation
    public $translation_table = "";
    public $translation_connector = "";
    public $locales_table = "locales";
    public $locale_connector = "locale_id"; // same on all translate able tables
    public $default_locale_id = 1; // EN;
    public $translate_form_input_control = []; // EN;




    //TRIGGER
    public $save_from_parent = []; // parent columns :"id", "active", "name", child columns:'id', 'parent_id', 'parent_name'(NULL ABLE)  #['child_column'=>'parent_name', 'parent_column'=>'name']
    public $save_sub_items_count = []; // parent columns :"id", "active", "name" "total_childs", child columns:'id', 'parent_id',  #['child_connect_column'=>'parent_id', 'parent_column'=>'total_childs']


    //Buttons
    public $save_button_text = 'Хадгалах';
    public $cancel_button_text = 'Болих';
    public $delete_button_text = 'Устгах';


    function __construct(){

    }

    public function run($action){


        if(count($this->read_condition) >= 1 && count($this->ifUpdateDisabledCanEditColumnsByValue))
        foreach($this->read_condition as $read_condition){
            if (in_array($read_condition, $this->ifUpdateDisabledCanEditColumnsByValue)) {
                $this->permission['u'] = true;
            }
        }

        // purpose: built-in controller
        switch($action){
            case "edit":          return $this->edit();        break;
            case "insert":        return $this->insert();      break;
            case "update":        return $this->update();      break;

            case "update_grid":   return $this->update_grid(); break;
            case "delete":        return $this->delete();      break;

            case "index":         return $this->index($this->viewName);       break;
            case "setup":         return $this->setup();       break;
            case "grid_list":     return $this->gridList();    break;
            case "get_form_datas":     return $this->get_form_datas();    break;
            // combo gird
            case "grid_combo_list":     return $this->gridComboGrid();    break;
            case "insert-combo-grid":        return $this->insertComboGrid();      break;
            case "edit-combo-grid":          return $this->editComboGrid();        break;
            case "update-combo-grid":        return $this->updateComboGrid();      break;
            case "delete-combo-grid":        return $this->deleteComboGrid();      break;
            // combo box add able
            case "insert-combo-add-able":        return $this->insertCombAddAble();      break;
            case "combo-list":     return $this->comboList();    break;

            // sub items
            case "edit-sub-items":     return $this->editSubItems();    break;
            case "delete-sub-items":     return $this->deleteSubItems();    break;

            // translation
            case "change-language":     return $this->changeLangauge();    break;
            case "edit-translation":     return $this->editTranslation();    break;

            // cascade
            case "get-cascade-child": return $this->getCascadeChild(); break;

            // validate
            case "check-unique": return $this->checkUnique(); break;

            //upload
            case "upload-image": return $this->uploadImage(); break;
            case "delete-file": return $this->deleteFile(); break;
            case "get-extra-images": return $this->getExtraImages(); break;

            default:              return $this->index($this->viewName);
        }

    }

    public function index($viewName){


        $page_name = $this->page_name;

        $setup = [];

        $buttons = [
            'save_text'=>$this->save_button_text,
            'cancel_text'=>$this->cancel_button_text,
            'delete_text'=>$this->delete_button_text
        ];



        //// setup

        $subItems = [];
        foreach($this->subItems as $subItem){
            $subItem['items']=[];
            $subItems[] = $subItem;
        }
        if($this->translation_table !== ''){
            if (Session::has('locale_id')) {

            } else {
                Session::set('locale_id', $this->default_locale_id);
            }

            $locales = DB::table($this->locales_table)->select('id', 'code')->orderBy('id', 'ASC')->get();
        }

        else
            $locales = [];
        $setup = [
            'button_texts'=>$buttons,
            'locales'=>$locales,
            'form_input_control'=>$this->form_input_control,
            'translate_form_input_control'=>$this->translate_form_input_control,
            'grid_output_control'=>$this->grid_output_control,
            'page_name'=>$this->page_name,
            'pagination_position'=>$this->pagination_position,
            'formType'=>$this->formType,
            'pageLimit'=>$this->pageLimit,
            'subItems'=>$subItems,
            'permission'=>$this->permission,
            'ifUpdateDisabledCanEditColumns'=>$this->ifUpdateDisabledCanEditColumns,
            'form_datas'=>$this->get_form_datas()
        ];

        ////


        return view($viewName, compact('page_name', 'setup'));
    }

    public function gridList(){

        if($this->permission['r'] != true)
            return Response::json('permission denied', 400);

        $pageLimit = Request::input('pageLimit');
        $searchValue = Request::input('searchValue');

        $table_data = DB::table($this->table)->select($this->grid_columns);

        if($this->translation_table != ""){
            $default_language_id = Session::get('locale_id');
            $table_data->join($this->translation_table, "$this->table." . $this->identity_name, '=', $this->translation_table. "." .$this->translation_connector);
            $table_data->where($this->translation_table.".".$this->locale_connector, "=", $default_language_id);
        }


        foreach($this->form_input_control as $formControl){
            if($formControl['type'] == '--combogrid' || $formControl['type'] == '--combobox' || $formControl['type'] == '--tag' || $formControl['type'] == '--combobox-addable' || $formControl['type'] == '--combobox-hidden'){

                if(isset($formControl['save']) && $formControl['save'] == false){

                } {
                    $options = $formControl['options'];

                    $table_data->join($options['table'], "$this->table." . $formControl['column'], '=', $options['table']. "." .$options['valueField']);
                }

            }
            if($formControl['type'] == '--group'){
                foreach($formControl['controls'] as $subformControl){
                    if($subformControl['type'] == '--combogrid' || $subformControl['type'] == '--combobox' || $subformControl['type'] == '--tag' || $subformControl['type'] == '--combobox-addable' || $subformControl['type'] == '--combobox-hidden'){

                        if(isset($subformControl['save']) && $subformControl['save'] == false){

                        } {

                            $suboptions = $subformControl['options'];

                            $table_data->join($suboptions['table'], "$this->table." . $subformControl['column'], '=', $suboptions['table']. "." .$suboptions['valueField']);
                        }

                    }

                }
            }
        }

        if($searchValue != '') {
            $loop = 0;
            foreach($this->search_columns as $sw){
                if($loop == 0)
                    $table_data->where($sw, 'LIKE', "%$searchValue%");
                else
                    $table_data->orwhere($sw, 'LIKE', "%$searchValue%");
                $loop++;
            }
        }


        // read condition
        if(count($this->read_condition) >= 1){
            foreach($this->read_condition as $read_condition){

                foreach($read_condition as $column=>$value){

                        $table_data->where($column, '=', $value);
                }
            }
        }

        if($this->grid_default_order_by != ''){
            $order = explode(" ",$this->grid_default_order_by);
            $table_data->orderBy($order[0], $order[1]);
        }

//        dd($table_data->toSql());


        return  $table_data->paginate($pageLimit);

    }
    public function get_data($formControls){
        if($this->permission['r'] != true && $this->permission['c'] === false)
            return Response::json('permission denied', 400);

        $FormData = [];


        foreach($formControls as $formControl) {
            if($formControl['type'] == '--combogrid'){

                $options = $formControl['options'];
                $order = explode(" ", $options['grid_default_order_by']);
                $data = DB::table($options['table'])->select($options['grid_columns'])->orderBy($order[0], $order[1])->paginate(20);

                $data = $data->toArray();

                $FormData[$formControl['column']] = ['data'=>$data, 'form_input_control'=>$options['form_input_control'], 'text'=>null];

                //  print_r($data);
                //->take($this->pageLimit)->get()

            }
            if($formControl['type'] == '--combobox' || $formControl['type'] == '--tag' || $formControl['type'] == '--combobox-addable'){

                $options = $formControl['options'];
                if(isset($options['parent'])){
                    $FormData[$formControl['column']] = ['data'=>['data'=>[]]];

                } else{
                    $order = explode(" ", $options['grid_default_order_by']);
                    $data['data'] = DB::table($options['table'])->select($options['grid_columns'])->orderBy($order[0], $order[1])->get();


                    $FormData[$formControl['column']] = ['data'=>$data];
                }






            }
            if($formControl['type'] == '--combobox-addable'){
                $options = $formControl['options'];


                    $comboAddAbleFC = $options['form_input_control'];


                    $FormData_pre = $this->get_data($comboAddAbleFC);


                    $FormData = array_merge($FormData, $FormData_pre);



            }
            if($formControl['type'] == '--group'){
                $controls = $formControl['controls'];



                $FormData_pre = $this->get_data($controls);



                $FormData = array_merge($FormData,$FormData_pre);


            }

        }

        return $FormData;
    }
    public function get_form_datas(){
        if($this->permission['r'] != true && $this->permission['c'] === false)
            return [];
//            return Response::json('permission denied', 400);


        $FormData = [];

        $FormData_pre = $this->get_data($this->form_input_control);


        $FormData = array_merge($FormData,$FormData_pre);

        if(count($this->subItems) >= 1){
            foreach($this->subItems as $subItem){



                $FormData_pre_sub = $this->get_data($subItem['form_input_control']);



                $FormData = array_merge($FormData,$FormData_pre_sub);
            }
        }


        return $FormData;

    }

    public function edit(){

        if(empty($this->ifUpdateDisabledCanEditColumns))
            if($this->permission['u'] != true)
                return Response::json('permission denied', 400);

        $id = Request::input('id');

        /// saijruulah

        $table_data = DB::table($this->table)->where($this->table.".".$this->identity_name, '=', $id);
        $table_data->select("$this->identity_name");

        if($this->translation_table != ""){
            $default_language_id = Session::get('locale_id');
            $table_data->join($this->translation_table, "$this->table." . $this->identity_name, '=', $this->translation_table. "." .$this->translation_connector);
            $table_data->where($this->translation_table.".".$this->locale_connector, "=", $default_language_id);
        }

        $options = null;
        foreach($this->form_input_control as $formControl){

            if(isset($formControl['column']))
            $table_data->addSelect("$this->table." . $formControl['column']);

//            if($formControl['type'] == '--combogrid' || $formControl['type'] == '--combobox' || $formControl['type'] == '--tag' || $formControl['type'] == '--combobox-addable' || $formControl['type'] == '--combobox-hidden'){
//
//                $options = $formControl['options'];
//
//                $table_data->join($options['table'], "$this->table." . $formControl['column'], '=', $options['table']. "." .$options['valueField']);
//
//
//            }

            if($formControl['type'] == '--group'){
                foreach($formControl['controls'] as $subformControl){

                    if(isset($subformControl['column']))
                        $table_data->addSelect("$this->table." . $subformControl['column']);

//                    if($subformControl['type'] == '--combogrid' || $subformControl['type'] == '--combobox' || $subformControl['type'] == '--tag' || $subformControl['type'] == '--combobox-addable' || $subformControl['type'] == '--combobox-hidden'){
//
//                        if(isset($subformControl['save']) && $subformControl['save'] == false){
//
//                        } {
//
//                            $suboptions = $subformControl['options'];
//
//                            $table_data->join($suboptions['table'], "$this->table." . $subformControl['column'], '=', $suboptions['table']. "." .$suboptions['valueField']);
//                        }
//
//                    }

                }
            }
        }


        return  $table_data->get();

    }

    public function editTranslation(){
        if(empty($this->ifUpdateDisabledCanEditColumns))
            if($this->permission['u'] != true)
                return Response::json('permission denied', 400);

        if($this->translation_table !== ''){
            $id = Request::input('id');

            $translation_datas = DB::table($this->translation_table)->where($this->translation_connector, "=", $id)->get();

            return $translation_datas;
        } else {
            return [];
        }

    }

    public function insert(){

        if($this->permission['c'] != true)
            return Response::json('permission denied', 400);


        $formData = Request::input('data');
        $translateData = Request::input('translateData');




        if(count($this->form_input_control) <= 0){
            $this->setup();
        }

        $insertQuery = [];
        foreach($this->form_input_control as $formControl){

            if($formControl['type'] == '--group'){
                foreach($formControl['controls'] as $subformControl){
                    if($subformControl['type'] == '--group'){

                    }else{
                        if($subformControl['type']=='--checkbox'){
                            $checkBoxValue = $formData[$subformControl['column']];
                            if($checkBoxValue == 1)
                                $checkBoxValue = 1;
                            else
                                $checkBoxValue = 0;
                            $insertQuery[$subformControl['column']] = $checkBoxValue;

                        } else
                            $insertQuery[$subformControl['column']] = $formData[$subformControl['column']];
                    }


                }
            }else{
                if($formControl['type']=='--checkbox'){
                    $checkBoxValue = $formData[$formControl['column']];
                    if($checkBoxValue == 1)
                        $checkBoxValue = 1;
                    else
                        $checkBoxValue = 0;
                    $insertQuery[$formControl['column']] = $checkBoxValue;

                } else
                    $insertQuery[$formControl['column']] = $formData[$formControl['column']];
            }

        }

        if(!empty($this->save_sub_items_count)){
            $posted_sub_items = Request::input('subItems');

            foreach($posted_sub_items as $posted_sub_item){
                if($posted_sub_item['connect_column'] == $this->save_sub_items_count['child_connect_column']){
                    $subitmesCount = count($posted_sub_item['items']);

                    $insertQuery[$this->save_sub_items_count['parent_column']] = $subitmesCount;
                }
            }

        }

        $saved = DB::table($this->table)->insert($insertQuery);

        $insertedId = DB::getPdo()->lastInsertId();


        // transltation table save action
        if(!empty($this->translate_form_input_control)){

            foreach($translateData as $translate){
                $translationInsertQuery = [];
                $translationInsertQuery[$this->locale_connector] = $translate['locale_id'];
                $translationInsertQuery[$this->translation_connector] = $insertedId;

                foreach($this->translate_form_input_control as $translationformControl){
                    if($translationformControl['type']=='--checkbox'){
                        $checkBoxValue = $formData[$translationformControl['column']];
                        if($checkBoxValue == 1)
                            $checkBoxValue = 1;
                        else
                            $checkBoxValue = 0;
                        $translationInsertQuery[$translationformControl['column']] = $checkBoxValue;

                    } else
                        $translationInsertQuery[$translationformControl['column']] = $translate['data'][$translationformControl['column']];
                }

                DB::table($this->translation_table)->insert($translationInsertQuery);
            }


        }

        if(count($this->subItems) >= 1)
            $this->saveSubItems($insertedId, $this->subItems, Request::input('subItems'));

        $response = null;
        if($saved){
            $response = 'success';
        } else {
            $response = "error";
        }
        return $response;
    }


    public function update(){
        if(empty($this->ifUpdateDisabledCanEditColumns))
            if($this->permission['u'] != true)
                return Response::json('permission denied', 400);


        $formData = Request::input('data');
        $id = Request::input('id');
        $translateData = Request::input('translateData');

        if(count($this->form_input_control) <= 0){
            $this->setup();
        }

        $insertQuery = [];
        foreach($this->form_input_control as $formControl){
            if($this->permission['u'] != true){
                if(count($this->ifUpdateDisabledCanEditColumns) >= 1){

                    foreach($this->ifUpdateDisabledCanEditColumns as $ifUpdateDisabledCanEditColumn){

                        if($formControl['type'] == '--group'){
                            foreach($formControl['controls'] as $subformControl){
                                if($subformControl['type'] == '--group'){

                                } else{
                                    if($subformControl['type']=='--checkbox'){
                                        $checkBoxValue = $formData[$subformControl['column']];
                                        if($checkBoxValue == 1)
                                            $checkBoxValue = 1;
                                        else
                                            $checkBoxValue = 0;
                                        $insertQuery[$subformControl['column']] = $checkBoxValue;

                                    } else
                                        $insertQuery[$subformControl['column']] = $formData[$subformControl['column']];
                                }

                            }
                        }else{
                            if($ifUpdateDisabledCanEditColumn == $formControl['column']){

                                if($formControl['type']=='--checkbox'){
                                    $checkBoxValue = $formData[$formControl['column']];
                                    if($checkBoxValue == 1)
                                        $checkBoxValue = 1;
                                    else
                                        $checkBoxValue = 0;
                                    $insertQuery[$formControl['column']] = $checkBoxValue;

                                } else
                                    $insertQuery[$formControl['column']] = $formData[$formControl['column']];
                            }
                        }
                    }
                }

            } else {
                if($formControl['type'] == '--group'){
                    foreach($formControl['controls'] as $subformControl){
                        if($subformControl['type'] == '--group'){

                        }else{
                            if($subformControl['type']=='--checkbox'){
                                $checkBoxValue = $formData[$subformControl['column']];
                                if($checkBoxValue == 1)
                                    $checkBoxValue = 1;
                                else
                                    $checkBoxValue = 0;
                                $insertQuery[$subformControl['column']] = $checkBoxValue;

                            } else
                                $insertQuery[$subformControl['column']] = $formData[$subformControl['column']];
                        }

                    }
                }else{
                    if ($formControl['type'] == '--checkbox') {
                        $checkBoxValue = $formData[$formControl['column']];
                        if ($checkBoxValue == 1)
                            $checkBoxValue = 1;
                        else
                            $checkBoxValue = 0;
                        $insertQuery[$formControl['column']] = $checkBoxValue;

                    } else
                        $insertQuery[$formControl['column']] = $formData[$formControl['column']];

                }



            }

        }



        if(!empty($this->save_sub_items_count)){
            $posted_sub_items = Request::input('subItems');

            foreach($posted_sub_items as $posted_sub_item){
                if($posted_sub_item['connect_column'] == $this->save_sub_items_count['child_connect_column']){
                    $subitmesCount = count($posted_sub_item['items']);

                    $insertQuery[$this->save_sub_items_count['parent_column']] = $subitmesCount;
                }
            }

        }


        $saved = DB::table($this->table)->where("$this->identity_name", '=', $id)->update($insertQuery);

        // transltation table update action
        if(!empty($this->translate_form_input_control)){

            foreach($translateData as $translate){
                $translationInsertQuery = [];
                //$translationInsertQuery[$this->locale_connector] = $translate['locale_id'];
                //$translationInsertQuery[$this->translation_connector] = $insertedId;

                foreach($this->translate_form_input_control as $translationformControl){
                    if($translationformControl['type']=='--checkbox'){
                        $checkBoxValue = $formData[$translationformControl['column']];
                        if($checkBoxValue == 1)
                            $checkBoxValue = 1;
                        else
                            $checkBoxValue = 0;
                        $translationInsertQuery[$translationformControl['column']] = $checkBoxValue;

                    } else
                        $translationInsertQuery[$translationformControl['column']] = $translate['data'][$translationformControl['column']];
                }

                DB::table($this->translation_table)
                    ->where("$this->translation_connector", "=", $id)
                    ->where("$this->locale_connector", "=", $translate['locale_id'])
                    ->update($translationInsertQuery);
            }


        }

        if(count($this->subItems) >= 1)
            $this->saveSubItems($id, $this->subItems, Request::input('subItems'));

        $response = null;
        if($saved){
            $response = 'success';
        } else {
            $response = "none";
        }
        return $response;
    }


    public function update_grid(){
        return 'update_grid';
    }


    public function delete(){
        if($this->permission['d'] != true)
            return Response::json('permission denied', 400);

        $id = Request::input('id');

        $deleted = DB::table($this->table)->where("$this->identity_name", '=', $id)->delete();

        if ($deleted)
            return 'success';
        else
            return 'error';

    }




    public function setup(){
        $columns = [];

        //$table_info_columns = DB::select( DB::raw("SHOW COLUMNS FROM $this->table"));

        // this will skip identity_name and created_at, updated_at columns
//        foreach($table_info_columns as $column_pre){
//
//            $col_name = $column_pre->Field;
//            $col_type = $column_pre->Type;
//
//
//            if($col_name == 'created_at')
//                $this->created_at = true;
//
//            if($col_name == 'updated_at')
//                $this->updated_at = true;
//
//            if($col_name != $this->identity_name && $col_name != 'created_at' && $col_name != 'updated_at')
//                $columns[] = ['name'=>$col_name, 'type'=>$col_type];
//        }
//        $fields =  $this->create_grid_from_fields($columns);
        $subItems = [];
        foreach($this->subItems as $subItem){
            $subItem['items']=[];
            $subItems[] = $subItem;
        }
        if($this->translation_table !== ''){
            if (Session::has('locale_id')) {

            } else {
                Session::set('locale_id', $this->default_locale_id);
            }

            $locales = DB::table($this->locales_table)->select('id', 'code')->orderBy('id', 'ASC')->get();
        }

        else
            $locales = [];
        return [
            'locales'=>$locales,
            'form_input_control'=>$this->form_input_control,
            'translate_form_input_control'=>$this->translate_form_input_control,
            'grid_output_control'=>$this->grid_output_control,
            'page_name'=>$this->page_name,
            'pagination_position'=>$this->pagination_position,
            'formType'=>$this->formType,
            'pageLimit'=>$this->pageLimit,
            'subItems'=>$subItems,
            'permission'=>$this->permission,
            'ifUpdateDisabledCanEditColumns'=>$this->ifUpdateDisabledCanEditColumns
        ];

    }

    public function create_grid_from_fields($columns){

        if(count($this->form_input_control) <= 0){

            foreach($columns as $column){

                $column_name = $column['name'];
                $type = $column['type'];



                    if($type == 'date'){
                        $this->form_input_control[] = ['column'=> $column_name, 'title'=> $column_name, 'type'=>'--date', 'validate'=> ''];
                        $this->grid_output_control[] = ['column'=> $column_name, 'title'=> $column_name, 'type'=>'--date'];
                    }
                    elseif($type == 'datetime' || $type == 'timestamp'){
                        $this->form_input_control[] = ['column'=> $column_name, 'title'=> $column_name, 'type'=>'--datetime', 'validate'=> ''];
                        $this->grid_output_control[] = ['column'=> $column_name, 'title'=> $column_name, 'type'=>'--datetime'];
                    }
                    elseif($type == 'blob')
                        $this->form_input_control[] = ['column'=> $column_name, 'title'=> $column_name, 'type'=>'--textarea', 'validate'=> ''];
                    elseif($type == 'tinyint(1)'){
                        $this->form_input_control[] = ['column'=> $column_name, 'title'=> $column_name, 'type'=>'--checkbox', 'value'=>false, 'validate'=> ''];
                        $this->grid_output_control[] = ['column'=> $column_name, 'title'=> $column_name, 'type'=>'--checkbox'];
                    }
                    elseif(mb_strstr($type, 'short') || mb_strstr($type, 'int') || mb_strstr($type, 'long') || mb_strstr($type, 'float') || mb_strstr($type, 'double') || mb_strstr($type, 'decimal'))
                    {
                        $this->grid_output_control[] = ['column'=> $column_name, 'title'=> $column_name, 'type'=>'--number', 'validate'=> ''];
                        $this->form_input_control[] = ['column'=> $column_name, 'title'=> $column_name, 'type'=>'--number', 'value'=>null];
                    }
                    elseif(mb_strstr($type, 'varchar')){

                        $this->form_input_control[] = ['column'=> $column_name, 'title'=> $column_name, 'type'=>'--text', 'value'=>'', 'validate'=> ''];
                        $this->grid_output_control[] = ['column'=> $column_name, 'title'=> $column_name, 'type'=>'--text'];
                    }


            }
        }  else {
            foreach($columns as $column){

                $column_name = $column['name'];
                $type = $column['type'];


                    if($type == 'date')
                        $this->grid_output_control[] = ['column'=> $column_name, 'title'=> $column_name, 'type'=>'--date'];

                    elseif($type == 'datetime' || $type == 'timestamp')
                        $this->grid_output_control[] = ['column'=> $column_name, 'title'=> $column_name, 'type'=>'--datetime'];
                    elseif($type == 'tinyint(1)')
                        $this->grid_output_control[] = ['column'=> $column_name, 'title'=> $column_name, 'type'=>'--checkbox'];
                    elseif(mb_strstr($type, 'short') || mb_strstr($type, 'int') || mb_strstr($type, 'long') || mb_strstr($type, 'float') || mb_strstr($type, 'double') || mb_strstr($type, 'decimal'))
                        $this->grid_output_control[] = ['column'=> $column_name, 'title'=> $column_name, 'type'=>'--number'];
                    elseif(mb_strstr($type, 'varchar'))
                        $this->grid_output_control[] = ['column'=> $column_name, 'title'=> $column_name, 'type'=>'--text'];


            }
        }



        $form_input_controll = [];
        foreach($this->form_input_control as $form_controll){
            $form_controll['error'] = null;
            $form_input_controll[] =  $form_controll;
        }

        return ['form_input_control'=>$form_input_controll, 'grid_output_control'=>$this->grid_output_control];
    }


/* combo grid*/
    public function gridComboGrid(){

        $column = Request::input('column');
        $searchValue = Request::input('searchValue');

        foreach($this->form_input_control as $formControl){
            if($formControl['type'] == '--combogrid' && $formControl['column'] == $column){

                $options = $formControl['options'];
                $order = explode(" ", $options['grid_default_order_by']);
                $table_data = DB::table($options['table'])->select($options['grid_columns'])->orderBy($order[0], $order[1]);

                if($searchValue != '') {
                    $loop = 0;
                    foreach($options['grid_columns'] as $sw){
                        if($loop == 0)
                            $table_data->where($sw, 'LIKE', "%$searchValue%");
                        else
                            $table_data->orwhere($sw, 'LIKE', "%$searchValue%");
                        $loop++;
                    }
                }


            }
        }

        return  $table_data->paginate(20);

    }
    public function editComboGrid(){
        $id = Request::input('id');
        $column = Request::input('column');

        /// saijruulah
        $options = null;
        foreach($this->form_input_control as $formControl){
            if($formControl['type'] == '--combogrid' && $formControl['column'] == $column){

                $options = $formControl['options'];



            }
        }

        $table_data = DB::table($options['table'])->where('id', '=', $id)->select($options['grid_columns'])->get();



        return  $table_data;

    }
    public function insertComboGrid(){
        $formData = Request::input('data');
        $column = Request::input('column');

        $options = null;
        foreach($this->form_input_control as $formControl){
            if($formControl['type'] == '--combogrid' && $formControl['column'] == $column){

                $options = $formControl['options'];





            }


        }


        $insertQuery = [];
        foreach($options['form_input_control'] as $formControl){
            if($formControl['type']=='--checkbox'){
                $checkBoxValue = $formData[$formControl['column']];
                if($checkBoxValue == 1)
                    $checkBoxValue = 1;
                else
                    $checkBoxValue = 0;
                $insertQuery[$formControl['column']] = $checkBoxValue;

            } else
                $insertQuery[$formControl['column']] = $formData[$formControl['column']];
        }

        $saved = DB::table($options['table'])->insert($insertQuery);

        $response = null;
        if($saved){
            $response = 'success';
        } else {
            $response = "error";
        }
        return $response;


    }
    public function updateComboGrid(){
        $formData = Request::input('data');
        $id = Request::input('id');

        $column = Request::input('column');

        $options = null;
        foreach($this->form_input_control as $formControl){
            if($formControl['type'] == '--combogrid' && $formControl['column'] == $column){

                $options = $formControl['options'];





            }


        }

        $insertQuery = [];
        foreach($options['form_input_control'] as $formControl){
            if($formControl['type']=='--checkbox'){
                $checkBoxValue = $formData[$formControl['column']];
                if($checkBoxValue == 'true')
                    $checkBoxValue = 1;
                else
                    $checkBoxValue = 0;
                $insertQuery[$formControl['column']] = $checkBoxValue;

            } else
                $insertQuery[$formControl['column']] = $formData[$formControl['column']];
        }

        $saved = DB::table($options['table'])->where('id', '=', $id)->update($insertQuery);

        $response = null;
        if($saved){
            $response = 'success';
        } else {
            $response = "none";
        }
        return $response;
    }
    public function deleteComboGrid(){
        if($this->permission['d'] == true){
            $id = Request::input('id');

            $column = Request::input('column');

            $options = null;
            foreach($this->form_input_control as $formControl){
                if($formControl['type'] == '--combogrid' && $formControl['column'] == $column){

                    $options = $formControl['options'];





                }


            }

            $deleted = DB::table($options['table'])->where('id', '=', $id)->delete();

            if($deleted)
                return 'success';
            else
                return 'error';
        }

    }


    /*
     * Combox add able
     * */
    public function insertCombAddAble(){
        $formData = Request::input('data');
        $column = Request::input('column');



        $insertQuery = [];
        $table = '';
        foreach($this->form_input_control as $formControl){
            if($formControl['type']=='--combobox-addable' && $formControl['column']==$column){

                $form_input_control = $formControl['options']['form_input_control'];
                $table = $formControl['options']['table'];

                foreach($form_input_control as $formControl2){
                    if($formControl2['type'] == '--group'){
                        foreach($formControl2['controls'] as $subformControl){
                            if($subformControl['type'] == '--group'){

                            }else{
                                if($subformControl['type']=='--checkbox'){
                                    $checkBoxValue = $formData[$subformControl['column']];
                                    if($checkBoxValue == 1)
                                        $checkBoxValue = 1;
                                    else
                                        $checkBoxValue = 0;
                                    $insertQuery[$subformControl['column']] = $checkBoxValue;

                                } else
                                    $insertQuery[$subformControl['column']] = $formData[$subformControl['column']];
                            }

                        }
                    }else{
                        if ($formControl2['type'] == '--checkbox') {
                            $checkBoxValue = $formData[$formControl2['column']];
                            if ($checkBoxValue == 1)
                                $checkBoxValue = 1;
                            else
                                $checkBoxValue = 0;
                            $insertQuery[$formControl2['column']] = $checkBoxValue;

                        } else
                            $insertQuery[$formControl2['column']] = $formData[$formControl2['column']];
                    }


                }

            }

        }





        if($table != '')
            $saved = DB::table($table)->insert($insertQuery);
        else
            $saved = false;


        if(!$saved){
            $insertQuery = [];
            $table = '';
            foreach($this->subItems as $subItem) {

                foreach ($subItem['form_input_control'] as $SformControl) {


                    if ($SformControl['type'] == '--combobox-addable') {


                        $form_input_control = $SformControl['options']['form_input_control'];
                        $table = $SformControl['options']['table'];

                        foreach($form_input_control as $formControl2){
                            if($formControl2['type']=='--checkbox'){
                                $checkBoxValue = $formData[$formControl2['column']];
                                if($checkBoxValue == 1)
                                    $checkBoxValue = 1;
                                else
                                    $checkBoxValue = 0;
                                $insertQuery[$formControl2['column']] = $checkBoxValue;

                            } else
                                $insertQuery[$formControl2['column']] = $formData[$formControl2['column']];
                        }

                    }

                }

            }
            $saved = DB::table($table)->insert($insertQuery);
        }

        $response = null;
        if($saved){
            $response = 'success';
        } else {
            $response = "error";
        }
        return $response;
    }
    public function comboList(){
        $column = Request::input('column');

        $table = '';
        $table_data = null;

        foreach($this->form_input_control as $formControl){
            if($formControl['type']=='--combobox-addable' && $formControl['column']==$column){

                $table = $formControl['options']['table'];
                $grid_columns = $formControl['options']['grid_columns'];
                $order = explode(" ", $formControl['options']['grid_default_order_by']);

                $table_data = DB::table($table)->select($grid_columns)->orderBy($order[0], $order[1])->get();


            }

        }

        if(count($this->subItems) >= 1 && $table_data == null){
            foreach($this->subItems as $subItem){

                foreach($subItem['form_input_control'] as $SformControl) {




                    if($SformControl['type'] == '--combobox-addable'){


                        $table = $SformControl['options']['table'];
                        $grid_columns = $SformControl['options']['grid_columns'];
                        $order = explode(" ", $SformControl['options']['grid_default_order_by']);

                        $table_data = DB::table($table)->select($grid_columns)->orderBy($order[0], $order[1])->get();



                    }

                }
            }
        }

        return  $table_data;



    }


    /*sub items*/
    public function saveSubItems($parentId, $thisSubItems, $subItems){
        foreach($thisSubItems as $subItem){

            foreach($subItems as $subItem_posted){
                if($subItem_posted['connect_column'] == $subItem['connect_column']){
                    if(isset($subItem_posted['items'])){
                        foreach($subItem_posted['items'] as $item){
                            $insertQuery = [];
                            $insertQuery[$subItem['connect_column']] = $parentId;
                            $table = $subItem['table'];
                            $formData = $item;
                            foreach($subItem['form_input_control'] as $formControl){
                                if($formControl['type'] == '--group'){
                                    foreach($formControl['controls'] as $sformControl){
                                        if($sformControl['type']=='--checkbox'){
                                            $checkBoxValue = $formData[$sformControl['column']];
                                            if($checkBoxValue == 1)
                                                $checkBoxValue = 1;
                                            else
                                                $checkBoxValue = 0;
                                            $insertQuery[$sformControl['column']] = $checkBoxValue;

                                        } else
                                            $insertQuery[$sformControl['column']] = $formData[$sformControl['column']];
                                    }
                                }else{
                                    if($formControl['type']=='--checkbox'){
                                        $checkBoxValue = $formData[$formControl['column']];
                                        if($checkBoxValue == 1)
                                            $checkBoxValue = 1;
                                        else
                                            $checkBoxValue = 0;
                                        $insertQuery[$formControl['column']] = $checkBoxValue;

                                    } else
                                        $insertQuery[$formControl['column']] = $formData[$formControl['column']];
                                }


                            }

                            if(!empty($this->save_from_parent)){

                                $will_save_parent_value = DB::table($this->table)->select($this->save_from_parent['parent_column'])->where('id', '=', $parentId)->pluck($this->save_from_parent['parent_column']);

                                $insertQuery[$this->save_from_parent['child_column']] = $will_save_parent_value;
                            }

                            if($item['id']==null)

                                DB::table($table)->insert($insertQuery);
                            else
                                DB::table($table)->where('id', '=', $item['id'])->update($insertQuery);

                        }
                    }
                }
            }
        }
    }
    public function editSubItems(){

        $connect_column = Request::input('connect_column');
        $parent_id = Request::input('parent_id');


        foreach($this->subItems as $subItem){
            if($subItem['connect_column'] == $connect_column){

                $table = $subItem['table'];


                $edit_data = DB::table($table)->where("$connect_column", "=", $parent_id)->get();

                return $edit_data;

            }
        }

    }
    public function deleteSubItems(){

        $connect_column = Request::input('connect_column');
        $id = Request::input('id');


        foreach($this->subItems as $subItem){
            if($subItem['connect_column'] == $connect_column){

                $table = $subItem['table'];


                DB::table($table)->where("id", "=", $id)->delete();

                return 'success';

            }
        }

    }

    /*translation*/
    public function changeLangauge(){
        $locale_id = Request::input('locale_id');

        if (Session::has('locale_id')) {
            Session::set('locale_id', $locale_id);
        } else {
            Session::set('locale_id', $this->default_locale_id);
        }

    }

    // cascade
    public function getCascade($parent, $child, $form_input_control){
        $data = [];
        $found = false;

        foreach($form_input_control as $formControl) {

            if(isset($formControl["column"]) && $formControl["column"] == $child){

                $options = $formControl['options'];
                $order = explode(" ", $options['grid_default_order_by']);
                $data = DB::table($options['table'])->select($options['grid_columns'])
                    ->where($options['parent'], '=',$parent)
                    ->orderBy($order[0], $order[1])->get();
                return $data;

            }

        }

    }
    public function getCascadeChild()
    {
        $child = Request::input('child');
        $parent = Request::input('parent');

        $data = [];
        $found = false;


        $data = $this->getCascade($parent, $child, $this->form_input_control);

        if(empty($data)){
            foreach($this->form_input_control as $formControl) {

                if($formControl['type'] == '--group' && empty($data)){
                    $controls = $formControl['controls'];
                    $data = $this->getCascade($parent, $child, $controls);
                }
            }
        }
        if(empty($data)){
            foreach($this->form_input_control as $formControl) {

                if($formControl['type'] == '--combobox-addable'){



                    $data = $this->getCascade($parent, $child, $formControl['options']['form_input_control']);

                    if(empty($data)){

                        foreach($formControl['options']['form_input_control'] as $sformControl) {

                            if($sformControl['type'] == '--group' && empty($data)){
                                $controls = $sformControl['controls'];
                                $this->getCascade($parent, $child, $controls);
                            }
                        }
                    }
                }
            }


        }
        if(count($this->subItems) >= 1 && empty($data)){

            foreach($this->subItems as $subItem){

                if(empty($data)) {
                    $data = $this->getCascade($parent, $child, $subItem['form_input_control']);
                }
            }

            if(empty($data)) {
                foreach($this->subItems as $subItem){

                    foreach($subItem['form_input_control'] as $formControl) {

                        if($formControl['type'] == '--group' && empty($data)){
                            $controls = $formControl['controls'];
                            $data = $this->getCascade($parent, $child, $controls);
                        }
                    }
                }


            }
        }

        return $data;

    }

    public function checkUnique(){
        $table = Request::input('table');
        $column = Request::input('column');
        $value = Request::input('value');

        $count = DB::table($table)->where($column, '=', $value)->count();

        return $count;
    }

    //upload
    public function uploadImage(){
        $file = Request::file('file');

        $rules = [
            'file' => $this->image_upload_allow_list
        ];

        $validator = Validator::make(Request::all(), $rules);

        if ($validator->passes()) {


            //paths
            $destinationPath = base_path() . DIRECTORY_SEPARATOR .'public'. DIRECTORY_SEPARATOR .$this->base_folder. DIRECTORY_SEPARATOR . $this->destination_folder . DIRECTORY_SEPARATOR;


            $thumbPath = $destinationPath . $this->thumb_folder . DIRECTORY_SEPARATOR;
            if (!is_dir($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            if (!is_dir($thumbPath)) {
                mkdir($thumbPath, 0755, true);
            }
//            $destinationUrl = url('/') . "/".$this->base_folder."/" . $this->destination_folder . '/';
            $destinationUrl = "/".$this->base_folder."/" . $this->destination_folder . '/';
            $thumbUrl = $destinationUrl . $this->thumb_folder.'/';

            //property
            $fileOrigName = $file->getClientOriginalName();

            $fileUniqueName = date("YmdHis") . "_" . str_random(25) . '.' . $file->getClientOriginalExtension();


            while (File::exists($destinationPath . $fileUniqueName)) {

                $fileUniqueName = uniqid() . "_" . $fileUniqueName;
            }

            $uploadSuccess = Image::make($file->getRealPath());
            $bigImage = $uploadSuccess->resize(1600, null, function ($constraint) {
                $constraint->aspectRatio();
            });
            $bigImage->save($destinationPath . $fileUniqueName, 100);

            $thum_iamge = $uploadSuccess->resize(364, null, function ($constraint) {
                $constraint->aspectRatio();
            });
            $thum_iamge->save($thumbPath . $fileUniqueName);



            $result = [
                'destinationUrl' => $destinationUrl,
                'thumbUrl' => $thumbUrl,
                'origName' => $fileOrigName,
                'uniqueName' => $fileUniqueName
            ];


            if($uploadSuccess) {

                return Response::json($result, 200); // or do a redirect with some message that file was uploaded

            } else {

                return Response::json('error', 400);
            }
        } else {

            return Response::json('error. Invalid file format or size >5Mb', 400);
        }


    }

    public function deleteFile(){
        $filename = Request::input('filename');

        $destinationPath = base_path() . DIRECTORY_SEPARATOR .'public'. DIRECTORY_SEPARATOR .$this->base_folder. DIRECTORY_SEPARATOR . $this->destination_folder . DIRECTORY_SEPARATOR;


        $thumbPath = $destinationPath . $this->thumb_folder . DIRECTORY_SEPARATOR;

        unlink($destinationPath.$filename);
        unlink($thumbPath.$filename);

        return Response::json('success', 200);
    }



}