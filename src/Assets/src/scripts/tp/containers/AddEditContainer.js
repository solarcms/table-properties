import React, { Component, PropTypes } from 'react'
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux'
import * as DataActions from '../actions/grid'
import Header from '../components/grid/Header'
import Form from "../components/form/Form"
import validation from "../components/form/validation/"
import {save, edit, update} from "../api/"
import Window from "../components/window/"


class AddEditContainer extends Component {
    //// ComboboxAdableForm
    openComboboxAdableForm(column){

        this.showModal(column);
    }
    showModal(column){

   //     $('#windowForm'+column).modal({'backdrop': false}, 'show');

        this.props.actions.setAddModal(true);

    }
    hideModal(column){

        $('#windowForm'+column).modal('hide');
        //this.props.actions.clearFromValidation();
    }
    changeValuesWindow(e, type, cvalue, text, column){

        //if(type && type === 'combo-grid'){
        //
        //
        //    this.props.actions.setComboGridText(column, text);
        //
        //    let index = null
        //
        //    this.props.formControls.map((FC, FC_index)=>{
        //        if(FC.column == column)
        //            index = FC_index
        //    });
        //
        //    const value = cvalue;
        //
        //    const FD = this.props.formControls;
        //
        //    this.props.actions.chagenValue(index, value)
        //
        //    // check validation with on change
        //    const error = (validation(value, FD[index].validate));
        //
        //    this.props.actions.setError(index, error);
        //
        //    $("#combo-grid-"+column).removeClass('open');
        //
        //
        //} else if(type && type === 'combobox'){
        //
        //    const index = text.replace("grid_table-solar-input", "");
        //    const value = cvalue;
        //
        //
        //    const FD = this.props.formControls;
        //
        //
        //    this.props.actions.chagenValue(index, value)
        //
        //
        //    // check validation with on change
        //    const error = (validation(value, FD[index].validate));
        //    this.props.actions.setError(index, error);


        //}
        //
        //else {
        //    const index = e.target.name.replace("grid_table-solar-input", "");
        //    const value = e.target.value;
        //
        //
        //    const FD = this.props.formControls;
        //
        //    e.target.type == 'checkbox' ?
        //        e.target.checked ?
        //            this.props.actions.chagenValue(index, value)
        //            :
        //            this.props.actions.chagenValue(index, 0)
        //        :
        //        this.props.actions.chagenValue(index, value)
        //
        //
        //    // check validation with on change
        //    const error = (validation(value, FD[index].validate));
        //    this.props.actions.setError(index, error);
        //}


    }
    //// ComboboxAdableForm
    saveForm(){
        const FD = this.props.formControls;

        let foundError = false;

        FD.map((fromColumn, index) => {
            const error = (validation(fromColumn.value, fromColumn.validate));
            if(error){
                this.props.actions.setError(index, error);
                foundError = true;
            }

        })

        if(foundError === false)
            save(FD).done((data)=>{

                if(data == 'success'){
                    this.props.actions.clearFromValidation();
                    window.location.replace('#/');
                }

            }).fail(()=>{
                alert("Уучлаарай алдаа гарлаа дахин оролдоно уу")
            })

    }

    updateForm(){

        const FD = this.props.formControls;

        let foundError = false;

        FD.map((fromColumn, index) => {
            const error = (validation(fromColumn.value, fromColumn.validate));
            if(error){
                this.props.actions.setError(index, error);
                foundError = true;
            }

        })

        if(foundError === false)
            update(FD, this.props.params.id).done((data)=>{

                if(data == 'success' || 'none'){
                    this.props.actions.clearFromValidation();
                    window.location.replace('#/');
                }

            }).fail(()=>{
                alert("Уучлаарай алдаа гарлаа дахин оролдоно уу")
            })

    }
    // form field value recieve functions
    changeValues(e, type, cvalue, text, column){



        if(type && type === 'combo-grid'){


            this.props.actions.setComboGridText(column, text);

            let index = null

            this.props.formControls.map((FC, FC_index)=>{
                if(FC.column == column)
                    index = FC_index
            });

            const value = cvalue;

            const FD = this.props.formControls;

            this.props.actions.chagenValue(index, value)

            // check validation with on change
            const error = (validation(value, FD[index].validate));

            this.props.actions.setError(index, error);

            $("#combo-grid-"+column).removeClass('open');


        } else if(type && type === 'manual'){

            const index = text.replace("grid_table-solar-input", "");
            const value = cvalue;


            const FD = this.props.formControls;


            this.props.actions.chagenValue(index, value)


            // check validation with on change
            const error = (validation(value, FD[index].validate));
            this.props.actions.setError(index, error);


        }

        else {
            const index = e.target.name.replace("grid_table-solar-input", "");
            const value = e.target.value;



            const FD = this.props.formControls;

            e.target.type == 'checkbox' ?
                    e.target.checked ?
                        this.props.actions.chagenValue(index, value)
                    :
                        this.props.actions.chagenValue(index, 0)
                :
                this.props.actions.chagenValue(index, value)


            // check validation with on change
            const error = (validation(value, FD[index].validate));
            this.props.actions.setError(index, error);
        }


    }

