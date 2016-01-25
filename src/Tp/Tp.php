<?php

namespace Solarcms\Core\TableProperties\Tp;


use Solarcms\TableProperties\TableProperties;
use Illuminate\Support\Facades\DB;
use Request;
use Illuminate\Routing\ResponseFactory as Resp;


class Tp
{

    public $viewName = '';
    public $table = '';                     // required, table for use for sql_insert(), sql_update(), sql_update_grid() and sql_delete()
    public $identity_name = '';             // required, column name of id primary key

    public $page_name ='';
    public $rename = array();               // associative array of column names and friendly names. example: array('prod_id' => 'Product ID')

    public $uri_path = '';                  // to specify URI. Needed for some applications such as in admin WordPress Plugins.

    public $exclude_field = array();        // don't allow users to update or insert into these fields, even if data is posted. place the field name in the key of the array. example: $lm->exclude_field['is_admin'] = '';

    public $form_sql = '';                  // render form from fields retuned in sql statement. if blank then 'select * from table where identity_name = identity_id' is used. when no record is found then a blank form to ADD a record is displayed
    public $form_sql_param = array();       // associative array to bind named parameters to form_sql. use to pass in identity_id when specifiying form_sql.
    public $form_input_control = [];   // for form(), define inputs like select boxes, document uploads, etc... *info on usage below*


    public $grid_columns = [];
    public $grid_default_order_by = '';     // free-form 'order by' clause. Not used if grid_sql is specified. Example: column1 desc, column2 asc
    public $grid_input_control = [];   // for grid(), define inputs like select boxes, checkboxes, etc... *info on usage below*
    public $grid_output_control = [];  // for grid(). define outputs like --email to make a clickable mailto or --document to make a link. *info on usage below*
    public $grid_multi_delete = false;      // display checkboxes on grid to allow for multiple record delete
    public $grid_show_search_box = false;   // display search field at the top - grid_sql must be altered to accomodate search
    public $pageLimit = 50;               // pagination limit number of records per page
    public $grid_show_images = false;       // option to show images inside the grid, otherwise a link is displayed for --image type
    public $pagination_position = 'bottom'; // both, top, bottom




    // upload paths                             // relative path names only! paths are created at runtime as needed
    public $upload_path = 'uploads';            // required when using --image or --document input types
    public $thumb_path = 'thumbs';              // optional, leave blank if you don't need thumbnails

    // image settings
    public $upload_width = 400;                 // 0 height or width means no resizing or cropping
    public $upload_height = 400;
    public $upload_crop = false;                // crop versus resize: resize keeps the original aspect ratio but limits the size of the image
    public $thumb_width = 100;
    public $thumb_height = 100;
    public $thumb_crop = true;


    public $date_in = 'Y-m-d';                        // input format into database, no need to change
    public $datetime_in = 'Y-m-d H:i:s';

    // US date format
    public $date_out = 'Y-m-d';                       // output date
    public $datetime_out = 'Y-m-d H:i:s';             // output datetime

    public $upload_allow_list = '.mp3 .jpg .jpeg .png .gif .doc .docx .xls .xlsx .txt .pdf'; // space delimted file name extentions. include period

    public $form_text_title_add    = 'Add Record';   // titles in the <th> of top of the edit form
    public $form_text_title_edit   = 'Edit Record';
    public $form_text_record_saved = 'Record Saved'; // customize success messages
    public $form_text_record_added = 'Record Added';

    public $grid_text_record_added = "Record Added";
    public $grid_text_changes_saved = "Changes Saved";
    public $grid_text_record_deleted = "Record Deleted";
    public $grid_text_save_changes = "Save Changes";
    public $grid_text_delete = "Delete";
    public $grid_text_no_records_found = "No Records Found";

    // time stamp
    public $created_at = false;
    public $updated_at = false;

    //grid

    //form types
    public $formType = 'page'; // page, inline, window

    //sub grid

    function __construct(){

    }

