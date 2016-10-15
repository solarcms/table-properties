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
use App;
use Illuminate\Support\Facades\Config;

class Tp
{


    public $viewName = '';
    public $table = '';                     // required, table for use for sql_insert(), sql_update(), sql_update_grid() and sql_delete()
    public $identity_name = '';             // required, column name of id primary key

    public $page_name = '';
    public $permission = ['c' => true, 'r' => true, 'u' => true, 'd' => true]; // Create, Read, Update, Delete CRUD default is all true
    public $just_info = false;
    public $ifUpdateDisabledCanEditColumns = []; //['acitve', 'name']
    public $ifUpdateDisabledCanEditColumnsByValue = [];  //[['acitve'=>1]]
    public $where_condition = [];  //[['id', '=', 1]]
    public $search_columns = [];
    public $update_row = null;


    public $exclude_field = array();        // don't allow users to update or insert into these fields, even if data is posted. place the field name in the key of the array. example: $lm->exclude_field['is_admin'] = '';

    public $form_sql = '';                  // render form from fields retuned in sql statement. if blank then 'select * from table where identity_name = identity_id' is used. when no record is found then a blank form to ADD a record is displayed
    public $form_sql_param = array();       // associative array to bind named parameters to form_sql. use to pass in identity_id when specifiying form_sql.
    public $form_input_control = [];   // for form(), define inputs like select boxes, document uploads, etc... *info on usage below*

    public $grid_extra_data = [];

    public $grid_columns = [];
    public $grid_default_order_by = '';     // free-form 'order by' clause. Not used if grid_sql is specified. Example: column1 desc, column2 asc
    public $grid_input_control = [];   // for grid(), define inputs like select boxes, checkboxes, etc... *info on usage below*
    public $grid_output_control = [];  // for grid(). define outputs like --email to make a clickable mailto or --document to make a link. *info on usage below*
    public $pageLimit = 500;               // pagination limit number of records per page
    public $pagination_position = 'bottom'; // both, top, bottom


    //file upload
    public $file_upload_allow_list = 'mimes:mp3,jpg,jpeg,png,gif,doc,docx,xls,xlsx,txt,pdf|max:80000';
    public $image_upload_allow_list = 'mimes:JPG,PNG,GIF,JPEG,png,gif,jpeg,jpg|max:80000';

    public $base_folder = 'uploaded';
    public $destination_folder = 'common';
    public $thumb_folder = 'thumb';

    /*Join tables*/

    public $join_tables = []; // [['table2', 'table2.join_id', '=', 'table1.id']];

    //group by
    public $group_by = null;
    //select RAW
    public $selectRAW = null;

    // time stamp
    public $created_at = null;
    public $updated_at = null;

    //form types
    public $formType = 'page'; // page, inline, window

    //subitems
    public $subItems = [];


    //TRIGGER
    public $save_from_parent = []; // parent columns :"id", "active", "name", child columns:'id', 'parent_id', 'parent_name'(NULL ABLE)  #['child_column'=>'parent_name', 'parent_column'=>'name']
    public $save_sub_items_count = []; // parent columns :"id", "active", "name" "total_childs", child columns:'id', 'parent_id',  #['child_connect_column'=>'parent_id', 'parent_column'=>'total_childs']
    public $before_insert = null;
    public $before_update = null;
    public $before_delete = null;

    //Buttons
    public $save_button_text = 'Хадгалах';
    public $cancel_button_text = 'Болих';
    public $delete_button_text = 'Устгах';
    public $edit_delete_column_title = 'Засах';
    public $add_button_text = 'Шинээр нэмэх';

    //action words
    public $save_alert_word = 'Saved';
    public $show_saved_alert = false;
    public $show_insert_response = false;
    public $insert_response_function = null;


    //after save redirect
    public $after_save_redirect = false;
    public $after_save_redirect_url = '';


    // generate locale's files
    public $generateLocaleFile = false;


    //multi items
    public $multi_items_form_input_control = [];
    public $save_first_id_column = null;

    //public hidden value
    public $hidden_values = [];

    //password change
    public $password_change = false;


    public $confing = [];

    //translation
    public $locales_table = "solar_locales";
    public $static_words_table = "solar_static_words";
    public $default_locale = "EN";
    public $translate_form_input_control = [];

    //map
    public $googleMap = false;

    //advanced
    public $advancedSearch = [
        'dateMode' => 'date',
        'dateRage' => [],
        'numberRange' => [],
        'parentSelect' => [],
        'dateYearMonth' => [
            'searchColumn' => null,
            'defaultYear' => null,
            'years' => [],
            'defaultMonth' => null,
            'months' => [],
        ],
        'monthRanges' => [

        ]
    ];
    public $hideMainOrder = false;
    public $showAdvancedSearch = false;

    //column summary
    public $columnSummary = [];

    //search mode
    public $search_mode = 'grid_columns';


    //after save reload page
    public $after_save_reload_page = false;

    //form class
    public $formClassName = '';
    public $fieldClassName = 'col-md-6';

    //grid
    public $gridTop = 83;
    public $gridTopWithAdvenced = 145;


    function __construct()
    {
        $this->config = Config::get('tp_config');

        //translation config
        $this->default_locale = $this->config['default_locale'];
        $this->static_words_table = $this->config['static_words_table'];
        $this->locales_table = $this->config['locales_table'];

        //button's text config
        $this->save_button_text = $this->config['save_button_text'];
        $this->cancel_button_text = $this->config['cancel_button_text'];
        $this->delete_button_text = $this->config['delete_button_text'];
        $this->edit_delete_column_title = $this->config['edit_delete_column_title'];
        $this->add_button_text = $this->config['add_button_text'];

        //form
        $this->fieldClassName = $this->config['fieldClassName'];

        //grid
        $this->gridTop = $this->config['gridTop'];
        $this->gridTopWithAdvenced = $this->config['gridTopWithAdvenced'];
    }


    public function run($action)
    {


        if (count($this->where_condition) >= 1 && count($this->ifUpdateDisabledCanEditColumnsByValue))
            foreach ($this->where_condition as $where_condition) {
                if (in_array($where_condition, $this->ifUpdateDisabledCanEditColumnsByValue)) {
                    $this->permission['u'] = true;
                }
            }

        // purpose: built-in controller

        switch ($action) {

            case "edit":
                return $this->edit();
                break;
            case "insert":
                return $this->insert();
                break;
            case "update":
                return $this->update();
                break;

            case "update_grid":
                return $this->update_grid();
                break;
            case "delete":
                return $this->delete();
                break;

            case "index":
                return $this->index($this->viewName);
                break;
            case "setup":
                return $this->index($this->viewName);
                break;
            case "grid_list":
                return $this->gridList();
                break;
            case "get_form_datas":
                return $this->get_form_datas();
                break;
            //combobox
            case "combo-sync":
                return $this->comboSync();
                break;
            // combo gird
            case "grid_combo_list":
                return $this->gridComboGrid();
                break;
            case "insert-combo-grid":
                return $this->insertComboGrid();
                break;
            case "edit-combo-grid":
                return $this->editComboGrid();
                break;
            case "update-combo-grid":
                return $this->updateComboGrid();
                break;
            case "delete-combo-grid":
                return $this->deleteComboGrid();
                break;
            // combo box add able
            case "insert-combo-add-able":
                return $this->insertCombAddAble();
                break;
            case "combo-list":
                return $this->comboList();
                break;

            // sub items
            case "edit-sub-items":
                return $this->editSubItems();
                break;
            case "delete-sub-items":
                return $this->deleteSubItems();
                break;

            // translation
            case "change-language":
                return $this->changeLangauge();
                break;


            // cascade
            case "get-cascade-child":
                return $this->getCascadeChild();
                break;

            // validate
            case "check-unique":
                return $this->checkUnique();
                break;

            //upload
            case "upload-file":
                return $this->uploadFile();
                break;
            case "delete-file":
                return $this->deleteFile();
                break;
            case "get-extra-images":
                return $this->getExtraImages();
                break;
            case "call-multi-items":
                return $this->callMultImtems();
                break;
            case "after-change-trigger":
                return $this->afterChangeTrigger();
                break;

            default:
                return $this->index($this->viewName);
        }

    }

