import React, { Component, PropTypes } from 'react'
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux'
import * as DataActions from '../actions/grid'
import Header from '../components/grid/Header'
import Form from "../components/form/Form"
import validation from "../components/form/validation/"
import {save, edit, update, editTranslation} from "../api/"
import Window from "../components/window/"
import SubItemsContainer from "./formContainers/SubItemsContainer"


class AddEditContainer extends Component {


    saveForm() {
        if (this.props.permission.c !== true)
            return false;
        const FD = this.props.formControls;

        let foundError = false;

        FD.map((fromColumn, index) => {
            const error = (validation(fromColumn.get('value'), fromColumn.get('validate')));
            if (error) {
                this.props.actions.setError([index], error);
                foundError = true;
            }

        })
        this.props.translateFormControls.map((locale, locale_index) => {

            locale.get('translate_form_input_control').map((fromColumn, index) => {
                const error = (validation(fromColumn.get('value'), fromColumn.get('validate')));
                if (error) {
                    this.props.actions.setTranslationError(locale_index, [index], error);
                    foundError = true;
                }

            })

        })

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

        let foundError = false;

        FD.map((fromColumn, index) => {
            const error = (validation(fromColumn.get('value'), fromColumn.get('validate')));
            if (error) {
                this.props.actions.setError([index], error);
                foundError = true;
            }

        })
        this.props.translateFormControls.map((locale, locale_index) => {

            locale.get('translate_form_input_control').map((fromColumn, index) => {
                const error = (validation(fromColumn.get('value'), fromColumn.get('validate')));
                if (error) {
                    this.props.actions.setTranslationError(locale_index, [index], error);
                    foundError = true;
                }

            })

        })

        if (foundError === false)
            update(FD, this.props.translateFormControls, this.props.params.id, this.props.subItems).done((data)=> {

                if (data == 'success' || 'none') {

                    window.location.replace('#/');
                }

            }).fail(()=> {
                alert("Уучлаарай алдаа гарлаа дахин оролдоно уу")
            })


    }

    // form field value recieve functions
    translateChangeHandler(locale_index, dataIndex, value) {


        this.props.actions.changeTranslationValue(locale_index, dataIndex, value);


        const FD = this.props.translateFormControls.getIn([locale_index, 'translate_form_input_control']);

        const field = FD.getIn(dataIndex);
        const error = validation(value, field.get('validate'));

        this.props.actions.setTranslationError(locale_index, dataIndex, error);



    }
    changeValues(dataIndex, value) {



        this.props.actions.changeValue(dataIndex, value);

        const field = this.props.formControls.getIn(dataIndex);
        const error = validation(value, field.get('validate'));

        this.props.actions.setError(dataIndex, error);


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
                        if(formControl.get('type') !== '--hidden')
                        this.props.actions.changeValue([index], data[0][formControl.get('column')])
                    })
                else
                    alert('please try agian')

                this.props.actions.setShowAddEditForm(true)
            });


            editTranslation(this.props.params.id).then((data)=>{
                    if (data.length >= 1)
                        this.props.translateFormControls.map((translateFormControl, locale_index)=>{
                            data.map((tdata)=>{

                                if(tdata.locale_id == translateFormControl.get('locale_id')){
                                    translateFormControl.get('translate_form_input_control').map((formControl, index)=> {

                                        if(formControl.get('type') !== '--hidden')
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
            locales
            } = this.props;
        const gridId = 'grid_table'

        const addFrom = this.props.params.id ? false : true;

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
                  addFrom={addFrom}
                  changeHandler={this.changeValues.bind(this)}
                  translateChangeHandler={this.translateChangeHandler.bind(this)}

            />
            :
            <div className="tp-laoder">
                <img src="/shared/table-properties/img/loader.gif" alt="Loading"/>
                <br/>
                Ачааллаж байна
            </div>
        const edit_parent_id = this.props.params.id ? this.props.params.id : false
        const formSubItmes = subItems.length >= 1 ?
            <SubItemsContainer formData={formData} subItems={subItems} edit_parent_id={edit_parent_id}
                               ifUpdateDisabledCanEditColumns={ifUpdateDisabledCanEditColumns}
                               permission={permission}
                               showAddEditForm={showAddEditForm}/> : null


        return (
            <div className="">
                <Header pageName={setup.page_name} icon="fa fa-chevron-left" link="#/" type="addEdit"/>
                <div className="p-y-sm">
                    <div className="row  m-x-sm">
                        <div className="form-horizontal solar-form p-a-md">

                            <div className="row">
                                {containerForm}

                                {formSubItmes}
                            </div>
                            <hr/>
                            <div>
                                {this.props.params.id
                                    ? <button type="button" className="btn btn-fw btn-success p-h-lg"
                                              onClick={this.updateForm.bind(this)}>
                                    <i className="material-icons">&#xE2C3;</i>
                                </button>
                                    :
                                    <button type="button" className="btn btn-fw btn-success p-h-lg"
                                            onClick={this.saveForm.bind(this)}>
                                        <i className="material-icons">&#xE2C3;</i>
                                    </button>
                                }
                                &nbsp;
                                <a href="#/" className="btn btn-fw danger p-h-lg">
                                    <i className="material-icons">&#xE5CD;</i>
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


    return {
        setup: Grid.get('setup').toJS(),
        locales: Grid.get('setup').toJS().locales,
        translateFormControls: Grid.get('translateFormControls'),
        showAddEditForm: Grid.get('showAddEditForm'),
        focusIndex: Grid.get('focusIndex'),
        formData: Grid.get('formData'),
        formControls: Grid.get('form_input_control'),
        subItems: SubItems.get('subItems').toJS(),
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
