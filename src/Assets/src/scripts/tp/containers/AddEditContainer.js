import React, { Component, PropTypes } from 'react'
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux'
import * as DataActions from '../actions/form'
import Header from '../components/grid/Header'
import Form from "../components/form/Form"
import validation from "../components/form/validation/"
import validationGrid from "../components/grid/validation/"
import {save, edit, update, getCascadeChild, callMultiItems, deleteItem, afterChangeTrigger} from "../api/"

import Window from "../components/window/"
import SubItemsContainer from "./formContainers/SubItemsContainer"
import { Modal, Button } from 'react-bootstrap';
import {customDropdownRenderer, gridImage, genrateComboboxvalues} from '../lib/handSonTableHelper'
/*for handson table*/
var tp_handSonTable = null
var exportPlugin = null
var tp_dataSchema = {};
var maxRows = 0;
var listData = []
var save_first_id_column_ = 0
import Loading from '../components/loading/loading'
class AddEditContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sending: false,
            savedAlertShow: false,
            errorY: 0
        };
    }
    getValueByColumn(column){
        let value = null
        this.props.formControls.map((fcontrol, findex)=>{
            if(fcontrol.get('column') == column){
                value = fcontrol.get('value')
            }
        })

        return value;
    }
    checkValidate() {
        const FD = this.props.formControls;
        let foundError = false;

        let perPositionY = [];


        FD.map((formColumn, index) => {
            if (formColumn.get('type') == '--group') {

                formColumn.get('controls').map((formColumnSub, subIndex) => {



                    if(formColumnSub.get('show')){

                        let showCheckers = formColumnSub.get('show').toJS();
                        let hideElement = true;
                        showCheckers.map((showChecker)=>{

                            Object.keys(showChecker).map(checker=>{
                                //console.log(checker, showChecker[checker])

                                let checkerValue = this.getValueByColumn(checker)


                                if(checkerValue == showChecker[checker])
                                    hideElement = false;


                            })


                        })
                        if(hideElement === true){
                            return false
                        }
                    }


                    const error = (validation(formColumnSub.get('value'), formColumnSub.get('validate')));
                    if (error) {
                        this.props.actions.setError([index, 'controls', subIndex], error);
                        foundError = true;


                        let preY = document.getElementById(`solar-form-group-${index}-${subIndex}`).offsetTop;



                        perPositionY.push(preY);




                    }
                })
            } else
            {



                if(formColumn.get('show')){

                    let showCheckers = formColumn.get('show').toJS();
                    let hideElement = true;
                    showCheckers.map((showChecker)=>{

                        Object.keys(showChecker).map(checker=>{
                            //console.log(checker, showChecker[checker])

                            let checkerValue = this.getValueByColumn(checker)


                            if(checkerValue == showChecker[checker])
                                hideElement = false;


                        })


                    })
                    if(hideElement === true){

                       return false
                    }
                }
                let error = null;
                if(formColumn.get('type') == '--password'){
                    error = (validation(formColumn.get('value'), 'password|required'));
                } else if(formColumn.get('type') == '--password-confirm'){
                    error = (validation(formColumn.get('value'), 'password', this.getValueByColumn('password')))
                } else {
                    error = (validation(formColumn.get('value'), formColumn.get('validate')));
                }


                if (error) {
                    this.props.actions.setError([index], error);
                    foundError = true;

                    let preY = document.getElementById(`solar-form-group-${index}`).offsetTop;



                    perPositionY.push(preY);


                }

            }
        })
        this.props.translateFormControls.map((locale, locale_index) => {

            locale.get('translate_form_input_control').map((formColumn, index) => {
                if (formColumn.get('type') == '--group') {
                    formColumn.get('controls').map((formColumnSub, subIndex) => {
                        const error = (validation(formColumnSub.get('value'), formColumnSub.get('validate')));
                        if (error) {
                            this.props.actions.setTranslationError(locale_index, [index, 'controls', subIndex], error);
                            foundError = true;
                        }
                    })
                } else {
                    const error = (validation(formColumn.get('value'), formColumn.get('validate')));
                    if (error) {
                        this.props.actions.setTranslationError(locale_index, [index], error);
                        foundError = true;
                    }
                }
            })

        })

        let preY_ = 0;
        perPositionY.map((pY, pIndex)=>{
            if(pIndex == 0)
                preY_ = pY;

            if(pY < preY_)
                preY_ = pY;
        })

        this.setState({errorY: preY_});

        return foundError;
    }

    getDataTpMultiItem(){
        let multiItems = [];
        let multiItems_pre = tp_handSonTable.getData();

        for (var i = 0; i < multiItems_pre.length; ++i) {

            if(tp_handSonTable.isEmptyRow(i) === false){
                let row = {}
                multiItems_pre[i].map((Item_pre, index)=>{



                    if(index >= this.props.multi_items_form_input_control.length){
                        row['id'] = Item_pre;
                    } else
                    {

                        row[this.props.multi_items_form_input_control[index].column] = Item_pre
                    }

                })

                multiItems.push(row)


            }


        }

        return multiItems;

    }

    saveForm() {
        let multiItems = [];
        if(this.props.multi_items_form_input_control.length >=1 ){
            multiItems = this.getDataTpMultiItem()
            if(multiItems.length <= 0){
                alert('Бүх хэсгийг бүрэн бөглөнө үү')
                return false;
            }

        }


        if (this.props.permission.c !== true)
            return false;
        const FD = this.props.formControls;

        let foundError = this.checkValidate();

        if (foundError === false){
            this.setState({sending: true});
            save(FD, this.props.translateFormControls, this.props.subItems, multiItems).done((data)=> {


                    this.setState({sending: false});
                    if(this.props.showInsertResponse === true){
                        alert(data);
                        localStorage.setItem("addEditFromStatus", "ended");
                        window.location.replace('#/');
                    }else if(this.props.show_saved_alert === true){
                        localStorage.setItem("addEditFromStatus", "ended");
                        this.setState({savedAlertShow: true});

                    } else {
                        localStorage.setItem("addEditFromStatus", "ended");
                       
                        if(this.props.after_save_reload_page === true){
                            
                            window.location.replace('#/');
                            window.location.reload();
                          

                        } else
                        window.location.replace('#/');



                    }






            }).fail(()=> {

                alert("Уучлаарай алдаа гарлаа дахин оролдоно уу")
                this.setState({sending: false});
            })
        } else {

            setTimeout(()=>{
            
                $('html, body').animate({
                    scrollTop: this.state.errorY
                }, 400);

            }, 120);

        }


    }

    updateForm() {
        let multiItems = [];
        if(this.props.multi_items_form_input_control.length >=1 ){
            multiItems = this.getDataTpMultiItem()
            if(multiItems.length <= 0){
                alert('Бүх хэсгийг бүрэн бөглөнө үү')
                return false;
            }

        }



        if (this.props.ifUpdateDisabledCanEditColumns.length <= 0)
            if (this.props.permission.u !== true)
                return false;

        const FD = this.props.formControls;


        let foundError = this.checkValidate();

        if (foundError === false){
            this.setState({sending: true});
            update(FD, this.props.translateFormControls, this.props.params.id, this.props.subItems, multiItems).done((data)=> {
                localStorage.setItem("addEditFromStatus", "ended");
                this.setState({sending: false});

                if (data == 'success' || 'none') {
                    if (this.props.permission.r === false && this.props.permission.c === false && this.props.permission.d === false && this.props.setup.update_row !== null) {

                        alert("Амжилттай хадгаллаа")

                    } else
                        window.location.replace('#/');

                }

            }).fail(()=> {
                alert("Уучлаарай алдаа гарлаа дахин оролдоно уу")
            })
        }



    }

    // form field value recieve functions
    translateChangeHandler(locale_index, dataIndex, value) {

        let realDataIndex = [];

        dataIndex.map((dIndex, index)=> {
            if (index == 0) {
                realDataIndex.push(dIndex);
            } else if (index >= 1) {
                realDataIndex.push('controls')
                realDataIndex.push(dIndex)
            }
        })


        this.props.actions.changeTranslationValue(locale_index, realDataIndex, value);


        const FD = this.props.translateFormControls.getIn([locale_index, 'translate_form_input_control']);

        const field = FD.getIn(realDataIndex);
        const error = validation(value, field.get('validate'));

        this.props.actions.setTranslationError(locale_index, realDataIndex, error);


    }
    changeChildValue(realDataIndex){


        let childIndex = realDataIndex;

        childIndex[childIndex.length-1] = childIndex[childIndex.length-1]+1;

        const childField = this.props.formControls.getIn(childIndex);

        this.props.actions.changeValue(childIndex, null);

        if(childField.getIn(['options', 'child'])){
            this.changeChildValue(childIndex);
        }

    }
    setErrorManuale(index, error){
        this.props.actions.setError(index, error)
    }
    changeValues(dataIndex, value) {


        let realDataIndex = [];

        dataIndex.map((dIndex, index)=> {
            if (index == 0) {
                realDataIndex.push(dIndex);
            } else if (index >= 1) {
                realDataIndex.push('controls')
                realDataIndex.push(dIndex)
            }
        })





        this.props.actions.changeValue(realDataIndex, value);

        const field = this.props.formControls.getIn(realDataIndex);



        let error = null;

        if(field.get('type') == '--password'){
             error = validation(value, 'password|required');
        }else if(field.get('type') == '--password-confirm'){
            error = validation(value, 'password', this.getValueByColumn('password'));
        } else {

             error = validation(value, field.get('validate'));
        }

        if(error === null && field.get('after_change_trigger')){
            afterChangeTrigger(realDataIndex, value, 'form').then((data)=>{
                
                if(data.status){
                    if(data.status == 'success'){
                        let setValues = data.new_values;

                        setValues.map(setValue=>{
                            this.changeValues(setValue[0], setValue[1]);


                            if(setValue[2] === false || setValue[2] === true){
                              
                                this.props.actions.changeStatus(setValue[0], setValue[2]);
                            }
                        })
                    } else if(data.status == 'error'){
                        alert(data.error_message);
                        window.location.replace('#/');
                    }

                } else {
                    let setValues = data;

                    setValues.map(setValue=>{
                        this.changeValues(setValue[0], setValue[1]);
                    })
                }

            })
        }


        this.props.actions.setError(realDataIndex, error);

        /// cascad call
        if(field.get('type') == '--combobox'){
            if(field.getIn(['options', 'child'])){

                this.changeChildValue(realDataIndex);

                getCascadeChild(field.getIn(['options', 'child']), value).then((data)=>{
                    this.props.actions.changeFormData(field.getIn(['options', 'child']), data);
                })
            }
        }



    }

    componentWillMount() {
        /*local storage*/

        localStorage.setItem("addEditFromStatus", "started");


        //clear form validation
        const FC = this.props.formControls;

        if (FC.size >= 1)
            this.props.actions.clearFromValidation();

        if (this.props.params.id) {
            if (this.props.ifUpdateDisabledCanEditColumns.length <= 0)
                if (this.props.permission.u !== true)
                    window.location.replace('#/');

            if(this.props.password_change === false)
            edit(this.props.params.id).then((data)=> {
                if (data.length >= 1){
                    this.props.formControls.map((formControl, index)=> {
                        //if (formControl.type === '--combogrid') {
                        //
                        //    this.props.actions.setComboGridText(formControl.column, data[0][formControl.column + "_" + formControl.options['textField']]);
                        //}
                        if (formControl.get('type') !== '--hidden' && formControl.get('type') !== '--group'){
                            if(formControl.get('type') == '--combobox'){

                                if(formControl.getIn(['options', 'child'])){


                                    this.props.actions.changeValue([index], data[0][formControl.get('column')])

                                    // getCascadeChild(formControl.getIn(['options', 'child']), data[0][formControl.get('column')]).then((dataChild)=>{
                                    //     this.props.actions.changeFormData(formControl.getIn(['options', 'child']), dataChild);
                                    //
                                    //     this.props.actions.changeValue([index], data[0][formControl.get('column')])
                                    // })

                                } else
                                    this.props.actions.changeValue([index], data[0][formControl.get('column')])
                            } else{

                                this.props.actions.changeValue([index], data[0][formControl.get('column')])
                            }

                        }


                        if (formControl.get('type') == '--group'){

                            formControl.get('controls').map((control, subIndex)=>{

                                if (control.get('type') !== '--hidden' && control.get('type') !== '--group'){
                                    if(control.get('type') == '--combobox'){

                                        if(control.getIn(['options', 'child'])){

                                            this.props.actions.changeValue([index, 'controls', subIndex], data[0][control.get('column')])

                                            // getCascadeChild(control.getIn(['options', 'child']), data[0][control.get('column')]).then((dataChild)=>{
                                            //     this.props.actions.changeFormData(control.getIn(['options', 'child']), dataChild);
                                            //
                                            //     this.props.actions.changeValue([index, 'controls', subIndex], data[0][control.get('column')])
                                            // })
                                        } else
                                            this.props.actions.changeValue([index, 'controls', subIndex], data[0][control.get('column')])
                                    } else
                                        this.props.actions.changeValue([index, 'controls', subIndex], data[0][control.get('column')])
                                }


                            })

                        }

                    })
                    this.props.translateFormControls.map((translateFormControl, l_index)=> {


                        translateFormControl.get('translate_form_input_control').map((formControl, index)=> {
                            if(data[0][formControl.get('column')] !== null && data[0][formControl.get('column')] != ''){
                                let json_translations =  JSON.parse(data[0][formControl.get('column')]);

                                json_translations.map((json_translation) =>{
                                    if(json_translation.locale == translateFormControl.get('locale_code')){
                                        if (formControl.get('type') !== '--hidden')
                                            this.props.actions.changeTranslationValue(l_index, [index], json_translation.value)
                                    }

                                })
                            }



                        })


                    })


                    if(data[0][this.props.save_first_id_column] === null){
                        save_first_id_column_ = data[0][this.props.identity_name]
                    } else {
                        save_first_id_column_ = data[0][this.props.save_first_id_column]
                    }


                    if(this.props.multi_items_form_input_control.length >= 1)
                        this.callMultiItemsDatas(save_first_id_column_)
                }

                else
                    alert('please try agian')

                this.props.actions.setShowAddEditForm(true)
            });
            else
                this.props.actions.setShowAddEditForm(true)




        } else {
            if (this.props.permission.c !== true)
                window.location.replace('#/');
            this.props.actions.setShowAddEditForm(true)
        }





    }


    componentWillUnmount() {

    
        this.props.actions.clearFromValidation();

        this.props.actions.clearTranslationFromValidation();
      
        this.props.actions.setShowAddEditForm(false)
  

        listData = [];

  
    }

    componentDidMount(){
        if(this.props.multi_items_form_input_control.length >=1 )
         this.setUpHandsonTable();


    }

    /* muli items form */
    getColumnIndex(column){
        //return _.findIndex(this.props.gridHeader, { column: column })
        return this.props.multi_items_form_input_control.findIndex(x => x.column == column );
    }
    getColumnValdation(column){
        //return _.findIndex(this.props.gridHeader, { column: column })
        if(this.props.multi_items_form_input_control[column].validate)
            return this.props.multi_items_form_input_control[column].validate;
        else
            return ''
    }
    getColumnType(column){


        return this.props.multi_items_form_input_control[column].type;

    }
    callMultiItemsDatas(save_first_id_column) {



        if(this.props.permission.u !== true)
            return false;

        callMultiItems(save_first_id_column).then((data)=> {
            if(data.length <= 0)
                window.location.replace('#/');

            listData = data;
            this.setUpHandsonTable()
        });
    }
    handleDeleteItem(id) {

        if(id == -1){
            this.callMultiItemsDatas(save_first_id_column_)

        } else if(this.props.permission.d == true) {

            if (!confirm('Delete this record?')) {
                return;
            }
            else{
                deleteItem(id).then((data)=> {


                    if (data == 'success')
                        this.callMultiItemsDatas(save_first_id_column_)
                    else
                        alert("Please try agian")
                });
            }


        }
    }
    editDeleteRender(instance, td, row, col, prop, value, cellProperties) {

        while (td.firstChild) {
            td.removeChild(td.firstChild);
        }
        var self = this;

        let pre_del =  document.createElement('a');
        let pre_editBtn =  document.createElement('a');
        let pre =  document.createElement('span');

        td.appendChild(pre)

        //if(this.props.formType != 'inline'){
        //    ///EDIT BUTTTON
        //    pre_editBtn.href = "#edit/"+value;
        //    pre_editBtn.innerHTML = "<i class=\"material-icons\">&#xE254;</i>&nbsp;";
        //
        //    if(this.props.permission.u == true || this.props.ifUpdateDisabledCanEditColumns.length >=1)
        //        pre.appendChild(pre_editBtn);
        //}
        //
        //
        //



        // DELETE BUTTON
        pre_del.addEventListener("click", function(){

            self.handleDeleteItem(value)

        });



        pre_del.innerHTML = "<i class=\"material-icons\">&#xE872;</i> ";
        if(this.props.permission.d == true)
            pre.appendChild(pre_del);
        

        return td;

        


    }


    getData(row){
        return tp_handSonTable.getDataAtRow(row);
    }
    afterChange(changes, source, isValid) {

        if (changes) {

            let colIndex = 0;

            if (changes[0][1] === parseInt(changes[0][1], 10)) {
                colIndex = changes[0][1]
            } else
                colIndex = this.getColumnIndex(changes[0][1]);


            let colType = this.props.multi_items_form_input_control[colIndex].type

            let row = changes[0][0];
            let elValue = changes[0][3];



            if (colType != '--auto-calculate') {

                ///auto-calculate
                let calculate_columns = []

                this.props.multi_items_form_input_control.map((fcontrol, findex)=> {
                    if (fcontrol.type == '--auto-calculate') {


                        let calculate_type = fcontrol.options.calculate_type;
                        let calculate_column = fcontrol.column;

                        let columns = [];

                        fcontrol.options.calculate_columns.map((calculate_column, cal_index)=> {

                            let colIndex_ = this.getColumnIndex(calculate_column)


                            columns.push(
                                {column: calculate_column, value: tp_handSonTable.getDataAtCell(row, colIndex_)}
                            );
                        })

                        calculate_columns.push(
                            {
                                column: calculate_column,
                                type: calculate_type,
                                columns: columns,
                                dataIndex: findex
                            }
                        )
                    }
                })

                calculate_columns.map((calculate_column, index)=> {
                    let checkAllValue = true;
                    calculate_column.columns.map((cal_column)=> {
                        if (cal_column.value === null)
                            checkAllValue = false
                    })
                    let calculate_result = null;
                    if (checkAllValue === true) {
                        if (calculate_column.type == '--multiply') {
                            calculate_column.columns.map((cal_column, calIndex)=> {
                                if (calIndex == 0)
                                    calculate_result = cal_column.value;
                                else
                                    calculate_result = calculate_result * cal_column.value
                            })
                        } else if ((calculate_column.type == '--sum')) {
                            calculate_column.columns.map((cal_column, calIndex)=> {
                                if (calIndex == 0)
                                    calculate_result = cal_column.value;
                                else
                                    calculate_result = calculate_result + cal_column.value
                            })
                        } else if (calculate_column.type == '--average') {
                            calculate_column.columns.map((cal_column, calIndex)=> {
                                if (calIndex == 0)
                                    calculate_result = cal_column.value;
                                else
                                    calculate_result = calculate_result + cal_column.value
                            })
                            calculate_result = calculate_result / calculate_column.columns.length;
                        }
                        if (calculate_result !== null) {

                            tp_handSonTable.setDataAtCell(row, calculate_column.dataIndex, calculate_result);
                        }
                    }
                });
            }
            if(this.props.multi_items_form_input_control[colIndex].after_change_trigger){


                afterChangeTrigger([colIndex], elValue, 'multi_items_form').then((data)=>{
                    let setValues = null;



                    if(data.status){
                        if(data.status == 'success'){
                             setValues = data.new_values;

                            setValues.map(setValue=>{
                                // console.log(setValue[0][0], 'changeing', setValue[1]);

                                tp_handSonTable.setDataAtCell(row, setValue[0][0], setValue[1]);



                                // this.changeValues(setValue[0], setValue[1]);
                            })
                        } else if(data.status == 'error'){
                            alert(data.error_message);
                            window.location.replace('#/');
                        }

                    } else {
                         setValues = data;

                        setValues.map(setValue=>{
                            // console.log(setValue[0][0], 'changeing', setValue[1]);

                            tp_handSonTable.setDataAtCell(row, setValue[0][0], setValue[1]);

                            // this.changeValues(setValue[0], setValue[1]);
                        })
                    }
                })

            }

            if (changes[0][1] != this.props.identity_name) {


                let rowDatas = this.getData(changes[0][0]);




                let error_not_found = true;

                let data = {};

                let edit_id = null;
                rowDatas.map((rowData, index)=> {
                    if (index <= this.props.multi_items_form_input_control.length - 1) {

                        let col = index;

                        tp_handSonTable.getCellValidator(row, col)(rowData, function (isValid) {

                            if (!isValid)
                                error_not_found = false
                        });

                        data[this.props.multi_items_form_input_control[index].column] = rowData;
                    }
                    if (index == this.props.multi_items_form_input_control.length) {

                        edit_id = rowData;
                    }
                })


                if (error_not_found && edit_id === -1) {

                    inlineSave(data).then((data)=> {


                        $("#save_info" ).addClass("show-info");

                        this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)

                        this.removeInlineForm();

                        setTimeout(function(){ $("#save_info" ).removeClass("show-info"); }, 2500);



                    }).fail(()=> {
                        $("#save_info_failed" ).addClass("show-info");
                        setTimeout(function(){ $("#save_info_failed" ).removeClass("show-info"); }, 2500);
                    });

                }



                if (error_not_found && edit_id >= 1) {

                    inlineSaveUpdate(edit_id, data).then((data)=> {
                        $("#save_info" ).addClass("show-info");
                        this.removeInlineForm()
                        setTimeout(function(){ $("#save_info" ).removeClass("show-info"); }, 2500);
                    }).fail(()=> {
                        $("#save_info_failed" ).addClass("show-info");
                        setTimeout(function(){ $("#save_info_failed" ).removeClass("show-info"); }, 2500);

                    });

                }


            }


            //tp_handSonTable.getCellValidator(row, col)(newValue, function(isValid) {
            //    if (!isValid) {
            //        hot.setDataAtCell(row, col, null);
            //    }
            //});
        }


    }


    validationCaller(validateData, value, callback){

        return validationGrid(validateData, value, callback);
    }
    afterValidater(isValid, value, row, prop, source) {

        let columnIndex = this.getColumnIndex(prop);
        if(isValid){
            tp_handSonTable.setCellMeta(row, columnIndex, 'className', '');
            return true;
        }
        else{

            tp_handSonTable.setCellMeta(row, columnIndex, 'className', 'required-field');
            return false;
        }


    }


    setUpHandsonTable(){

        const { multi_items_form_input_control} = this.props;

        const gridHeader = multi_items_form_input_control;

        if(tp_handSonTable !== null){
            tp_handSonTable.destroy()
        }


        let tp_colHeader = [];

        let tp_columns = [];
        let fixedColumnsLeft = 0;

        gridHeader.map((header, h_index)=>{
            if(header.hidden){

            } else {
                tp_colHeader.push(header.title)
                let gridColumn = {}
                switch (header.type) {
                    case "--text":
                        gridColumn ={
                            data: header.column,
                            editor: 'text',
                            type: 'text',
                            validator: this.validationCaller.bind(this, header.validate),
                            //allowInvalid: false
                        }
                        break;


                    case "--combobox":

                        const optionsList = genrateComboboxvalues(this.props.formData.toJS()[header.column].data.data, header);
                        gridColumn = {
                            data: header.column,
                            editor: "chosen",
                            chosenOptions: {
                                multiple: false,
                                data: optionsList,
                                valueField: header.options.valueField,
                                textField: header.options.textField,
                            },
                            validator: this.validationCaller.bind(this, header.validate),
                            renderer: customDropdownRenderer,
                        }

                        break;
                    case "--tag":
                        const optionsListtag = genrateComboboxvalues(this.props.formData.toJS()[header.column].data.data, header);
                        gridColumn = {
                            data: header.column,
                            editor: "chosen",

                            chosenOptions: {
                                multiple: true,
                                data: optionsListtag,
                                valueField: header.options.valueField,
                                textField: header.options.textField,
                            },
                            validator: this.validationCaller.bind(this, header.validate),
                            renderer: customDropdownRenderer,
                        }
                        break;
                    case "--date":
                        gridColumn ={
                            data: header.column,
                            type: 'date',
                            validator: this.validationCaller.bind(this, header.validate),
                            dateFormat: "YYYY.MM.DD"
                            //allowInvalid: false
                        }

                        break;
                    case "--number":
                        gridColumn =
                        {
                            data: header.column,
                            type: 'numeric',
                            editor: 'numeric',
                            className:'htRight',
                            validator: this.validationCaller.bind(this, header.validate),
                        }
                        break;

                    case "--disabled":
                        gridColumn =
                        {
                            data: header.column,
                            type: 'text',
                            editor: false,
                            validator: this.validationCaller.bind(this, ''),
                        }
                        break;
                    case "--float":
                        gridColumn =
                        {
                            data: header.column,
                            type: 'numeric',
                            editor: 'numeric',
                            format: '0,0.000',
                            className:'htRight',
                            validator: this.validationCaller.bind(this, header.validate),
                        }

                        break;
                    case "--money":
                        gridColumn =
                        {
                            data: header.column,
                            type: 'numeric',
                            format: '0,0.00',
                            className:'htRight',
                            validator: this.validationCaller.bind(this, header.validate),
                        }
                        break;
                    case "--auto-calculate":
                        gridColumn =
                        {
                            data: header.column,
                            type: 'numeric',
                            format: '0,0.00',
                            readOnly:true,
                            validator: this.validationCaller.bind(this, header.validate),
                        }
                        break;
                    default:

                        gridColumn ={
                            data: header.column,
                        }

                }

                tp_columns.push(gridColumn);


            }

            if(header.fixed)
                fixedColumnsLeft++;

            tp_dataSchema[header.column] = null;
        })

        tp_dataSchema['id'] = -1;

        tp_colHeader.push('Засах')
        tp_columns.push({
            data: this.props.identity_name,
            width: 40,

            renderer: this.editDeleteRender.bind(this),
            editor: false
        })


        let gridData = listData;

        //inline form add
        let trimRows = null
        let readOnly = false

        if(this.props.formType == 'inline' && this.props.showInlineForm === false)
            trimRows =[0]

        maxRows = gridData.length;

        var self = this;
        var container = document.getElementById('multi_items');

        //add empty 3 items
        //listData.push(tp_dataSchema);

        let columnSummary = [];

        tp_handSonTable = new Handsontable(container, {
            stretchH: 'all',
            data: gridData,
            rowHeaders: true,
            //formulas: true,
            colHeaders: tp_colHeader,
            columns: tp_columns,
            manualColumnResize: true,
            manualRowResize: true,
            fixedColumnsLeft: fixedColumnsLeft,
            readOnly: readOnly,
            columnSorting: true,
            sortIndicator: true,
            afterChange:this.afterChange.bind(this),
            height: 320,
            minSpareRows:1,
            startRows: 1,
            afterValidate:this.afterValidater.bind(this),
            enterMoves:{row: 0, col: 1},
            autoWrapRow:true,
            cells: function (row, col, prop) {



                var cellProperties = {};

                var conIndex = self.getColumnIndex(prop)


                let cellClass = ''

                let hasahToo =  columnSummary.length >=1 ? 2 : 1;

                if(row <= gridData.length-hasahToo) {
                    if (prop != self.props.identity_name && prop != 'id') {

                        let validate = false;


                        if (self.props.multi_items_form_input_control[col] && self.props.multi_items_form_input_control[col].validate)
                            validate = self.props.multi_items_form_input_control[col].validate;


                        if (validate && gridData.length >= 1 && gridData[row]) {

                            let isvalid = validationGrid(validate, gridData[row][prop]);

                            if (isvalid) {

                            } else {
                                cellClass = 'required-field';
                            }

                        }


                        var type_col = self.getColumnType(conIndex)


                        if (type_col != '--image' && type_col != '--internal-link' && type_col != '--combobox' && type_col != '--tag') {

                            cellProperties['className'] = cellClass;
                            return cellProperties;

                        } else {
                            cellProperties['className'] = cellClass;
                            return cellProperties;
                        }



                    }
                } else {
                    cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {

                        Handsontable.cellTypes[cellProperties.type].renderer.apply(this, arguments);


                        while (td.firstChild) {
                            td.removeChild(td.firstChild);
                        }

                        var textNode = document.createElement('span');

                        columnSummary.map(summary=>{

                            if (prop ==summary.column) {

                                if(summary.type == 'sum'){
                                    let columnSum = 0;
                                    for(let q=0; q<=gridData.length-2; q++){
                                        columnSum = (gridData[q][prop]*1)+columnSum;
                                    }

                                    columnSum = numeral(columnSum);
                                    if(summary.format == 'money'){
                                        columnSum = columnSum.format('0,0.00');
                                    } else if(summary.format == 'float'){
                                        columnSum = columnSum.format('0,0.000');
                                    } else{
                                        columnSum = columnSum.format('0,0');
                                    }


                                    textNode.innerHTML = "<b>"+columnSum+"</b>";
                                }
                            }

                        })




                        td.appendChild(textNode);


                    }
                    cellProperties['readOnly'] = true;
                    return cellProperties;
                }


            },
        });

        exportPlugin = tp_handSonTable.getPlugin('exportFile');
        exportPlugin.exportAsString('csv', {
            exportHiddenRows: true, // default false
            exportHiddenColumns: true, // default false
            columnHeaders: true, // default false
            rowHeaders: true, // default false
            columnDelimiter: ';', // default ','

        });
    }
    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            if(this.props.params.id){
                this.updateForm();
            }else {
                this.saveForm();
            }
        }
    }
  


    render() {


        const {
            setup,
            formControls,
            translateFormControls,
            formData,
            focusIndex,
            showAddEditForm,
            showAddModal,
            subItems,
            ifUpdateDisabledCanEditColumns,
            permission,
            locales,
            button_texts,
            defaultLocale,
            formClassName
            } = this.props;



        const sending = this.state.sending;
        const savedAlertShow = this.state.savedAlertShow;
        let hideSaveModal = () => {
            this.setState({ savedAlertShow: false });
            window.location.replace('#/');
        }

        const gridId = 'grid_table'


        const edit_parent_id = this.props.params.id ? this.props.params.id : false
        const containerForm = showAddEditForm === true
            ?
            <Form
                translateFormControls={translateFormControls}
                formControls={formControls}
                formData={formData}
                defaultLocale={defaultLocale}
                ref="fromRefs"
                locales={locales}
                focusIndex={focusIndex}
                gridId={gridId}
                ifUpdateDisabledCanEditColumns={ifUpdateDisabledCanEditColumns}
                permission={permission}
                edit_parent_id={edit_parent_id}
                setErrorManuale={this.setErrorManuale.bind(this)}
                changeHandler={this.changeValues.bind(this)}
                keyPress={this._handleKeyPress.bind(this)}
                translateChangeHandler={this.translateChangeHandler.bind(this)}
                formClassName={formClassName}

            />
            :
            <Loading />

        const formSubItmes = subItems.size >= 1 ?
            <SubItemsContainer formData={formData} subItems={subItems} edit_parent_id={edit_parent_id}
                               ifUpdateDisabledCanEditColumns={ifUpdateDisabledCanEditColumns}
                               permission={permission}
                          
                               showAddEditForm={showAddEditForm}/> : null


        const sendingClass = sending === true ? 'form-sending' : null;

        return (
            <div className="">
                <Header pageName={setup.page_name} gridHeader={this.props.gridHeader} icon="fa fa-chevron-left" link="#/" type="addEdit"/>

                    <div className="form-wrap">
                        <div className="solar-form">

                            <div className={`${sendingClass}`}>
                                {containerForm}

                                {formSubItmes}
                            </div>
                            <hr/>
                            <div id="multi_items">

                            </div>
                            {sending === true
                                ?<div className="sending spinner">
                                    <div className="bounce1"></div>
                                    <div className="bounce2"></div>
                                    <div className="bounce3"></div>
                                </div>

                                : <div>
                                    {this.props.params.id
                                        ? <button type="button" className="btn btn-fw btn-success p-h-lg"
                                                  onClick={this.updateForm.bind(this)}>
                                        <i className="material-icons">&#xE2C3;</i> {button_texts.save_text}

                                    </button>
                                        :
                                        <button type="button" className="btn btn-fw btn-success p-h-lg"
                                                onClick={this.saveForm.bind(this)}>
                                            <i className="material-icons">&#xE2C3;</i> {button_texts.save_text}

                                        </button>
                                    }
                                    &nbsp;
                                    <a href="#/" className="btn btn-fw danger p-h-lg">
                                        <i className="material-icons">&#xE5CD;</i> {button_texts.cancel_text}
                                    </a>
                            </div>
                            }

                        </div>
                    </div>

                <Modal aria-labelledby="contained-modal-title-sm" className="modal-shadowed" show={savedAlertShow} onHide={hideSaveModal} >

                    <Modal.Body>
                        <h5 style={{color:'green'}}>
                            {this.props.save_alert_word}
                        </h5>
                        <Button onClick={hideSaveModal}>Хаах</Button>
                    </Modal.Body>





                </Modal>
            </div>

        )
    }
}