    public function index($viewName)
    {


        $page_name = $this->page_name;

        $setup = [];

        $buttons = [
            'save_text' => $this->save_button_text,
            'cancel_text' => $this->cancel_button_text,
            'delete_text' => $this->delete_button_text,
            'add_button_text' => $this->add_button_text
        ];


        //// setup

        $subItems = [];
        foreach ($this->subItems as $subItem) {
            $subItem['items'] = [];
            $subItems[] = $subItem;
        }
        if (count($this->translate_form_input_control) >= 1) {
            if (Session::has('locale')) {

            } else {
                Session::set('locale', $this->default_locale);
            }

            $locales = DB::table($this->locales_table)->select('id', 'code')->orderBy('id', 'ASC')->get();
        } else {
            $locales = [];
            Session::set('locale', $this->default_locale);
        }

        if (Session::has('order')) {
            $order = Session::get('order');

            if ($order['page_name'] != $page_name) {
                $orderPre = explode(" ", $this->grid_default_order_by);
                $order = ['column' => $orderPre[0], 'sortOrder' => $orderPre[1], 'page_name' => $page_name];
                Session::set('order', $order);
            }
        } else {
            $orderPre = explode(" ", $this->grid_default_order_by);
            $order = ['column' => $orderPre[0], 'sortOrder' => $orderPre[1], 'page_name' => $page_name];
            Session::set('order', $order);
        }

        $setup = [
            'button_texts' => $buttons,
            'locales' => $locales,
            'form_input_control' => $this->form_input_control,
            'translate_form_input_control' => $this->translate_form_input_control,
            'save_first_id_column' => $this->save_first_id_column,
            'multi_items_form_input_control' => $this->multi_items_form_input_control,
            'grid_output_control' => $this->grid_output_control,
            'grid_extra_data' => $this->grid_extra_data,
            'page_name' => $this->page_name,
            'pagination_position' => $this->pagination_position,
            'formType' => $this->formType,
            'pageLimit' => $this->pageLimit,
            'subItems' => $subItems,
            'permission' => $this->permission,
            'just_info' => $this->just_info,
            'ifUpdateDisabledCanEditColumns' => $this->ifUpdateDisabledCanEditColumns,
            'form_datas' => $this->get_form_datas(),
            'default_locale' => Session::get('locale'),
            'update_row' => $this->update_row,
            'identity_name' => $this->identity_name,
            'show_saved_alert' => $this->show_saved_alert,
            'show_insert_response' => $this->show_insert_response,
            'save_alert_word' => $this->save_alert_word,
            'password_change' => $this->password_change,
            'edit_delete_column_title' => $this->edit_delete_column_title,
            'googleMap' => $this->googleMap,
            'order' => $order,
            'advancedSearch' => $this->advancedSearch,
            'showAdvancedSearch' => $this->showAdvancedSearch,
            'columnSummary' => $this->columnSummary,
            'fieldClassName' => $this->fieldClassName,
            'after_save_reload_page' => $this->after_save_reload_page,
            'formClassName' => $this->formClassName,
            'gridTop' => $this->gridTop,
            'gridTopWithAdvenced' => $this->gridTopWithAdvenced,
            'hideMainOrder' => $this->hideMainOrder,
            'after_save_redirect'=>$this->after_save_redirect,
            'after_save_redirect_url'=>$this->after_save_redirect_url,
        ];

        //dd($setup);


        return view($viewName, compact('page_name', 'setup'));
    }

    public function gridList()
    {

        if ($this->permission['r'] != true)
            return Response::json('permission denied', 400);

        $pageLimit = Request::input('pageLimit');
        $searchValue = Request::input('searchValue');
        $newOrder = Request::input('order');
        $advancedSearch = Request::input('advancedSearch');

        $table_data = DB::table($this->table)->select($this->grid_columns);

        if ($this->selectRAW) {
            $table_data->addSelect(DB::raw($this->selectRAW));
        }

        if ($this->join_tables) {
            foreach ($this->join_tables as $join_table) {
                $table_data = $table_data->join($join_table[0], $join_table[1], $join_table[2], $join_table[3]);
            }
        }

        foreach ($this->form_input_control as $formControl) {
            if ($formControl['type'] == '--combogrid' || $formControl['type'] == '--combobox' || $formControl['type'] == '--tag' || $formControl['type'] == '--combobox-addable' || $formControl['type'] == '--combobox-hidden') {

                if (isset($formControl['save']) && $formControl['save'] == false) {

                }
                {
                    $options = $formControl['options'];

                    if (isset($options['join']) && $options['join'] == false) {

                    } else {
                        $table_data->join($options['table'], "$this->table." . $formControl['column'], '=', $options['table'] . "." . $options['valueField']);
                    }


                }

            }
            if ($formControl['type'] == '--group') {
                foreach ($formControl['controls'] as $subformControl) {
                    if ($subformControl['type'] == '--combogrid' || $subformControl['type'] == '--combobox' || $subformControl['type'] == '--tag' || $subformControl['type'] == '--combobox-addable' || $subformControl['type'] == '--combobox-hidden') {

                        if (isset($subformControl['save']) && $subformControl['save'] == false) {

                        }
                        {

                            $suboptions = $subformControl['options'];

                            if (isset($suboptions['join']) && $suboptions['join'] == false) {

                            } else
                                $table_data->join($suboptions['table'], "$this->table." . $subformControl['column'], '=', $suboptions['table'] . "." . $suboptions['valueField']);

                            if (isset($options['with_translation']) && $options['with_translation'] == true) {
                                $table_data->where($suboptions['table'] . "." . $this->locale_connector, "=", $default_language_id);
                            }

                        }

                    }

                }
            }
        }

        if (count($this->multi_items_form_input_control) >= 1) {

            foreach ($this->multi_items_form_input_control as $multiFormControl) {

                if ($multiFormControl['type'] == '--combogrid'
                    || $multiFormControl['type'] == '--combobox'
                    || $multiFormControl['type'] == '--tag'
                    || $multiFormControl['type'] == '--combobox-addable'
                    || $multiFormControl['type'] == '--combobox-hidden'
                ) {

                    if (isset($multiFormControl['save']) && $multiFormControl['save'] == false) {

                    }
                    {
                        $options = $multiFormControl['options'];

                        if (isset($options['join']) && $options['join'] == false) {

                        } else {
                            $table_data->join($options['table'], "$this->table." . $multiFormControl['column'], '=', $options['table'] . "." . $options['valueField']);
                        }


                    }

                }
            }
        }


        if ($searchValue != '') {


            if (count($this->where_condition) >= 1) {


                foreach ($this->where_condition as $where_condition) {


                    $table_data->where(function ($query) use ($searchValue) {
                        $loop = 0;
                        if ($this->search_mode == 'grid_columns') {
                            foreach ($this->grid_columns as $sw) {
                                if ($loop == 0)
                                    $query->where($sw, 'LIKE', "%$searchValue%");

                                else
                                    $query->orwhere($sw, 'LIKE', "%$searchValue%");
                                $loop++;
                            }
                        } else
                            foreach ($this->search_columns as $sw) {
                                if ($loop == 0)
                                    $query->where($sw, 'LIKE', "%$searchValue%");
                                else
                                    $query->orwhere($sw, 'LIKE', "%$searchValue%");
                                $loop++;
                            }

                        return $query;
                    });

                }

            } else {
                $loop = 0;
                if ($this->search_mode == 'grid_columns') {
                    foreach ($this->grid_columns as $sw) {
                        if ($sw != $this->identity_name) {
                            if ($loop == 0)
                                $table_data->where($sw, 'LIKE', "%$searchValue%");
                            else
                                $table_data->orwhere($sw, 'LIKE', "%$searchValue%");
                            $loop++;
                        }
                    }
                } else
                    foreach ($this->search_columns as $sw) {
                        if ($loop == 0)
                            $table_data->where($sw, 'LIKE', "%$searchValue%");
                        else
                            $table_data->orwhere($sw, 'LIKE', "%$searchValue%");
                        $loop++;
                    }
            }

        }


        // read condition
        if (count($this->where_condition) >= 1) {
            foreach ($this->where_condition as $where_condition) {


                $table_data->where($where_condition[0], $where_condition[1], $where_condition[2]);

            }
        }

//        group by
        if ($this->group_by) {
            $table_data->groupBy(DB::raw($this->group_by));
        }
        if ($this->grid_default_order_by != '') {
            if ($newOrder['column'] != null && $newOrder['sortOrder'] != null) {

                $table_data->orderBy($newOrder['column'], $newOrder['sortOrder']);

                $orderList = ['column' => $newOrder['column'], 'sortOrder' => $newOrder['sortOrder'], 'page_name' => $this->page_name];
                Session::set('order', $orderList);
            } else {
                $order = explode(" ", $this->grid_default_order_by);
                $table_data->orderBy($order[0], $order[1]);

                $orderList = ['column' => $order[0], 'sortOrder' => $order[1], 'page_name' => $this->page_name];
                Session::set('order', $orderList);
            }

        }

//        dd($table_data->toSql());

        if (isset($advancedSearch['parentSelect'])) {
            foreach ($advancedSearch['parentSelect'] as $parentSelect) {
                if ($parentSelect['value'] != null) {
                    $parentTable = $parentSelect['table'];
                    $childColumn = $parentSelect['column'];
                    $table_data->where("$parentTable.$childColumn", "=", $parentSelect['value']);


                }
            }
        }

        if (isset($advancedSearch['dateRange'])) {
            foreach ($advancedSearch['dateRange'] as $dateRange) {
                if ($dateRange['value1'] != null) {
                    $rangeTable = $dateRange['table'];
                    $rangeColumn = $dateRange['column'];
                    if (isset($this->advancedSearch['dateMode']) && $this->advancedSearch['dateMode'] == 'dateTime')
                        $table_data->where("$rangeTable.$rangeColumn", ">=", $dateRange['value1'] . " 00:00:00");
                    else
                        $table_data->where("$rangeTable.$rangeColumn", ">=", $dateRange['value1']);


                }
                if ($dateRange['value2'] != null) {
                    $rangeTable = $dateRange['table'];
                    $rangeColumn = $dateRange['column'];
                    if (isset($this->advancedSearch['dateMode']) && $this->advancedSearch['dateMode'] == 'dateTime')
                        $table_data->where("$rangeTable.$rangeColumn", "<=", $dateRange['value2'] . " 23:59:59");
                    else
                        $table_data->where("$rangeTable.$rangeColumn", "<=", $dateRange['value2']);


                }
            }

        }

        if (isset($advancedSearch['dateYearMonth']) && $this->advancedSearch['dateYearMonth']['searchColumn'] != null) {
            if (isset($advancedSearch['dateYearMonth']['defaultYear']) && isset($advancedSearch['dateYearMonth']['defaultMonth']))
                $searchColumn = $this->advancedSearch['dateYearMonth']['searchColumn'];
            $s_year = $advancedSearch['dateYearMonth']['defaultYear'];
            $s_month = $advancedSearch['dateYearMonth']['defaultMonth'];
            $s_last_day = cal_days_in_month(CAL_GREGORIAN, $s_month, $s_year);

            if (isset($this->advancedSearch['dateMode']) && $this->advancedSearch['dateMode'] == 'dateTime')
                $table_data
                    ->where("$searchColumn", ">=", "$s_year-$s_month-01 00:00:00")
                    ->where("$searchColumn", "<=", "$s_year-$s_month-$s_last_day 23:59:59");
            else
                $table_data
                    ->where("$searchColumn", ">=", "$s_year-$s_month-01")
                    ->where("$searchColumn", "<=", "$s_year-$s_month-$s_last_day");

        }


//        return $table_data->toSql();

        return $table_data->paginate($pageLimit);

    }

