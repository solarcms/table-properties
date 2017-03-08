import React, { Component, PropTypes } from 'react'
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux'
import * as DataActions from '../actions/form'
import Header from '../components/grid/Header'
import Form from "../components/form/Form"
import validation from "../components/form/validation/"
import validationGrid from "../components/grid/validation/"
import {save, edit, update, getCascadeChild, callMultiItems, deleteItem, afterChangeTrigger} from "../api/"

// import Window from "../components/window/"
import SubItemsContainer from "./formContainers/SubItemsContainer"
import Modal  from 'react-bootstrap/lib/Modal';
import {afterChangeCallerH, validationCaller, getData, getColumnIndex, getValueAtCell, getColumnTranslate, getColumnType, getColumn,exportEXCEL, afterValidater, setUpHandsonTable, editDeleteRender, afterChange} from '../tools/handsonTable'
/*for handson table*/
import {calculate} from '../tools/calculate'


var save_first_id_column_ = 0

import Loading from '../components/loading/loading'
class AddEditContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sending: false,
            savedAlertShow: false,
            errorY: 0,
            tpHeight:320,
            formGrid:true
        };
        //auto calculate
        this.calculate = calculate.bind(this);

        //handson table
        this.grid = 'multi_items';
        this.exportEXCEL = exportEXCEL.bind(this);
        this.getData = getData.bind(this);
        this.validationCaller = validationCaller.bind(this);
        this.getValueAtCell = getValueAtCell.bind(this);
        this.getColumnIndex = getColumnIndex.bind(this);
        this.getColumnTranslate = getColumnTranslate.bind(this);
        this.getColumnType = getColumnType.bind(this);
        this.getColumn = getColumn.bind(this);
        this.afterChange = afterChange.bind(this);
        this.afterValidater = afterValidater.bind(this);
        this.setUpHandsonTable = setUpHandsonTable.bind(this);
        this.editDeleteRender = editDeleteRender.bind(this);
        this.afterChangeCallerH = afterChangeCallerH.bind(this);
        this.tp_handSonTable = null;
        this.exportPlugin = null;
        this.tp_dataSchema = {};
        this.listData = [];

        //after change trigger
        this.timeout = null;
    }
    getValueByColumn(column){
        let value = null
        this.props.formControls.map((fcontrol, findex)=>{
            if(fcontrol.get('column') == column){
                value = fcontrol.get('value')
            }

            if(fcontrol.get('type') == '--group'){
                fcontrol.get('controls').map((cfcontrol, cfindex)=>{
                    if(cfcontrol.get('column') == column){
                        value = cfcontrol.get('value')
                    }


                })
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


                            if(showChecker.length >= 2){



                                let checkerValue = this.getValueByColumn(showChecker[0]);
                                if(checkerValue === null){
                                    checkerValue = ''
                                }

                                let checkerCondition = showChecker[1];
                                let checker = showChecker[2];

                                if(checkerCondition == '=='){
                                    if(checkerValue == checker)
                                        hideElement = false;
                                }

                                if(checkerCondition == '!='){
                                    if(checkerValue != checker)
                                        hideElement = false;
                                }

                                if(checkerCondition == '<='){
                                    if(checkerValue <= checker)
                                        hideElement = false;
                                }

                                if(checkerCondition == '>='){
                                    if(checkerValue >= checker)
                                        hideElement = false;
                                }

                                if(checkerCondition == '>'){
                                    if(checkerValue > checker)
                                        hideElement = false;
                                }

                                if(checkerCondition == '<'){
                                    if(checkerValue < checker)
                                        hideElement = false;
                                }

                            } else {

                                Object.keys(showChecker).map(checker=>{


                                    let checkerValue = this.getValueByColumn(checker)


                                    if(checkerValue == showChecker[checker])
                                        hideElement = false;


                                })
                            }




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

                        if(showChecker.length >= 2){



                            let checkerValue = this.getValueByColumn(showChecker[0]);
                            if(checkerValue === null){
                                checkerValue = ''
                            }

                            let checkerCondition = showChecker[1];
                            let checker = showChecker[2];

                            if(checkerCondition == '=='){
                                if(checkerValue == checker)
                                    hideElement = false;
                            }

                            if(checkerCondition == '!='){
                                if(checkerValue != checker)
                                    hideElement = false;
                            }

                            if(checkerCondition == '<='){
                                if(checkerValue <= checker)
                                    hideElement = false;
                            }

                            if(checkerCondition == '>='){
                                if(checkerValue >= checker)
                                    hideElement = false;
                            }

                            if(checkerCondition == '>'){
                                if(checkerValue > checker)
                                    hideElement = false;
                            }

                            if(checkerCondition == '<'){
                                if(checkerValue < checker)
                                    hideElement = false;
                            }

                        } else {
                            Object.keys(showChecker).map(checker=>{
                                //console.log(checker, showChecker[checker])

                                let checkerValue = this.getValueByColumn(checker)


                                if(checkerValue == showChecker[checker])
                                    hideElement = false;


                            })

                        }




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
        let multiItems_pre = this.tp_handSonTable.getData();

        if(this.props.columnSummary.length >= 1){
            multiItems_pre = multiItems_pre.slice(0, -1);
        }

        for (var i = 0; i < multiItems_pre.length; ++i) {

            if(this.tp_handSonTable.isEmptyRow(i) === false){
                let row = {}
                multiItems_pre[i].map((Item_pre, index)=>{



                    if(index >= this.props.gridHeader.length){
                        row['id'] = Item_pre;
                    } else
                    {

                        row[this.props.gridHeader[index].column] = Item_pre
                    }

                })

                multiItems.push(row)


            }


        }

        return multiItems;

    }

    saveForm() {
        let multiItems = [];
        if(this.props.gridHeader.length >=1 ){
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
                          

                        } else if(this.props.after_save_redirect === true){
                            window.location.replace(this.props.after_save_redirect_url);
                        }else
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
        if(this.props.gridHeader.length >=1 ){
            multiItems = this.getDataTpMultiItem()
            if(multiItems.length <= 0){
                alert('Бүх хэсгийг бүрэн бөглөнө үү')
                return false;
            }

        }



        if (this.props.ifUpdateDisabledCanEditColumns.length <= 0)
            if (this.props.permission.u !== true &&  this.props.just_info === false)
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

        if(field.get('after_change_trigger')){
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
        }

        if(error === null && field.get('after_change_trigger')){

            let delay = field.getIn(['after_change_trigger', 'delay']);

            if(delay){
                
                this.timeout = setTimeout(()=> {
                    this.afterChangeCaller(realDataIndex, value);
                }, delay);

            } else {
                this.afterChangeCaller(realDataIndex, value);
            }


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
    afterChangeCaller(realDataIndex, value){
        afterChangeTrigger(realDataIndex, value, 'form').then((data)=>{
            if(data.status){
                if(data.status == 'success'){

                    this.afterChageSetValues(data.new_values);

                } else if(data.status == 'error'){
                    this.props.actions.setError(realDataIndex, data.error_message);

                    this.afterChageSetValues(data.new_values);
                }

            } else {
                this.afterChageSetValues(data);
            }

        })
    }
    afterChageSetValues(setValues){
        setValues.map(setValue=>{
            this.changeValues(setValue[0], setValue[1]);


            if(setValue[2] === false || setValue[2] === true){

                this.props.actions.changeStatus(setValue[0], setValue[2]);
            }
        })
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
                if (this.props.permission.u !== true && this.props.just_info === false)
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


                    if(this.props.gridHeader.length >= 1)
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
      
        this.props.actions.setShowAddEditForm(false);
  



        if(this.tp_handSonTable){
            this.tp_handSonTable.destroy();
            this.tp_handSonTable = null;

        }

  
    }

    componentDidMount(){
        if(this.props.gridHeader.length >=1 )
         this.setUpHandsonTable();


    }

    /* muli items form */


    callMultiItemsDatas(save_first_id_column) {



        if(this.props.permission.u !== true && this.props.just_info === false)
            return false;

        callMultiItems(save_first_id_column).then((data)=> {
            if(data.length <= 0)
                window.location.replace('#/');

            this.listData = data;
            this.setUpHandsonTable()
        });
    }
    handleDeleteItem(id, row) {


        if(id == -1){
            this.callMultiItemsDatas(save_first_id_column_)

        } else if(this.props.permission.d == true) {

            if (!confirm('Delete this record?')) {
                return;
            }
            else{
                if(id === null){
                    this.listData.splice(row, 1);
                } else {
                    deleteItem(id).then((data)=> {


                        if (data == 'success')
                            this.callMultiItemsDatas(save_first_id_column_)
                        else
                            alert("Please try agian")
                    });
                }

            }


        }
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
            formData_Imm,
            focusIndex,
            showAddEditForm,
            showAddModal,
            subItems,
            ifUpdateDisabledCanEditColumns,
            permission,
            locales,
            button_texts,
            defaultLocale,
            formClassName,
            fieldClassName
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
                formData={formData_Imm}
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
                fieldClassName={fieldClassName}
                just_info={this.props.just_info}

            />
            :
            <Loading />

        const formSubItmes = subItems.size >= 1 ?
            <SubItemsContainer formData={formData_Imm} subItems={subItems} edit_parent_id={edit_parent_id}
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

                                :  this.props.just_info === false
                                    ? <div>
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
            :
        null
                            }

                        </div>
                    </div>

                <Modal aria-labelledby="contained-modal-title-sm" className="modal-shadowed" show={savedAlertShow} onHide={hideSaveModal} >

                    <Modal.Body>
                        <h5 style={{color:'green'}}>
                            {this.props.save_alert_word}
                        </h5>
                        <button type="button" className="btn "
                                onClick={hideSaveModal}>
                            Хаах

                        </button>

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
        edit_delete_column_title: Grid.get('edit_delete_column_title'),
        locales: Grid.get('setup').toJS().locales,
        password_change: Grid.get('setup').toJS().password_change,
        defaultLocale: Grid.get('defaultLocale'),
        formControls: Form.get('form_input_control'),
        translateFormControls: Form.get('translateFormControls'),
        identity_name: Form.get('identity_name'),
        save_first_id_column: Form.get('save_first_id_column'),
        gridHeader: Form.get('multi_items_form_input_control').toJS(),
        showAddEditForm: Form.get('showAddEditForm'),
        formClassName: Form.get('formClassName'),
        fieldClassName: Form.get('fieldClassName'),
        focusIndex: Form.get('focusIndex'),
        formData: Form.get('formData').toJS(),
        formData_Imm: Form.get('formData'),
        subItems: SubItems.get('subItems'),
        button_texts: Grid.get('button_texts'),
        show_saved_alert: Form.get('show_saved_alert'),
        save_alert_word: Form.get('save_alert_word'),
        showInsertResponse: Form.get('showInsertResponse'),
        after_save_reload_page: Form.get('after_save_reload_page'),
        permission: Grid.get('setup').toJS().permission,
        just_info: Grid.get('setup').toJS().just_info,
        ifUpdateDisabledCanEditColumns: Grid.get('setup').toJS().ifUpdateDisabledCanEditColumns,
        after_save_redirect: Form.get('after_save_redirect'),
        after_save_redirect_url: Form.get('after_save_redirect_url'),
        columnSummary:Form.get('multi_items_columnSummary').toJS(),
        // listData:Form.get('listData').toJS()
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