AddEditContainer.defaultProps = {
    setup: {},
    permission: {c: true, r: false, u: true, d: false},
    ifUpdateDisabledCanEditColumns: []
}
AddEditContainer.propTypes = {
    setup: PropTypes.object.isRequired,
    formControls: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    const Grid = state.Grid;
    const SubItems = state.SubItems;
    const Form = state.Form;


    return {
        setup: Grid.get('setup').toJS(),
        locales: Grid.get('setup').toJS().locales,
        password_change: Grid.get('setup').toJS().password_change,
        gridHeader: Grid.get('setup').toJS().grid_output_control,
        defaultLocale: Grid.get('defaultLocale'),
        formControls: Form.get('form_input_control'),
        translateFormControls: Form.get('translateFormControls'),
        identity_name: Form.get('identity_name'),
        save_first_id_column: Form.get('save_first_id_column'),
        multi_items_form_input_control: Form.get('multi_items_form_input_control').toJS(),
        showAddEditForm: Form.get('showAddEditForm'),
        formClassName: Form.get('formClassName'),
        focusIndex: Form.get('focusIndex'),
        formData: Form.get('formData'),
        subItems: SubItems.get('subItems'),
        button_texts: Grid.get('button_texts'),
        show_saved_alert: Form.get('show_saved_alert'),
        save_alert_word: Form.get('save_alert_word'),
        showInsertResponse: Form.get('showInsertResponse'),
        after_save_reload_page: Form.get('after_save_reload_page'),
        permission: Grid.get('setup').toJS().permission,
        ifUpdateDisabledCanEditColumns: Grid.get('setup').toJS().ifUpdateDisabledCanEditColumns,
    }
}
// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(DataActions, dispatch)
    };
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddEditContainer)