    public function gridListByStoredProcedure()
    {


        return;

    }

    public function get_data($formControls)
    {
        if ($this->permission['u'] == false && $this->permission['r'] == false && $this->permission['c'] === false)
            return Response::json('permission denied', 400);

        $FormData = [];


        foreach ($formControls as $formControl) {
            if ($formControl['type'] == '--combogrid') {

                $options = $formControl['options'];
                $order = explode(" ", $options['grid_default_order_by']);
                $data = DB::table($options['table'])->select($options['grid_columns'])->orderBy($order[0], $order[1]);


                $data->paginate(20);

                $data = $data->toArray();

                $FormData[$formControl['column']] = ['data' => $data, 'form_input_control' => $options['form_input_control'], 'text' => null];

                //  print_r($data);
                //->take($this->pageLimit)->get()

            }
            if ($formControl['type'] == '--combobox' || $formControl['type'] == '--tag' || $formControl['type'] == '--combobox-addable') {

                $options = $formControl['options'];

                if (isset($options['load_options'])) {
                    $data['data'] = [];

                    $FormData[$formControl['column']] = ['data' => $data];
                } else {
                    //                if(isset($options['parent'])){
//                    $FormData[$formControl['column']] = ['data'=>['data'=>[]]];
//
//                } else{
                    $order = explode(" ", $options['grid_default_order_by']);

                    $pre_data = DB::table($options['table'])->select($options['grid_columns'])->orderBy($order[0], $order[1]);

                    if (isset($options['where_condition'])) {

                        foreach ($options['where_condition'] as $where_condition) {

                            if (isset($where_condition[3]) && $where_condition[3] == 'or') {

                                $pre_data->orWhere($where_condition[0], $where_condition[1], $where_condition[2]);
                            } else {
                                $pre_data->where($where_condition[0], $where_condition[1], $where_condition[2]);
                            }

                        }
                    }

                    if (isset($options['where_condition_raw'])) {

                        foreach ($options['where_condition_raw'] as $where_condition_raw) {


                            $pre_data->whereRaw($where_condition_raw);


                        }
                    }


                    $data['data'] = $pre_data->get();


                    $FormData[$formControl['column']] = ['data' => $data];
//                }
                }


            }
            if ($formControl['type'] == '--combobox-addable') {
                $options = $formControl['options'];


                $comboAddAbleFC = $options['form_input_control'];


                $FormData_pre = $this->get_data($comboAddAbleFC);


                $FormData = array_merge($FormData, $FormData_pre);


            }
            if ($formControl['type'] == '--group') {
                $controls = $formControl['controls'];


                $FormData_pre = $this->get_data($controls);


                $FormData = array_merge($FormData, $FormData_pre);


            }

        }

        return $FormData;
    }

    public function get_form_datas()
    {
        if ($this->permission['u'] == false && $this->permission['r'] == false && $this->permission['c'] === false)
            return [];
//            return Response::json('permission denied', 400);


        $FormData = [];

        $extra = $this->get_data($this->grid_extra_data);

        if ($this->formType == 'inline')
            $FormData_pre = $this->get_data($this->grid_output_control);
        else
            $FormData_pre = $this->get_data($this->form_input_control);

        $FormData = array_merge($FormData, $FormData_pre);

        $FormData_pre = $this->get_data($this->grid_output_control);
        $FormData = array_merge($FormData, $FormData_pre);


        if (count($this->multi_items_form_input_control) >= 1) {

            $FormData_pre_multi = $this->get_data($this->multi_items_form_input_control);

            $FormData = array_merge($FormData, $FormData_pre_multi);
        }


        if (count($this->subItems) >= 1) {
            foreach ($this->subItems as $subItem) {


                $FormData_pre_sub = $this->get_data($subItem['form_input_control']);


                $FormData = array_merge($FormData, $FormData_pre_sub);
            }
        }

        $FormData = array_merge($FormData, $extra);




        return $FormData;

    }

