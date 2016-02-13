import React, { Component, PropTypes } from 'react'
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux'
import * as DataActions from '../actions/form'
import Header from '../components/grid/Header'
import Form from "../components/form/Form"
import validation from "../components/form/validation/"
import {save, edit, update, editTranslation, getCascadeChild} from "../api/"
import Window from "../components/window/"
import SubItemsContainer from "./formContainers/SubItemsContainer"


class AddEditContainer extends Component {

    checkValidate() {
        const FD = this.props.formControls;
        let foundError = false;

        FD.map((formColumn, index) => {
            if (formColumn.get('type') == '--group') {
                formColumn.get('controls').map((formColumnSub, subIndex) => {
                    const error = (validation(formColumnSub.get('value'), formColumnSub.get('validate')));
                    if (error) {
                        this.props.actions.setError([index, 'controls', subIndex], error);
                        foundError = true;
                    }
                })
            } else {
                const error = (validation(formColumn.get('value'), formColumn.get('validate')));
                if (error) {
                    this.props.actions.setError([index], error);
                    foundError = true;
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

        return foundError;
    }

    saveForm() {
        if (this.props.permission.c !== true)
            return false;
        const FD = this.props.formControls;

        let foundError = this.checkValidate();

        if (foundError === false)
            save(FD, this.props.translateFormControls, this.props.subItems).done((data)=> {
                if (data == 'success') {

                    window.location.replace('#/');
                }
            }).fail(()=> {
                alert("Уучлаарай алдаа гарлаа дахин оролдоно уу")
            })

    }

    updateForm() {
        if (this.props.ifUpdateDisabledCanEditColumns.length <= 0)
            if (this.props.permission.u !== true)
                return false;

        const FD = this.props.formControls;


        let foundError = this.checkValidate();

        if (foundError === false)
            update(FD, this.props.translateFormControls, this.props.params.id, this.props.subItems).done((data)=> {

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


        const error = validation(value, field.get('validate'));

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

        //clear form validation
        const FC = this.props.formControls;

        if (FC.size >= 1)
            this.props.actions.clearFromValidation();

        if (this.props.params.id) {

            if (this.props.ifUpdateDisabledCanEditColumns.length <= 0)
                if (this.props.permission.u !== true)
                    window.location.replace('#/');

            edit(this.props.params.id).then((data)=> {
                if (data.length >= 1)
                    this.props.formControls.map((formControl, index)=> {
                        //if (formControl.type === '--combogrid') {
                        //
                        //    this.props.actions.setComboGridText(formControl.column, data[0][formControl.column + "_" + formControl.options['textField']]);
                        //}
                        if (formControl.get('type') !== '--hidden' && formControl.get('type') !== '--group'){
                            if(formControl.get('type') == '--combobox'){

                                if(formControl.getIn(['options', 'child'])){

                                    getCascadeChild(formControl.getIn(['options', 'child']), data[0][formControl.get('column')]).then((dataChild)=>{
                                        this.props.actions.changeFormData(formControl.getIn(['options', 'child']), dataChild);

                                        this.props.actions.changeValue([index], data[0][formControl.get('column')])
                                    })

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

                                            getCascadeChild(control.getIn(['options', 'child']), data[0][control.get('column')]).then((dataChild)=>{
                                                this.props.actions.changeFormData(control.getIn(['options', 'child']), dataChild);

                                                this.props.actions.changeValue([index, 'controls', subIndex], data[0][control.get('column')])
                                            })
                                        } else
                                            this.props.actions.changeValue([index, 'controls', subIndex], data[0][control.get('column')])
                                    } else
                                        this.props.actions.changeValue([index, 'controls', subIndex], data[0][control.get('column')])
                                }


                            })

                        }

                    })
                else
                    alert('please try agian')

                this.props.actions.setShowAddEditForm(true)
            });


            editTranslation(this.props.params.id).then((data)=> {
                if (data.length >= 1)
                    this.props.translateFormControls.map((translateFormControl, locale_index)=> {
                        data.map((tdata)=> {

                            if (tdata.locale_id == translateFormControl.get('locale_id')) {
                                translateFormControl.get('translate_form_input_control').map((formControl, index)=> {

                                    if (formControl.get('type') !== '--hidden')
                                        this.props.actions.changeTranslationValue(locale_index, [index], tdata[formControl.get('column')])

                                })

                            }
                        })

                    })

            })


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
            button_texts
            } = this.props;





        const gridId = 'grid_table'


        const edit_parent_id = this.props.params.id ? this.props.params.id : false
        const containerForm = showAddEditForm === true
            ?
            <Form
                translateFormControls={translateFormControls}
                formControls={formControls}
                formData={formData}
                ref="fromRefs"
                locales={locales}
                focusIndex={focusIndex}
                gridId={gridId}
                ifUpdateDisabledCanEditColumns={ifUpdateDisabledCanEditColumns}
                permission={permission}
                edit_parent_id={edit_parent_id}
                changeHandler={this.changeValues.bind(this)}
                translateChangeHandler={this.translateChangeHandler.bind(this)}

            />
            :
            <div className="tp-laoder">
                <img src="/shared/table-properties/img/loader.gif" alt="Loading"/>
                <br/>
                Ачааллаж байна
            </div>

        const formSubItmes = subItems.size >= 1 ?
            <SubItemsContainer formData={formData} subItems={subItems} edit_parent_id={edit_parent_id}
                               ifUpdateDisabledCanEditColumns={ifUpdateDisabledCanEditColumns}
                               permission={permission}
                               showAddEditForm={showAddEditForm}/> : null


        return (
            <div className="">
                <Header pageName={setup.page_name} icon="fa fa-chevron-left" link="#/" type="addEdit"/>
                <div className="p-y-sm">
                    <div className="row  m-x-sm">
                        <div className="form-horizontal solar-form">

                            <div className="row">
                                {containerForm}

                                {formSubItmes}
                            </div>
                            <hr/>
                            <div>
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
                        </div>
                    </div>
                </div>
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
        formControls: Form.get('form_input_control'),
        translateFormControls: Form.get('translateFormControls'),
        showAddEditForm: Form.get('showAddEditForm'),
        focusIndex: Form.get('focusIndex'),
        formData: Form.get('formData'),
        subItems: SubItems.get('subItems'),
        button_texts: Grid.get('button_texts'),
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
