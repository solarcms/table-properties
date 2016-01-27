import React, { Component, PropTypes } from 'react'
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux'
import * as DataActions from '../../actions/subItems'
import {subItems_edit_request, delete_sub_item} from "../../api/subItems"
import Window from "../../components/window/"
import Select from 'react-select';
import validation from "../../components/form/validation/"
import Form from "../../components/form/Form"

class SubItemsContainer extends Component {

    showModal(column) {
        this.props.actions.setModal('sub-items-'+column, true);
    }
    hideModal(column, CAIndex) {
        this.props.actions.setModal('sub-items-'+column, false);
        this.props.actions.clearFromValidation(CAIndex);
    }
    delete(column, CAIndex, deleteItem) {

        if(this.props.permission.d !== true)
            return false;

        this.hideModal(column, CAIndex);

        this.props.actions.deleteSubItem(CAIndex, this.props.editIndex);

        if(deleteItem[this.props.editIndex].id !== null)
            delete_sub_item(column, deleteItem[this.props.editIndex].id)



    }
    saveForm(CAcolumn, CAIndex){


            const FD = this.props.subItems[CAIndex].form_input_control;

            let foundError = false;

            FD.map((fromColumn, index) => {
                const error = (validation(fromColumn.value, fromColumn.validate));
                if(error){
                    this.props.actions.setError(CAcolumn, CAIndex, index, error);
                    foundError = true;
                }

            })

            if(foundError === false){

                if(this.props.editIndex == -1) {
                    // add
                    this.props.actions.addSubItem(CAIndex, {id:null, data:FD})
                } else {
                    //update
                    this.props.actions.updateSubItem(CAIndex, this.props.editIndex, FD)
                }


                this.props.actions.clearFromValidation(CAIndex);
                this.hideModal(CAcolumn, CAIndex);
            }



    }
    editItem(CAIndex, FD, connect_column, savedIndex){

        this.props.actions.editSubItem(CAIndex, FD, savedIndex);
        this.showModal(connect_column)
    }
    changeValues(CAcolumn, CAIndex, e, type, cvalue, text, column){


        if(type && type === 'combo-grid'){


            this.props.actions.setComboGridText(column, text);

            let index = null

            this.props.formControls.map((FC, FC_index)=>{
                if(FC.column == column)
                    index = FC_index
            });

            const value = cvalue;

            const FD = this.props.subItems[CAIndex].form_input_control;

            this.props.actions.chagenValue(CAcolumn, CAIndex, index, value)

            // check validation with on change
            const error = (validation(value, FD[index].validate));

            this.props.actions.setError(CAcolumn, CAIndex, index, error);

            $("#combo-grid-"+column).removeClass('open');


        } else if(type && type === 'manual'){

            const index = text.replace("sub-items-"+CAcolumn+"-solar-input", "");
            const value = cvalue;


            const FD = this.props.subItems[CAIndex].form_input_control;


            this.props.actions.chagenValue(CAcolumn, CAIndex, index, value)


            // check validation with on change
            const error = (validation(value, FD[index].validate));
            this.props.actions.setError(CAcolumn, CAIndex, index, error);


        }

        else {
            const index = e.target.name.replace("sub-items-"+CAcolumn+"-solar-input", "");
            const value = e.target.value;

            const FD = this.props.subItems[CAIndex].form_input_control;

            e.target.type == 'checkbox' ?
                e.target.checked ?
                    this.props.actions.chagenValue(CAcolumn, CAIndex, index, value)
                    :
                    this.props.actions.chagenValue(index, 0)
                :
                this.props.actions.chagenValue(CAcolumn, CAIndex, index, value)


            // check validation with on change
            const error = (validation(value, FD[index].validate));
            this.props.actions.setError(CAcolumn, CAIndex, index, error);
        }


    }
    componentWillMount() {

        this.props.subItems.map((subItem, index) => {
            this.props.actions.addModal('sub-items-'+subItem.connect_column);
        })

        if(this.props.edit_parent_id){
            this.props.subItems.map((subItem, index) => {


                subItems_edit_request(subItem.connect_column, this.props.edit_parent_id).then((data)=> {
                    if(data.length >= 1)
                        data.map((edit_data)=>{
                            let FD = [];

                            subItem.form_input_control.map((form_i_c, edit_index)=>{

                                if(form_i_c.options)
                                    FD.push({
                                        column: form_i_c.column,
                                        title: form_i_c.title,
                                        type: form_i_c.type,
                                        value: edit_data[form_i_c.column],
                                        validate: form_i_c.validate,
                                        options:form_i_c.options
                                    });
                                else if(form_i_c.choices)
                                    FD.push({
                                        column: form_i_c.column,
                                        title: form_i_c.title,
                                        type: form_i_c.type,
                                        value: edit_data[form_i_c.column],
                                        validate: form_i_c.validate,
                                        choices: form_i_c.choices
                                    });
                                else
                                    FD.push({
                                        column: form_i_c.column,
                                        title: form_i_c.title,
                                        type: form_i_c.type,
                                        value: edit_data[form_i_c.column],
                                        validate: form_i_c.validate
                                    });

                            })

                            this.props.actions.addSubItem(index, {id:edit_data.id, data:FD});
                        })

                });


            })

        }


    }
    componentWillUnmount(){
        this.props.actions.clearSubItems();
    }
    render() {

        const {subItems, formData, modals, showAddEditForm,
            ifUpdateDisabledCanEditColumns,
            permission
            } = this.props;


        const Items = showAddEditForm === true ? subItems.map((subItem, index)=>{

            let shwoModal = false;

            modals.map((modal) => {
                if(modal.name == "sub-items-"+subItem.connect_column)
                    shwoModal = modal.show;
            })


            const savedItems = subItem.items.map((savedItem, savedIndex)=>
                <span key={savedIndex} className="savedIems">
                    {savedIndex+1}.
                    <button className="btn btn-success "  onClick={this.editItem.bind(this, index, savedItem.data, subItem.connect_column, savedIndex)}>
                        <i className="material-icons done">&#xE876;</i>
                        <i className="material-icons edit">&#xE254;</i>
                    </button>
                </span>

            )
            const showDelete = this.props.permission.d == true ? this.props.editIndex == -1 ? false : true : false
            return <div key={index} className="sub-items col-md-12">
                        <h5>{subItem.page_name}</h5>


                {savedItems}




                <button className="btn btn-primary add-btn" onClick={this.showModal.bind(this,subItem.connect_column)}>
                    <i className="material-icons">&#xE145;</i>
                </button>

                <Window key={index}
                        id={`sub-items-${subItem.connect_column}`}
                        formControls={subItem.form_input_control}
                        formData={formData}
                        pageName={subItem.page_name}
                        show={shwoModal}
                        changeHandler={this.changeValues.bind(this, subItem.connect_column, index)}
                        saveForm={this.saveForm.bind(this, subItem.connect_column, index)}
                        hideModal={this.hideModal.bind(this, subItem.connect_column, index)}
                        delete={this.delete.bind(this, subItem.connect_column, index, subItem.items)}
                        permission={{c:true, r:true, u:true, d:true}}
                        ifUpdateDisabledCanEditColumns={[]}
                        showDelete={showDelete}
                />

                    </div>

        }) : null


        return (
            <div>
                {Items}
            </div>

        )
    }
}

SubItemsContainer.defaultProps = {
    subItems: [],
    permission:{c:false, r:false, u:false, d:false}
}
SubItemsContainer.propTypes = {
    subItems: PropTypes.array.isRequired
}

function mapStateToProps(state) {
    const SubItems = state.SubItems;
    const Modal = state.Modal;
    const TpStore = state.TpStore;

    return {
        modals: Modal.get('modals').toJS(),
        editIndex: SubItems.get('editIndex'),
        permission: TpStore.get('setup').toJS().permission,
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
)(SubItemsContainer)