    public function run($action){

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

            default:              return $this->index($this->viewName);
        }

    }

    public function gridList(){

        $pageLimit = Request::input('pageLimit');
        $searchValue = Request::input('searchValue');

        $table_datas = DB::table($this->table)->select($this->grid_columns);

        foreach($this->form_input_control as $formControl){
            if($formControl['type'] == '--combogrid' || $formControl['type'] == '--combobox' || $formControl['type'] == '--tag' || $formControl['type'] == '--combobox-addable' || $formControl['type'] == '--combobox-hidden'){

                $options = $formControl['options'];

                $table_datas->leftjoin($options['table'], "$this->table." . $formControl['column'], '=', $options['table']. "." .$options['valueField']);

            }
        }

        if($searchValue != '') {
            $loop = 0;
            foreach($this->grid_columns as $sw){
                if($loop == 0)
                    $table_datas->where($sw, 'LIKE', "%$searchValue%");
                else
                    $table_datas->orwhere($sw, 'LIKE', "%$searchValue%");
                $loop++;
            }
        }
        if($this->grid_default_order_by != ''){
            $order = explode(" ",$this->grid_default_order_by);
            $table_datas->orderBy($order[0], $order[1]);
        }



        return  $table_datas->paginate($pageLimit);

    }
    public function get_form_datas(){

        $FormData = [];

        foreach($this->form_input_control as $formControl){
            if($formControl['type'] == '--combogrid'){

                $options = $formControl['options'];
                $order = explode(" ", $options['grid_default_order_by']);
                $data = DB::table($options['table'])->select($options['grid_columns'])->orderBy($order[0], $order[1])->paginate(20);

                $data = $data->toArray();

                $FormData[$formControl['column']] = ['data'=>$data, 'form_input_control'=>$options['form_input_control'], 'text'=>null];

              //  print_r($data);
                //->take($this->pageLimit)->get()

            }
            if($formControl['type'] == '--combobox' || $formControl['type'] == '--tag' || $formControl['type'] == '--combobox-addable' || $formControl['type'] == '--combobox-hidden'){

                $options = $formControl['options'];
                $order = explode(" ", $options['grid_default_order_by']);
                $data['data'] = DB::table($options['table'])->select($options['grid_columns'])->orderBy($order[0], $order[1])->get();

//                $data = $data->toArray();

                $FormData[$formControl['column']] = ['data'=>$data];

              //  print_r($data);
                //->take($this->pageLimit)->get()

                if($formControl['type'] == '--combobox-addable'){
                    $options = $formControl['options'];

                    $comboAddAbleFC = $options['form_input_control'];

                    foreach($comboAddAbleFC as $CAformControl) {



                        if ($CAformControl['type'] == '--combobox') {


                            $CAoptions = $CAformControl['options'];

                            $CAorder = explode(" ", $CAoptions['grid_default_order_by']);
                            $CAdata['data'] = DB::table($CAoptions['table'])->select($CAoptions['grid_columns'])->orderBy($CAorder[0], $CAorder[1])->get();

                            $FormData[$CAformControl['column']] = ['data'=>$CAdata];

                        }

                    }



                }

            }
        }


        return $FormData;

    }


    public function edit(){
        $id = Request::input('id');

        /// saijruulah

        $table_datas = DB::table($this->table)->where($this->table.".id", '=', $id);

        $table_datas->select($this->grid_columns);


        $options = null;
        foreach($this->form_input_control as $formControl){

            $table_datas->addSelect("$this->table." . $formControl['column']);

            if($formControl['type'] == '--combogrid' || $formControl['type'] == '--combobox' || $formControl['type'] == '--tag' || $formControl['type'] == '--combobox-addable' || $formControl['type'] == '--combobox-hidden'){

                $options = $formControl['options'];



                $table_datas->leftjoin($options['table'], "$this->table." . $formControl['column'], '=', $options['table']. "." .$options['valueField']);

            }
        }





        return  $table_datas->get();

    }


    public function insert(){
        $formData = Request::input('data');

        if(count($this->form_input_control) <= 0){
            $this->setup();
        }

        $insertQuery = [];
        foreach($this->form_input_control as $formControl){
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

        $saved = DB::table($this->table)->insert($insertQuery);

        $response = null;
        if($saved){
            $response = 'success';
        } else {
            $response = "error";
        }
        return $response;
    }


    public function update(){
        $formData = Request::input('data');
        $id = Request::input('id');

        if(count($this->form_input_control) <= 0){
            $this->setup();
        }

        $insertQuery = [];
        foreach($this->form_input_control as $formControl){
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

        $saved = DB::table($this->table)->where('id', '=', $id)->update($insertQuery);

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
        $id = Request::input('id');

        $deleted = DB::table($this->table)->where('id', '=', $id)->delete();

        if($deleted)
            return 'success';
        else
            return 'error';
    }

    public function index($viewName){


        $page_name = $this->page_name;
        return view($viewName, compact('page_name'));
    }


    public function setup(){
        $columns = [];

        $table_info_columns = DB::select( DB::raw("SHOW COLUMNS FROM $this->table"));

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

        return [
            'form_input_control'=>$this->form_input_control,
            'grid_output_control'=>$this->grid_output_control,
            'page_name'=>$this->page_name,
            'pagination_position'=>$this->pagination_position,
            'formType'=>$this->formType,
            'pageLimit'=>$this->pageLimit,
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
                $table_datas = DB::table($options['table'])->select($options['grid_columns'])->orderBy($order[0], $order[1]);

                if($searchValue != '') {
                    $loop = 0;
                    foreach($options['grid_columns'] as $sw){
                        if($loop == 0)
                            $table_datas->where($sw, 'LIKE', "%$searchValue%");
                        else
                            $table_datas->orwhere($sw, 'LIKE', "%$searchValue%");
                        $loop++;
                    }
                }


            }
        }

        return  $table_datas->paginate(20);

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

        $table_datas = DB::table($options['table'])->where('id', '=', $id)->select($options['grid_columns'])->get();



        return  $table_datas;

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