    componentWillMount() {

        //clear form validation
        const FC = this.props.formControls;

        if(FC.length >= 1)
            this.props.actions.clearFromValidation();

        if(this.props.params.id){

            edit(this.props.params.id).then((data)=> {
                if(data.length >= 1)
                    this.props.formControls.map((formControl, index)=>{
                        if(formControl.type === '--combogrid'){

                            this.props.actions.setComboGridText(formControl.column, data[0][formControl.column+"_"+formControl.options['textField']]);
                        }
                        this.props.actions.chagenValue(index, data[0][formControl.column])
                    })
                else
                    alert('please try agian')

                this.props.actions.setShowAddEditForm(true)
            });
        } else {

            this.props.actions.setShowAddEditForm(true)
        }


    }
    componentWillUnmount(){
        this.props.actions.setShowAddEditForm(false)
    }
    render() {

        const { setup, formControls, formData, focusIndex, showAddEditForm, showAddModal } = this.props;




        const gridId = 'grid_table'

        let ComboboxAddableForm = formControls.map((field, index) => {
            if (field.type == '--combobox-addable') {


                return <Window key={index}
                               id={field.column}
                    formControls={field.options.form_input_control}
                    formData={formData}
                    pageName={field.options.page_name}
                               show={showAddModal}
                    changeHandler={this.changeValuesWindow.bind(this)}
                    saveForm={this.saveForm.bind(this)}
                    hideModal={this.hideModal.bind(this, field.column)}
                />

            }

        })

        const containerForm = showAddEditForm === true
        ?
            <Form formControls={formControls}
                  formData={formData}
                  ref="fromRefs"
                  focusIndex={focusIndex}
                  gridId={gridId}

                  changeHandler={this.changeValues.bind(this)}
                  openComboboxAdableForm={this.openComboboxAdableForm.bind(this)}
            />
        :
            <div className="tp-laoder">
                <img src="/shared/table-properties/img/loader.gif" alt="Loading"/>
                <br/>
                Ачааллаж байна
            </div>


        return (
            <div className="">
                <Header pageName={setup.page_name} icon="fa fa-chevron-left" link="#/" type="addEdit"

                       />
                <div className="p-y-sm">
                    <div className="row white m-x-sm" >
                            <div className="form-horizontal solar-form p-a-md" >

                                {containerForm}

                                <div>
                                    {this.props.params.id
                                        ?   <button type="button" className="btn btn-fw btn-success p-h-lg" onClick={this.updateForm.bind(this)}>
                                                    <i className="material-icons">&#xE2C3;</i>
                                            </button>
                                        :
                                            <button type="button" className="btn btn-fw btn-success p-h-lg" onClick={this.saveForm.bind(this)}>
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

                {ComboboxAddableForm}

            </div>

        )
    }
}

AddEditContainer.defaultProps = {
    setup: {},
    formControls: []
}
AddEditContainer.propTypes = {
    setup: PropTypes.object.isRequired,
    formControls: PropTypes.array.isRequired
}

function mapStateToProps(state) {
    const TpStore = state.TpStore;
    const ComboBox = state.ComboBox;

    return {
        setup: TpStore.get('setup').toJS(),
        showAddEditForm: TpStore.get('showAddEditForm'),
        focusIndex: TpStore.get('focusIndex'),
        formData: TpStore.get('formData').toJS(),
        formControls: TpStore.get('setup').toJS().form_input_control,
        showAddModal: ComboBox.get('showAddModal')
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