    public function edit()
    {

        if (empty($this->ifUpdateDisabledCanEditColumns))
            if ($this->permission['u'] != true && $this->just_info == false)
                return Response::json('permission denied', 400);

        $id = Request::input('id');

        /// saijruulah

        $table_data = DB::table($this->table)->where($this->table . "." . $this->identity_name, '=', $id);
        $table_data->select($this->table . "." . $this->identity_name);

        if (count($this->multi_items_form_input_control) >= 1) {
            $table_data->addSelect($this->table . "." . $this->save_first_id_column);
        }


        $options = null;
        foreach ($this->form_input_control as $formControl) {

            if (isset($formControl['column'])) {
                if ($formControl['type'] == '--password-confirm' || $formControl['type'] == '--password') {

                } else
                    $table_data->addSelect("$this->table." . $formControl['column']);
            }


//            if($formControl['type'] == '--combogrid' || $formControl['type'] == '--combobox' || $formControl['type'] == '--tag' || $formControl['type'] == '--combobox-addable' || $formControl['type'] == '--combobox-hidden'){
//
//                $options = $formControl['options'];
//
//                $table_data->join($options['table'], "$this->table." . $formControl['column'], '=', $options['table']. "." .$options['valueField']);
//
//
//            }

            if ($formControl['type'] == '--group') {
                foreach ($formControl['controls'] as $subformControl) {

                    if (isset($subformControl['column']))
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


        foreach ($this->translate_form_input_control as $t_f_c) {
            $table_data->addSelect("$this->table." . $t_f_c['column']);
        }

        $e_data = $table_data->get();

        if (count($this->multi_items_form_input_control) >= 1) {

            $e_pre =  (array)$e_data[0];

            Session::set('first_id', $e_pre[$this->save_first_id_column]);
        }
        return $e_data;

    }

    public function getRule($form_input_control, $id = false)
    {
        $rules = [];

        foreach ($form_input_control as $form_control) {
            if (isset($form_control['show'])) {

            } else
                if (isset($form_control['validate'])) {
                    $validation = str_replace("number", "numeric", $form_control['validate']);
                    if ($id != false && strstr($validation, "unique")) {
                        $validation = str_replace("NULL", $id, $validation);

//                    dd($validation);
                    }


                    $rules[$form_control['column']] = $validation;
                }
        }

        return $rules;

    }

    public function beforeInsertCaller($before_insert, $insertQuery)
    {

        $controller = $before_insert['controller'];
        $function = $before_insert['function'];
        $arguments = $before_insert['arguments'];
        $arguments['insert_values'] = $insertQuery;

        return app($controller)->$function($arguments);

    }

    public function beforeUpdateCaller($before_update, $insertQuery)
    {

        $controller = $before_update['controller'];
        $function = $before_update['function'];
        $arguments = $before_update['arguments'];
        $arguments['insert_values'] = $insertQuery;

        return app($controller)->$function($arguments);

    }

    public function responseCaller($insert_response_function, $insertQuery)
    {

        $controller = $insert_response_function['controller'];
        $function = $insert_response_function['function'];
        return app($controller)->$function($insertQuery);

    }

    public function insert()
    {


        if ($this->permission['c'] != true || $this->just_info == true)
            return Response::json('permission denied', 400);


        $formData = Request::input('data');
        $translateData = Request::input('translateData');
        $multiItems = Request::input('multiItems');

        $rules = [];
        
        $insertQuery = $this->hidden_values;
        foreach ($this->form_input_control as $formControl) {

            if ($formControl['type'] == '--group') {
                $rules_pre = $this->getRule($formControl['controls']);
                $rules = array_merge($rules, $rules_pre);
                foreach ($formControl['controls'] as $subformControl) {
                    if ($subformControl['type'] == '--group') {

                    } else {
                        if ($subformControl['type'] == '--checkbox') {
                            $checkBoxValue = $formData[$subformControl['column']];
                            if ($checkBoxValue == 1)
                                $checkBoxValue = 1;
                            else
                                $checkBoxValue = 0;
                            $insertQuery[$subformControl['column']] = $checkBoxValue;

                        } else
                            $insertQuery[$subformControl['column']] = $formData[$subformControl['column']];
                    }


                }
            } else {
                if ($formControl['type'] == '--checkbox') {
                    $checkBoxValue = $formData[$formControl['column']];
                    if ($checkBoxValue == 1)
                        $checkBoxValue = 1;
                    else
                        $checkBoxValue = 0;
                    $insertQuery[$formControl['column']] = $checkBoxValue;

                } elseif ($formControl['type'] == '--password') {
                    $insertQuery[$formControl['column']] = bcrypt($formData[$formControl['column']]);
                } elseif ($formControl['type'] == '--password-confirm') {
//                          /  $insertQuery[$formControl['column']] = bcrypt($multiItem[$formControl['column']]);
                } else
                    $insertQuery[$formControl['column']] = $formData[$formControl['column']];
            }

        }

        $rules_pre = $this->getRule($this->form_input_control);
        $rules = array_merge($rules, $rules_pre);


        // transltation table save action
        if (!empty($this->translate_form_input_control)) {

            $rules_pre = $this->getRule($this->translate_form_input_control);
            $rules = array_merge($rules, $rules_pre);

            foreach ($this->translate_form_input_control as $translationformControl) {
                $translationformControl['trans_value'] = [];
                foreach ($translateData as $translate) {
                    $translate_value = [];

                    $translate_value['locale'] = $translate['locale'];


                    if ($translationformControl['type'] == '--checkbox') {
                        $checkBoxValue = $formData[$translationformControl['column']];
                        if ($checkBoxValue == 1)
                            $checkBoxValue = 1;
                        else
                            $checkBoxValue = 0;


                        $translate_value['value'] = $checkBoxValue;

                    } else
                        $translate_value['value'] = $translate['data'][$translationformControl['column']];

                    $translationformControl['trans_value'][] = $translate_value;
                }


                $insertQuery[$translationformControl['column']] = json_encode($translationformControl['trans_value']);


            }


        }


        //subitems count
        if (!empty($this->save_sub_items_count)) {
            $posted_sub_items = Request::input('subItems');

            foreach ($posted_sub_items as $posted_sub_item) {
                if ($posted_sub_item['connect_column'] == $this->save_sub_items_count['child_connect_column']) {
                    $subitmesCount = count($posted_sub_item['items']);

                    $insertQuery[$this->save_sub_items_count['parent_column']] = $subitmesCount;
                }
            }

        }

        //timestamp
        if ($this->created_at != null)
            $insertQuery[$this->created_at] = \Carbon\Carbon::now();
        if ($this->updated_at != null)
            $insertQuery[$this->updated_at] = \Carbon\Carbon::now();


        $response = null;
        //multi items
        if (!empty($this->multi_items_form_input_control)) {
            $rules_pre = $this->getRule($this->multi_items_form_input_control);
            $rules = array_merge($rules, $rules_pre);
            $checkFirst = 0;
            $insertedId = null;

            foreach ($multiItems as $multiItem) {


                foreach ($this->multi_items_form_input_control as $formControl) {

                    if ($formControl['type'] == '--group') {
                        foreach ($formControl['controls'] as $subformControl) {
                            if ($subformControl['type'] == '--group') {

                            } else {
                                if ($subformControl['type'] == '--checkbox') {
                                    $checkBoxValue = $multiItem[$subformControl['column']];
                                    if ($checkBoxValue == 1)
                                        $checkBoxValue = 1;
                                    else
                                        $checkBoxValue = 0;
                                    $insertQuery[$subformControl['column']] = $checkBoxValue;

                                } else
                                    $insertQuery[$subformControl['column']] = $multiItem[$subformControl['column']];
                            }


                        }
                    } else {
                        if ($formControl['type'] == '--checkbox') {
                            $checkBoxValue = $multiItem[$formControl['column']];
                            if ($checkBoxValue == 1)
                                $checkBoxValue = 1;
                            else
                                $checkBoxValue = 0;
                            $insertQuery[$formControl['column']] = $checkBoxValue;

                        } elseif ($formControl['type'] == '--password') {
                            $insertQuery[$formControl['column']] = bcrypt($multiItem[$formControl['column']]);
                        } elseif ($formControl['type'] == '--password-confirm') {
//                          /  $insertQuery[$formControl['column']] = bcrypt($multiItem[$formControl['column']]);
                        } else
                            $insertQuery[$formControl['column']] = $multiItem[$formControl['column']];
                    }

                }

                if ($checkFirst == 0) {

                  

                    $validator = Validator::make($insertQuery, $rules);
                    if ($validator->fails()) {
                        return Response::json(
                            ['errors' => [$validator->messages()]
                            ], 400);
                    }

                    if ($this->before_insert != null) {
                        $pre_values = $this->beforeInsertCaller($this->before_insert, $insertQuery);

                        if ($pre_values == 'success') {
                            return Response::json('success', 200);
                        } elseif ($pre_values == 'fail') {
                            return Response::json('before insert error', 400);
                        } else
                            $insertQuery = array_merge($insertQuery, $pre_values);
                    }


                    $saved = DB::table($this->table)->insert($insertQuery);
                    $insertedId = DB::getPdo()->lastInsertId();

                    $firstItem[$this->save_first_id_column] = $insertedId;

                    DB::table($this->table)->where($this->identity_name, '=', $insertedId)->update($firstItem);

                } else {
                    
                    $insertQuery[$this->save_first_id_column] = $insertedId;

                    $validator = Validator::make($insertQuery, $rules);
                    if ($validator->fails()) {
                        return Response::json(
                            ['errors' => [$validator->messages()]
                            ], 400);
                    }

                    if ($this->before_insert != null) {
                        $pre_values = $this->beforeInsertCaller($this->before_insert, $insertQuery);

                        if ($pre_values == 'success') {
                            return Response::json('success', 200);
                        } elseif ($pre_values == 'fail') {
                            return Response::json('before insert error', 400);
                        } else
                            $insertQuery = array_merge($insertQuery, $pre_values);
                    }

                    $saved = DB::table($this->table)->insert($insertQuery);
                }

                $checkFirst++;
            }

            $saved = true;

        } else {

            $validator = Validator::make($insertQuery, $rules);
            if ($validator->fails()) {
                return Response::json(
                    ['errors' => [$validator->messages()]
                    ], 400);
            }


            if ($this->before_insert != null) {
                $pre_values = $this->beforeInsertCaller($this->before_insert, $insertQuery);

                if ($pre_values == 'success') {
                    return Response::json('success', 200);
                } elseif ($pre_values == 'fail') {
                    return Response::json('before insert error', 400);
                } else
                    $insertQuery = array_merge($insertQuery, $pre_values);
            }


            $saved = DB::table($this->table)->insert($insertQuery);
            $insertedId = DB::getPdo()->lastInsertId();

        }


        if (count($this->subItems) >= 1)
            $this->saveSubItems($insertedId, $this->subItems, Request::input('subItems'));

        if ($this->generateLocaleFile == true) {
            $this->generateLocale();
        }


        if ($saved) {
            if ($this->insert_response_function == null)
                return Response::json('success', 200);
            else {

                $insertQuery['insertedId'] = $insertedId;
                return $this->responseCaller($this->insert_response_function, $insertQuery);
            }
        } else {
            return Response::json('error', 400);;
        }

    }


    public function update()
    {
        if (empty($this->ifUpdateDisabledCanEditColumns))
            if ($this->permission['u'] != true || $this->just_info == true)
                return Response::json('permission denied', 400);


        $formData = Request::input('data');
        $id = Request::input('id');
        $translateData = Request::input('translateData');
        $multiItems = Request::input('multiItems');

        $rules = [];

        if (count($this->form_input_control) <= 0) {

        }

        $insertQuery = $this->hidden_values;
        foreach ($this->form_input_control as $formControl) {
            if ($this->permission['u'] != true) {
                if (count($this->ifUpdateDisabledCanEditColumns) >= 1) {

                    foreach ($this->ifUpdateDisabledCanEditColumns as $ifUpdateDisabledCanEditColumn) {

                        if ($formControl['type'] == '--group') {
                            foreach ($formControl['controls'] as $subformControl) {
                                if ($subformControl['type'] == '--group') {

                                } else {
                                    if ($subformControl['type'] == '--checkbox') {
                                        $checkBoxValue = $formData[$subformControl['column']];
                                        if ($checkBoxValue == 1)
                                            $checkBoxValue = 1;
                                        else
                                            $checkBoxValue = 0;
                                        $insertQuery[$subformControl['column']] = $checkBoxValue;

                                    } else
                                        $insertQuery[$subformControl['column']] = $formData[$subformControl['column']];
                                }

                            }
                        } else {
                            if ($ifUpdateDisabledCanEditColumn == $formControl['column']) {

                                if ($formControl['type'] == '--checkbox') {
                                    $checkBoxValue = $formData[$formControl['column']];
                                    if ($checkBoxValue == 1)
                                        $checkBoxValue = 1;
                                    else
                                        $checkBoxValue = 0;
                                    $insertQuery[$formControl['column']] = $checkBoxValue;

                                } elseif ($formControl['type'] == '--password') {
                                    $insertQuery[$formControl['column']] = bcrypt($formData[$formControl['column']]);
                                } elseif ($formControl['type'] == '--password-confirm') {
//                          /  $insertQuery[$formControl['column']] = bcrypt($multiItem[$formControl['column']]);
                                } else
                                    $insertQuery[$formControl['column']] = $formData[$formControl['column']];
                            }
                        }
                    }
                }

            } else {
                if ($formControl['type'] == '--group') {
                    $rules_pre = $this->getRule($formControl['controls'], $id);
                    $rules = array_merge($rules, $rules_pre);
                    foreach ($formControl['controls'] as $subformControl) {
                        if ($subformControl['type'] == '--group') {

                        } else {
                            if ($subformControl['type'] == '--checkbox') {
                                $checkBoxValue = $formData[$subformControl['column']];
                                if ($checkBoxValue == 1)
                                    $checkBoxValue = 1;
                                else
                                    $checkBoxValue = 0;
                                $insertQuery[$subformControl['column']] = $checkBoxValue;

                            } else
                                $insertQuery[$subformControl['column']] = $formData[$subformControl['column']];
                        }

                    }
                } else {
                    if ($formControl['type'] == '--checkbox') {
                        $checkBoxValue = $formData[$formControl['column']];
                        if ($checkBoxValue == 1)
                            $checkBoxValue = 1;
                        else
                            $checkBoxValue = 0;
                        $insertQuery[$formControl['column']] = $checkBoxValue;

                    } elseif ($formControl['type'] == '--password') {
                        $insertQuery[$formControl['column']] = bcrypt($formData[$formControl['column']]);
                    } elseif ($formControl['type'] == '--password-confirm') {
//                          /  $insertQuery[$formControl['column']] = bcrypt($multiItem[$formControl['column']]);
                    } else
                        $insertQuery[$formControl['column']] = $formData[$formControl['column']];

                }


            }

        }
        $rules_pre = $this->getRule($this->form_input_control, $id);
        $rules = array_merge($rules, $rules_pre);

        // transltation table save action
        if (!empty($this->translate_form_input_control)) {

            $rules_pre = $this->getRule($this->translate_form_input_control, $id);
            $rules = array_merge($rules, $rules_pre);

            foreach ($this->translate_form_input_control as $translationformControl) {
                $translationformControl['trans_value'] = [];
                foreach ($translateData as $translate) {
                    $translate_value = [];

                    $translate_value['locale'] = $translate['locale'];


                    if ($translationformControl['type'] == '--checkbox') {
                        $checkBoxValue = $formData[$translationformControl['column']];
                        if ($checkBoxValue == 1)
                            $checkBoxValue = 1;
                        else
                            $checkBoxValue = 0;


                        $translate_value['value'] = $checkBoxValue;

                    } else
                        $translate_value['value'] = $translate['data'][$translationformControl['column']];

                    $translationformControl['trans_value'][] = $translate_value;
                }


                $insertQuery[$translationformControl['column']] = json_encode($translationformControl['trans_value']);


            }


        }

        if (!empty($this->save_sub_items_count)) {
            $posted_sub_items = Request::input('subItems');

            foreach ($posted_sub_items as $posted_sub_item) {
                if ($posted_sub_item['connect_column'] == $this->save_sub_items_count['child_connect_column']) {
                    $subitmesCount = count($posted_sub_item['items']);

                    $insertQuery[$this->save_sub_items_count['parent_column']] = $subitmesCount;
                }
            }

        }

        // timestamp
        if ($this->updated_at != null)
            $insertQuery[$this->updated_at] = \Carbon\Carbon::now();


        $response = null;


        //multi items
        if (!empty($this->multi_items_form_input_control)) {
            $checkFirst = 0;
            $insertedId = null;

            $rules_pre = $this->getRule($this->multi_items_form_input_control, $id);
            $rules = array_merge($rules, $rules_pre);

            foreach ($multiItems as $multiItem) {

                foreach ($this->multi_items_form_input_control as $formControl) {

                    if ($formControl['type'] == '--group') {
                        foreach ($formControl['controls'] as $subformControl) {
                            if ($subformControl['type'] == '--group') {

                            } else {
                                if ($subformControl['type'] == '--checkbox') {
                                    $checkBoxValue = $multiItem[$subformControl['column']];
                                    if ($checkBoxValue == 1)
                                        $checkBoxValue = 1;
                                    else
                                        $checkBoxValue = 0;
                                    $insertQuery[$subformControl['column']] = $checkBoxValue;

                                } else
                                    $insertQuery[$subformControl['column']] = $multiItem[$subformControl['column']];
                            }

                        }
                    } else {
                        if ($formControl['type'] == '--checkbox') {
                            $checkBoxValue = $multiItem[$formControl['column']];
                            if ($checkBoxValue == 1)
                                $checkBoxValue = 1;
                            else
                                $checkBoxValue = 0;
                            $insertQuery[$formControl['column']] = $checkBoxValue;

                        } elseif ($formControl['type'] == '--password') {
                            $insertQuery[$formControl['column']] = bcrypt($multiItem[$formControl['column']]);
                        } elseif ($formControl['type'] == '--password-confirm') {
//                          /  $insertQuery[$formControl['column']] = bcrypt($multiItem[$formControl['column']]);
                        } else
                            $insertQuery[$formControl['column']] = $multiItem[$formControl['column']];
                    }

                }


                if (!$multiItem[$this->identity_name]) {

                    $insertQuery[$this->save_first_id_column] = Session::get('first_id');

                    if ($this->before_update != null) {
                        $pre_values = $this->beforeUpdateCaller($this->before_update, $insertQuery);

                        if ($pre_values == 'success') {
                            return Response::json('success', 200);
                        } elseif ($pre_values == 'fail') {
                            return Response::json('before updated error', 400);
                        } else
                            $insertQuery = array_merge($insertQuery, $pre_values);
                    }

                    $validator = Validator::make($insertQuery, $rules);
                    if ($validator->fails()) {
                        return Response::json(
                            ['errors' => [$validator->messages()]
                            ], 400);
                    }

                    $saved = DB::table($this->table)->insert($insertQuery);


                } else {

                    $insertQuery[$this->save_first_id_column] = Session::get('first_id');

                    if ($this->before_update != null) {
                        $pre_values = $this->beforeUpdateCaller($this->before_update, $insertQuery);

                        if ($pre_values == 'success') {
                            return Response::json('success', 200);
                        } elseif ($pre_values == 'fail') {
                            return Response::json('before updated error', 400);
                        } else
                            $insertQuery = array_merge($insertQuery, $pre_values);
                    }

                    $validator = Validator::make($insertQuery, $rules);
                    if ($validator->fails()) {
                        return Response::json(
                            ['errors' => [$validator->messages()]
                            ], 400);
                    }

                    $saved = DB::table($this->table)->where("$this->identity_name", '=', $multiItem[$this->identity_name])->update($insertQuery);
                }

                $checkFirst++;
            }

            $saved = true;
        } else {

            if ($this->before_update != null) {
                $pre_values = $this->beforeUpdateCaller($this->before_update, $insertQuery);

                if ($pre_values == 'success') {
                    return Response::json('success', 200);
                } elseif ($pre_values == 'fail') {
                    return Response::json('before updated error', 400);
                } else
                    $insertQuery = array_merge($insertQuery, $pre_values);
            }


            $validator = Validator::make($insertQuery, $rules);
            if ($validator->fails()) {
                return Response::json(
                    ['errors' => [$validator->messages()]
                    ], 400);
            }


            $saved = DB::table($this->table)->where("$this->identity_name", '=', $id)->update($insertQuery);
        }


        if (count($this->subItems) >= 1)
            $this->saveSubItems($id, $this->subItems, Request::input('subItems'));

        if ($this->generateLocaleFile == true) {
            $this->generateLocale();
            $this->generateLocalePhp();
        }

        if ($saved == true || $saved == 'none') {
            if ($this->insert_response_function == null)
                return Response::json('success', 200);
            else {
                return $this->responseCaller($this->insert_response_function, $insertQuery);
            }
          
            
        } else {
            return Response::json('error', 400);
        }


    }


    public function update_grid()
    {
        return 'update_grid';
    }

    public function delete()
    {
        if ($this->permission['d'] != true || $this->just_info == true)
            return Response::json('permission denied', 400);

        $id = Request::input('id');

        if ($this->before_delete != null) {

            $controller = $this->before_delete['controller'];
            $function = $this->before_delete['function'];

            $customErrorMessage = app($controller)->$function($id);

            if ($customErrorMessage != '') {
                return $customErrorMessage;
            }

        }

        $deleted = DB::table($this->table)->where("$this->identity_name", '=', $id)->delete();

        if ($deleted)
            return 'success';
        else
            return 'error';

    }


    public function create_grid_from_fields($columns)
    {

        if (count($this->form_input_control) <= 0) {

            foreach ($columns as $column) {

                $column_name = $column['name'];
                $type = $column['type'];


                if ($type == 'date') {
                    $this->form_input_control[] = ['column' => $column_name, 'title' => $column_name, 'type' => '--date', 'validate' => ''];
                    $this->grid_output_control[] = ['column' => $column_name, 'title' => $column_name, 'type' => '--date'];
                } elseif ($type == 'datetime' || $type == 'timestamp') {
                    $this->form_input_control[] = ['column' => $column_name, 'title' => $column_name, 'type' => '--datetime', 'validate' => ''];
                    $this->grid_output_control[] = ['column' => $column_name, 'title' => $column_name, 'type' => '--datetime'];
                } elseif ($type == 'blob')
                    $this->form_input_control[] = ['column' => $column_name, 'title' => $column_name, 'type' => '--textarea', 'validate' => ''];
                elseif ($type == 'tinyint(1)') {
                    $this->form_input_control[] = ['column' => $column_name, 'title' => $column_name, 'type' => '--checkbox', 'value' => false, 'validate' => ''];
                    $this->grid_output_control[] = ['column' => $column_name, 'title' => $column_name, 'type' => '--checkbox'];
                } elseif (mb_strstr($type, 'short') || mb_strstr($type, 'int') || mb_strstr($type, 'long') || mb_strstr($type, 'float') || mb_strstr($type, 'double') || mb_strstr($type, 'decimal')) {
                    $this->grid_output_control[] = ['column' => $column_name, 'title' => $column_name, 'type' => '--number', 'validate' => ''];
                    $this->form_input_control[] = ['column' => $column_name, 'title' => $column_name, 'type' => '--number', 'value' => null];
                } elseif (mb_strstr($type, 'varchar')) {

                    $this->form_input_control[] = ['column' => $column_name, 'title' => $column_name, 'type' => '--text', 'value' => '', 'validate' => ''];
                    $this->grid_output_control[] = ['column' => $column_name, 'title' => $column_name, 'type' => '--text'];
                }


            }
        } else {
            foreach ($columns as $column) {

                $column_name = $column['name'];
                $type = $column['type'];


                if ($type == 'date')
                    $this->grid_output_control[] = ['column' => $column_name, 'title' => $column_name, 'type' => '--date'];

                elseif ($type == 'datetime' || $type == 'timestamp')
                    $this->grid_output_control[] = ['column' => $column_name, 'title' => $column_name, 'type' => '--datetime'];
                elseif ($type == 'tinyint(1)')
                    $this->grid_output_control[] = ['column' => $column_name, 'title' => $column_name, 'type' => '--checkbox'];
                elseif (mb_strstr($type, 'short') || mb_strstr($type, 'int') || mb_strstr($type, 'long') || mb_strstr($type, 'float') || mb_strstr($type, 'double') || mb_strstr($type, 'decimal'))
                    $this->grid_output_control[] = ['column' => $column_name, 'title' => $column_name, 'type' => '--number'];
                elseif (mb_strstr($type, 'varchar'))
                    $this->grid_output_control[] = ['column' => $column_name, 'title' => $column_name, 'type' => '--text'];


            }
        }


        $form_input_controll = [];
        foreach ($this->form_input_control as $form_controll) {
            $form_controll['error'] = null;
            $form_input_controll[] = $form_controll;
        }

        return ['form_input_control' => $form_input_controll, 'grid_output_control' => $this->grid_output_control];
    }

    /*combo Sync*/
    public function comboSync()
    {
        $input = Request::input('input');
        $column = Request::input('column');

        $data = [];

        foreach ($this->form_input_control as $formControl) {

            if ($formControl['column'] == $column) {

                $options = $formControl['options'];

                $order = explode(" ", $options['grid_default_order_by']);

                $pre_data = DB::table($options['table'])->select($options['grid_columns'])->orderBy($order[0], $order[1]);

                if (isset($options['where_condition'])) {

                    foreach ($options['where_condition'] as $where_condition) {

                        if (isset($where_condition[3]) && $where_condition[3] == 'or') {

                            $pre_data->orWhere($where_condition[0], $where_condition[1], $where_condition[2]);
                        } else {
                            $pre_data->where($where_condition[0], $where_condition[1], $where_condition[2]);
                        }

                    }
                }

                if (isset($options['where_condition_raw'])) {

                    foreach ($options['where_condition_raw'] as $where_condition_raw) {


                        $pre_data->whereRaw($where_condition_raw);


                    }
                }
                $pre_data->where(function ($query) use ($input, $options) {
                    $loop = 0;

                    foreach ($options['textField'] as $sw) {
                        if ($loop == 0)
                            $query->where($sw, 'LIKE', "%$input%");
                        else
                            $query->orwhere($sw, 'LIKE', "%$input%");
                        $loop++;
                    }

                    return $query;
                });


                $data = $pre_data->get();


            }
        }

        return $data;
    }

    /* combo grid*/
    public function gridComboGrid()
    {

        $column = Request::input('column');
        $searchValue = Request::input('searchValue');

        foreach ($this->form_input_control as $formControl) {
            if ($formControl['type'] == '--combogrid' && $formControl['column'] == $column) {

                $options = $formControl['options'];
                $order = explode(" ", $options['grid_default_order_by']);
                $table_data = DB::table($options['table'])->select($options['grid_columns'])->orderBy($order[0], $order[1]);

                if ($searchValue != '') {


                    if (count($this->where_condition) >= 1) {
                        dd('aaa');
                        foreach ($this->where_condition as $where_condition) {


                            $table_data->where($where_condition[0], $where_condition[1], $where_condition[2]);


                        }
                        $loop = 0;
                        foreach ($options['grid_columns'] as $sw) {
                            if ($loop == 0)
                                $table_data->where($sw, 'LIKE', "%$searchValue%");
                            else
                                $table_data->orwhere($sw, 'LIKE', "%$searchValue%");
                            $loop++;
                        }
                    } else {
                        $loop = 0;
                        foreach ($options['grid_columns'] as $sw) {
                            if ($loop == 0)
                                $table_data->where($sw, 'LIKE', "%$searchValue%");
                            else
                                $table_data->orwhere($sw, 'LIKE', "%$searchValue%");
                            $loop++;
                        }
                    }
                }


            }
        }

        return $table_data->paginate(20);

    }

    public function editComboGrid()
    {
        $id = Request::input('id');
        $column = Request::input('column');

        /// saijruulah
        $options = null;
        foreach ($this->form_input_control as $formControl) {
            if ($formControl['type'] == '--combogrid' && $formControl['column'] == $column) {

                $options = $formControl['options'];


            }
        }

        $table_data = DB::table($options['table'])->where('id', '=', $id)->select($options['grid_columns'])->get();


        return $table_data;

    }

    public function insertComboGrid()
    {
        $formData = Request::input('data');
        $column = Request::input('column');

        $options = null;
        foreach ($this->form_input_control as $formControl) {
            if ($formControl['type'] == '--combogrid' && $formControl['column'] == $column) {

                $options = $formControl['options'];


            }


        }


        $insertQuery = [];
        foreach ($options['form_input_control'] as $formControl) {
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

        $saved = DB::table($options['table'])->insert($insertQuery);

        $response = null;
        if ($saved) {
            $response = 'success';
        } else {
            $response = "error";
        }
        return $response;


    }

    public function updateComboGrid()
    {
        $formData = Request::input('data');
        $id = Request::input('id');

        $column = Request::input('column');

        $options = null;
        foreach ($this->form_input_control as $formControl) {
            if ($formControl['type'] == '--combogrid' && $formControl['column'] == $column) {

                $options = $formControl['options'];


            }


        }

        $insertQuery = [];
        foreach ($options['form_input_control'] as $formControl) {
            if ($formControl['type'] == '--checkbox') {
                $checkBoxValue = $formData[$formControl['column']];
                if ($checkBoxValue == 'true')
                    $checkBoxValue = 1;
                else
                    $checkBoxValue = 0;
                $insertQuery[$formControl['column']] = $checkBoxValue;

            } else
                $insertQuery[$formControl['column']] = $formData[$formControl['column']];
        }

        $saved = DB::table($options['table'])->where('id', '=', $id)->update($insertQuery);

        $response = null;
        if ($saved) {
            $response = 'success';
        } else {
            $response = "none";
        }
        return $response;
    }

    public function deleteComboGrid()
    {
        if ($this->permission['d'] == true) {
            $id = Request::input('id');

            $column = Request::input('column');

            $options = null;
            foreach ($this->form_input_control as $formControl) {
                if ($formControl['type'] == '--combogrid' && $formControl['column'] == $column) {

                    $options = $formControl['options'];


                }


            }

            $deleted = DB::table($options['table'])->where('id', '=', $id)->delete();

            if ($deleted)
                return 'success';
            else
                return 'error';
        }

    }


    /*
     * Combox add able
     * */
    public function insertCombAddAble()
    {
        $formData = Request::input('data');
        $column = Request::input('column');

        $insertQuery = [];
        if (isset($formControl['options']['hidden'])) {
            $insertQuery = $formControl['options']['hidden'];
        }
        $table = '';
        foreach ($this->form_input_control as $formControl) {
            if ($formControl['type'] == '--combobox-addable' && $formControl['column'] == $column) {

                $form_input_control = $formControl['options']['form_input_control'];
                $table = $formControl['options']['table'];

                foreach ($form_input_control as $formControl2) {
                    if ($formControl2['type'] == '--group') {
                        foreach ($formControl2['controls'] as $subformControl) {
                            if ($subformControl['type'] == '--group') {

                            } else {
                                if ($subformControl['type'] == '--checkbox') {
                                    $checkBoxValue = $formData[$subformControl['column']];
                                    if ($checkBoxValue == 1)
                                        $checkBoxValue = 1;
                                    else
                                        $checkBoxValue = 0;
                                    $insertQuery[$subformControl['column']] = $checkBoxValue;

                                } else
                                    $insertQuery[$subformControl['column']] = $formData[$subformControl['column']];
                            }

                        }
                    } else {
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

        if ($table != '')
            $saved = DB::table($table)->insert($insertQuery);
        else
            $saved = false;


        if (!$saved) {
            $insertQuery = [];
            $table = '';
            foreach ($this->subItems as $subItem) {

                foreach ($subItem['form_input_control'] as $SformControl) {


                    if ($SformControl['type'] == '--combobox-addable') {


                        $form_input_control = $SformControl['options']['form_input_control'];
                        $table = $SformControl['options']['table'];

                        foreach ($form_input_control as $formControl2) {
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
            $saved = DB::table($table)->insert($insertQuery);
        }

        $response = null;
        if ($saved) {
            $response = 'success';
        } else {
            $response = "error";
        }
        return $response;
    }

    public function comboList()
    {
        $column = Request::input('column');

        $table = '';
        $table_data = null;

        foreach ($this->form_input_control as $formControl) {
            if ($formControl['type'] == '--combobox-addable' && $formControl['column'] == $column) {

                $table = $formControl['options']['table'];
                $grid_columns = $formControl['options']['grid_columns'];
                $order = explode(" ", $formControl['options']['grid_default_order_by']);

                $table_data = DB::table($table)->select($grid_columns)->orderBy($order[0], $order[1])->get();


            }

        }

        if (count($this->subItems) >= 1 && $table_data == null) {
            foreach ($this->subItems as $subItem) {

                foreach ($subItem['form_input_control'] as $SformControl) {


                    if ($SformControl['type'] == '--combobox-addable') {


                        $table = $SformControl['options']['table'];
                        $grid_columns = $SformControl['options']['grid_columns'];
                        $order = explode(" ", $SformControl['options']['grid_default_order_by']);

                        $table_data = DB::table($table)->select($grid_columns)->orderBy($order[0], $order[1])->get();


                    }

                }
            }
        }

        return $table_data;


    }


    /*sub items*/
    public function saveSubItems($parentId, $thisSubItems, $subItems)
    {
        foreach ($thisSubItems as $subItem) {

            foreach ($subItems as $subItem_posted) {
                if ($subItem_posted['connect_column'] == $subItem['connect_column']) {
                    if (isset($subItem_posted['items'])) {
                        foreach ($subItem_posted['items'] as $item) {
                            $insertQuery = [];
                            $insertQuery[$subItem['connect_column']] = $parentId;
                            $table = $subItem['table'];
                            $formData = $item;
                            foreach ($subItem['form_input_control'] as $formControl) {
                                if ($formControl['type'] == '--group') {
                                    foreach ($formControl['controls'] as $sformControl) {
                                        if ($sformControl['type'] == '--checkbox') {
                                            $checkBoxValue = $formData[$sformControl['column']];
                                            if ($checkBoxValue == 1)
                                                $checkBoxValue = 1;
                                            else
                                                $checkBoxValue = 0;
                                            $insertQuery[$sformControl['column']] = $checkBoxValue;

                                        } else
                                            $insertQuery[$sformControl['column']] = $formData[$sformControl['column']];
                                    }
                                } else {
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

                            if (!empty($this->save_from_parent)) {

                                $will_save_parent_value = DB::table($this->table)->select($this->save_from_parent['parent_column'])->where('id', '=', $parentId)->pluck($this->save_from_parent['parent_column']);

                                $insertQuery[$this->save_from_parent['child_column']] = $will_save_parent_value;
                            }

                            if ($item['id'] == null)

                                DB::table($table)->insert($insertQuery);
                            else
                                DB::table($table)->where('id', '=', $item['id'])->update($insertQuery);

                        }
                    }
                }
            }
        }
    }

    public function editSubItems()
    {

        $connect_column = Request::input('connect_column');
        $parent_id = Request::input('parent_id');


        foreach ($this->subItems as $subItem) {
            if ($subItem['connect_column'] == $connect_column) {

                $table = $subItem['table'];


                $edit_data = DB::table($table)->where("$connect_column", "=", $parent_id)->get();

                return $edit_data;

            }
        }

    }

    public function deleteSubItems()
    {

        $connect_column = Request::input('connect_column');
        $id = Request::input('id');


        foreach ($this->subItems as $subItem) {
            if ($subItem['connect_column'] == $connect_column) {

                $table = $subItem['table'];


                DB::table($table)->where("id", "=", $id)->delete();

                return 'success';

            }
        }

    }

    /*translation*/
    public function changeLangauge()
    {
        $locale = Request::input('locale');

        if (Session::has('locale')) {
            Session::set('locale', $locale);
        } else {
            Session::set('locale', $this->default_locale);
        }

    }

    // cascade
    public function getCascade($parent, $child, $form_input_control)
    {
        $data = [];
        $found = false;

        foreach ($form_input_control as $formControl) {

            if (isset($formControl["column"]) && $formControl["column"] == $child) {

                $options = $formControl['options'];
                $order = explode(" ", $options['grid_default_order_by']);
                $data = DB::table($options['table'])->select($options['grid_columns'])
                    ->where($options['parent'], '=', $parent)
                    ->orderBy($order[0], $order[1]);

                if (isset($options['condition'])) {
                    foreach ($options['condition'] as $condition_column => $condition_value) {
                        $data->where("$condition_column", '=', $condition_value);

                    }
                }
                $data_return = $data->get();
                return $data_return;

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

        if (empty($data)) {
            foreach ($this->form_input_control as $formControl) {

                if ($formControl['type'] == '--group' && empty($data)) {
                    $controls = $formControl['controls'];
                    $data = $this->getCascade($parent, $child, $controls);
                }
            }
        }
        if (empty($data)) {
            foreach ($this->form_input_control as $formControl) {

                if ($formControl['type'] == '--combobox-addable') {

                    $data = $this->getCascade($parent, $child, $formControl['options']['form_input_control']);

                    if (empty($data)) {

                        foreach ($formControl['options']['form_input_control'] as $sformControl) {

                            if ($sformControl['type'] == '--group' && empty($data)) {
                                $controls = $sformControl['controls'];
                                $this->getCascade($parent, $child, $controls);
                            }
                        }
                    }
                }
            }


        }
        if (count($this->subItems) >= 1 && empty($data)) {

            foreach ($this->subItems as $subItem) {

                if (empty($data)) {
                    $data = $this->getCascade($parent, $child, $subItem['form_input_control']);
                }
            }

            if (empty($data)) {
                foreach ($this->subItems as $subItem) {

                    foreach ($subItem['form_input_control'] as $formControl) {

                        if ($formControl['type'] == '--group' && empty($data)) {
                            $controls = $formControl['controls'];
                            $data = $this->getCascade($parent, $child, $controls);
                        }
                    }
                }


            }
        }

        return $data;

    }

    public function checkUnique()
    {
        $table = Request::input('table');
        $column = Request::input('column');
        $value = Request::input('value');
        $row_id_field = Request::input('row_id_field');
        $row_id = Request::input('row_id');

        $validation = null;
        foreach ($this->form_input_control as $formControl) {

            if (isset($formControl["column"]) && $formControl["column"] == $column) {

                $validation = ["$column" => $formControl["validate"]];

            }

        }


        $validator = Validator::make(["$column" => $value], $validation);
        if ($validator->fails()) {
            return 1;
        } else {
            return 0;
        }

    }

    //upload
    public function uploadFile()
    {

        $file = Request::file('file');

        if (is_array($file)) {
            $response = [];
            foreach ($file as $mfile) {
                $validator2 = Validator::make(
                    ['file' => $mfile],
                    ['file' => $this->image_upload_allow_list]
                );

                if ($validator2->passes()) {


                    //paths
                    $destinationPath = public_path() . DIRECTORY_SEPARATOR . $this->base_folder . DIRECTORY_SEPARATOR . $this->destination_folder . DIRECTORY_SEPARATOR;

//                    dd($destinationPath);

                    $thumbPath = $destinationPath . $this->thumb_folder . DIRECTORY_SEPARATOR;
                    if (!is_dir($destinationPath)) {
                        mkdir($destinationPath, 0755, true);
                    }
                    if (!is_dir($thumbPath)) {
                        mkdir($thumbPath, 0755, true);
                    }
//            $destinationUrl = url('/') . "/".$this->base_folder."/" . $this->destination_folder . '/';
                    $destinationUrl = "/" . $this->base_folder . "/" . $this->destination_folder . '/';
                    $thumbUrl = $destinationUrl . $this->thumb_folder . '/';

                    //property
                    $fileOrigName = $mfile->getClientOriginalName();

                    $fileUniqueName = date("YmdHis") . "_" . str_random(25) . '.' . $mfile->getClientOriginalExtension();


                    while (File::exists($destinationPath . $fileUniqueName)) {

                        $fileUniqueName = uniqid() . "_" . $fileUniqueName;
                    }

                    $uploadSuccess = Image::make($mfile->getRealPath());
                    $bigImage = $uploadSuccess->save($destinationPath . $fileUniqueName, 100);

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


                    if ($uploadSuccess) {

                        $response[] = $result;

                    } else {

                        return Response::json('error', 400);
                    }
                } else {

                    return Response::json('error. Invalid file format or size >5Mb', 400);
                }
            }

            return Response::json($response, 200);

        } else {
            $ext = $file->getClientOriginalExtension();
            if ($ext == 'pdf' || $ext == 'swf' || $ext == 'doc' || $ext == 'docx' || $ext == 'xls' || $ext == 'xlsx' || $ext == 'ppt' || $ext == 'pptx') {
                $destinationPath = public_path() . DIRECTORY_SEPARATOR . $this->base_folder . DIRECTORY_SEPARATOR . 'docs' . DIRECTORY_SEPARATOR;
                $destinationUrl = "/" . $this->base_folder . "/docs/";

                $fileOrigName = $file->getClientOriginalName();
                $fileUniqueName = date("YmdHis") . "_" . str_random(25) . '.' . $file->getClientOriginalExtension();
                if (!is_dir($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }

                $uploadSuccess = $file->move($destinationPath, $fileUniqueName);

                $result = [
                    'destinationUrl' => $destinationUrl,
                    'origName' => $fileOrigName,
                    'uniqueName' => $fileUniqueName
                ];

                if ($uploadSuccess) {
                    return Response::json($result, 200); // or do a redirect with some message that file was uploaded
                } else {
                    return Response::json('error', 400);
                }

            } else {
                return $this->uploadImageNew($file);
            }
        }


    }

    public function uploadImageNew($file)
    {


        $rules = [
            'file' => $this->image_upload_allow_list
        ];

        $validator = Validator::make(Request::all(), $rules);


        if (is_array($file)) {
            $response = [];
            foreach ($file as $mfile) {
                $validator2 = Validator::make(
                    ['file' => $mfile],
                    ['file' => $this->image_upload_allow_list]
                );

                if ($validator2->passes()) {


                    //paths
                    $destinationPath = public_path() . DIRECTORY_SEPARATOR . $this->base_folder . DIRECTORY_SEPARATOR . $this->destination_folder . DIRECTORY_SEPARATOR;

//                    dd($destinationPath);

                    $thumbPath = $destinationPath . $this->thumb_folder . DIRECTORY_SEPARATOR;
                    if (!is_dir($destinationPath)) {
                        mkdir($destinationPath, 0755, true);
                    }
                    if (!is_dir($thumbPath)) {
                        mkdir($thumbPath, 0755, true);
                    }
//            $destinationUrl = url('/') . "/".$this->base_folder."/" . $this->destination_folder . '/';
                    $destinationUrl = "/" . $this->base_folder . "/" . $this->destination_folder . '/';
                    $thumbUrl = $destinationUrl . $this->thumb_folder . '/';

                    //property
                    $fileOrigName = $mfile->getClientOriginalName();

                    $fileUniqueName = date("YmdHis") . "_" . str_random(25) . '.' . $mfile->getClientOriginalExtension();


                    while (File::exists($destinationPath . $fileUniqueName)) {

                        $fileUniqueName = uniqid() . "_" . $fileUniqueName;
                    }

                    $uploadSuccess = Image::make($mfile->getRealPath());
                    $bigImage = $uploadSuccess->save($destinationPath . $fileUniqueName, 100);

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


                    if ($uploadSuccess) {

                        $response[] = $result;

                    } else {

                        return Response::json('error', 400);
                    }
                } else {

                    return Response::json('error. Invalid file format or size >5Mb', 400);
                }
            }

            return Response::json($response, 200);


        } else {
            if ($validator->passes()) {


                //paths
                $destinationPath = public_path() . DIRECTORY_SEPARATOR . $this->base_folder . DIRECTORY_SEPARATOR . $this->destination_folder . DIRECTORY_SEPARATOR;


                $thumbPath = $destinationPath . $this->thumb_folder . DIRECTORY_SEPARATOR;
                if (!is_dir($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                if (!is_dir($thumbPath)) {
                    mkdir($thumbPath, 0755, true);
                }
//            $destinationUrl = url('/') . "/".$this->base_folder."/" . $this->destination_folder . '/';
                $destinationUrl = "/" . $this->base_folder . "/" . $this->destination_folder . '/';
                $thumbUrl = $destinationUrl . $this->thumb_folder . '/';

                //property
                $fileOrigName = $file->getClientOriginalName();

                $fileUniqueName = date("YmdHis") . "_" . str_random(25) . '.' . $file->getClientOriginalExtension();


                while (File::exists($destinationPath . $fileUniqueName)) {

                    $fileUniqueName = uniqid() . "_" . $fileUniqueName;
                }

                $uploadSuccess = Image::make($file->getRealPath());
//                $bigImage = $uploadSuccess->resize(1600, null, function ($constraint) {
//                    $constraint->aspectRatio();
//                });
//                $bigImage->save($destinationPath . $fileUniqueName, 100);

                $bigImage = $uploadSuccess->save($destinationPath . $fileUniqueName, 100);

                $thum_iamge = $uploadSuccess->resize(364, null, function ($constraint) {
                    $constraint->aspectRatio();
                });
                $thum_iamge->save($thumbPath . $fileUniqueName, 100);


                $result = [
                    'destinationUrl' => $destinationUrl,
                    'thumbUrl' => $thumbUrl,
                    'origName' => $fileOrigName,
                    'uniqueName' => $fileUniqueName
                ];


                if ($uploadSuccess) {

                    return Response::json($result, 200); // or do a redirect with some message that file was uploaded

                } else {

                    return Response::json('error', 400);
                }
            } else {

                return Response::json('error. Invalid file format or size >5Mb', 400);
            }
        }


    }


    public function deleteFile()
    {
        $filename = Request::input('filename');

        $destinationPath = public_path() . DIRECTORY_SEPARATOR . $this->base_folder . DIRECTORY_SEPARATOR . $this->destination_folder . DIRECTORY_SEPARATOR;


        $thumbPath = $destinationPath . $this->thumb_folder . DIRECTORY_SEPARATOR;

        if (file_exists($destinationPath . $filename)) {
            unlink($destinationPath . $filename);
        }

        if (file_exists($thumbPath . $filename)) {
            unlink($thumbPath . $filename);
        }

        return Response::json('success', 200);
    }

    public function generateLocale()
    {
        $words = DB::table($this->static_words_table)->get();
        $locales = DB::table($this->locales_table)->get();
        $i18Path = public_path('i18') . DIRECTORY_SEPARATOR;
        $localeArr = [];
        if (!is_dir($i18Path)) {
            mkdir($i18Path, 0755, true);
        }
        foreach ($locales as $l) {
            $localeArr[$l->code] = [];
        }
        foreach ($words as $w) {
            $translation = json_decode($w->translation);
            $key = $w->key;
            foreach ($translation as $t) {
                if (array_key_exists($t->locale, $localeArr)) {
                    $arr = [];
                    $arr[$key] = $t->value;
                    $localeArr[$t->locale][$key] = $t->value;
                }
            }
        }

        foreach ($localeArr as $key => $value) {
            $file = $i18Path . strtolower($key) . ".json";
            file_put_contents($file, json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }
    }

    function generateLocalePhp()
    {
        $words = DB::table($this->static_words_table)->get();
        $locales = DB::table($this->locales_table)->get();
        $i18Path = base_path('resources' . DIRECTORY_SEPARATOR . 'lang') . DIRECTORY_SEPARATOR;
        $localeArr = [];

        if (!is_dir($i18Path)) {
            mkdir($i18Path, 0755, true);
        }

        foreach ($locales as $l) {
            $localeArr[$l->code] = [];
        }

        foreach ($words as $w) {
            $translation = json_decode($w->translation);
            $key = $w->key;
            foreach ($translation as $t) {
                if (array_key_exists($t->locale, $localeArr)) {
                    $arr = [];
                    $arr[$key] = $t->value;
                    $localeArr[$t->locale][$key] = $t->value;
                }
            }
        }

        foreach ($localeArr as $key => $value) {
            $langFilePath = $i18Path . strtolower($key) . DIRECTORY_SEPARATOR;
            if (!is_dir($langFilePath)) {
                mkdir($langFilePath, 0755, true);
            }
            $file = $langFilePath . 'tr.php';
            $str = '<?php return ' . var_export($value, true) . ';';
            file_put_contents($file, $str);
        }
    }

    public function callMultImtems()
    {

        if (empty($this->ifUpdateDisabledCanEditColumns))
            if ($this->permission['u'] != true)
                return Response::json('permission denied', 400);

        $save_first_id_column = Request::input('save_first_id_column');

        /// saijruulah

        $table_data = DB::table($this->table)->where($this->table . "." . $this->save_first_id_column, '=', $save_first_id_column);
        $table_data->select($this->table . "." . $this->identity_name);

        if (count($this->multi_items_form_input_control) >= 1) {
            $table_data->addSelect($this->table . "." . $this->save_first_id_column);
        }


        $options = null;
        foreach ($this->multi_items_form_input_control as $formControl) {

            if (isset($formControl['column']))
                $table_data->addSelect("$this->table." . $formControl['column']);

//            if($formControl['type'] == '--combogrid' || $formControl['type'] == '--combobox' || $formControl['type'] == '--tag' || $formControl['type'] == '--combobox-addable' || $formControl['type'] == '--combobox-hidden'){
//
//                $options = $formControl['options'];
//
//                $table_data->join($options['table'], "$this->table." . $formControl['column'], '=', $options['table']. "." .$options['valueField']);
//
//
//            }

            if ($formControl['type'] == '--group') {
                foreach ($formControl['controls'] as $subformControl) {

                    if (isset($subformControl['column']))
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


        foreach ($this->translate_form_input_control as $t_f_c) {
            $table_data->addSelect("$this->table." . $t_f_c['column']);
        }


        return $table_data->get();
    }

    public function afterChangeTrigger()
    {
        $dataIndex = Request::input('dataIndex');
        $value = Request::input('value');
        $formType = Request::input('formType');

        if ($formType == 'form') {
            $feild = $this->form_input_control;
        } elseif ($formType == 'multi_items_form')
            $feild = $this->multi_items_form_input_control;

        $i = 0;
        foreach ($dataIndex as $index) {
            if ($i == 0) {
                $feild = $feild[$index];
            } else {
                $feild = $feild['control'][$index];
            }
            $i++;
        }

        $trigger = $feild['after_change_trigger'];

        $controller = $trigger['controller'];
        $function = $trigger['function'];

        /*        return example
                $data_r = [
                    'status'=>'error',
                    'error_message'=>'',
                    'new_values'=>[] [[[index], value, status]
                ]; */

        return app($controller)->$function($value);

    }
}