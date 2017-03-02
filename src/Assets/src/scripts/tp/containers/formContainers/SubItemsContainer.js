import React, { Component, PropTypes } from 'react'
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux'
import * as DataActions from '../../actions/subItems'
import {subItems_edit_request, delete_sub_item, getCascadeChild} from "../../api/subItems"
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

        if(deleteItem.getIn([this.props.editIndex, 'id']) !== null)
            delete_sub_item(column, deleteItem.getIn([this.props.editIndex, 'id']))



    }
    checkValidate(CAcolumn, CAIndex) {
        const FD = this.props.subItems.getIn([CAIndex, 'form_input_control']);
        let foundError = false;

        FD.map((formColumn, index) => {
            if (formColumn.get('type') == '--group') {
                formColumn.get('controls').map((formColumnSub, subIndex) => {
                    const error = (validation(formColumnSub.get('value'), formColumnSub.get('validate')));
                    if (error) {
                        this.props.actions.setError(CAcolumn, CAIndex, [index, 'controls', subIndex], error);

                        foundError = true;
                    }
                })
            } else {
                const error = (validation(formColumn.get('value'), formColumn.get('validate')));
                if (error) {
                    this.props.actions.setError(CAcolumn, CAIndex, [index], error);

                    foundError = true;
                }
            }
        })


        return foundError;
    }
    saveForm(CAcolumn, CAIndex){


        const FD = this.props.subItems.getIn([CAIndex, 'form_input_control']);
        const translateFormControls = this.props.subItems.getIn([CAIndex, 'translateFormControls']);

        let foundError = this.checkValidate(CAcolumn, CAIndex);


            if(foundError === false){

                if(this.props.editIndex == -1) {

                    // add
                    this.props.actions.addSubItem(CAIndex, {id:null, data:FD.toJS(), translateFormControls: translateFormControls.toJS()})
                } else {
                    //update
                    this.props.actions.updateSubItem(CAIndex, this.props.editIndex, FD, translateFormControls)
                }


                this.props.actions.clearFromValidation(CAIndex);
                this.hideModal(CAcolumn, CAIndex);
            }



    }
    editItem(CAIndex, FD, connect_column, savedIndex, translateFormControls){


        this.props.actions.editSubItem(CAIndex, FD, savedIndex, translateFormControls);
        this.showModal(connect_column)
    }
    changeChildValue(CAcolumn, CAIndex, realDataIndex){


        let childIndex = realDataIndex;

        childIndex[childIndex.length-1] = childIndex[childIndex.length-1]+1;

        const childField = this.props.subItems.getIn([CAIndex, 'form_input_control']).getIn(childIndex);


        this.props.actions.chagenValue(CAcolumn, CAIndex, childIndex, null)

        if(childField.getIn(['options', 'child'])){
            this.changeChildValue(CAcolumn, CAIndex, childIndex);
        }

    }
    translateChangeHandler(CAcolumn, CAIndex, locale_index, dataIndex, value) {

        let realDataIndex = [];

        dataIndex.map((dIndex, index)=> {
            if (index == 0) {
                realDataIndex.push(dIndex);
            } else if (index >= 1) {
                realDataIndex.push('controls')
                realDataIndex.push(dIndex)
            }
        })


        this.props.actions.changeTranslationValue(CAcolumn, CAIndex,locale_index, realDataIndex, value);


        const FD = this.props.subItems.getIn([CAIndex, 'translateFormControls', locale_index, 'translate_form_input_control']);

        const field = FD.getIn(realDataIndex);
        const error = validation(value, field.get('validate'));

        this.props.actions.setTranslationError(CAcolumn, CAIndex, locale_index, realDataIndex, error);


    }
    changeValues(CAcolumn, CAIndex, dataIndex, value){

        let realDataIndex = [];

        dataIndex.map((dIndex, index)=> {
            if (index == 0) {
                realDataIndex.push(dIndex);
            } else if (index >= 1) {
                realDataIndex.push('controls')
                realDataIndex.push(dIndex)
            }
        })

        this.props.actions.chagenValue(CAcolumn, CAIndex, realDataIndex, value)


        const field = this.props.subItems.getIn([CAIndex, 'form_input_control']).getIn(realDataIndex);


        const error = validation(value, field.get('validate'));




        this.props.actions.setError(CAcolumn, CAIndex, realDataIndex, error);

        /// cascad call
        if(field.get('type') == '--combobox'){
            if(field.getIn(['options', 'child'])){

                this.changeChildValue(CAcolumn, CAIndex, realDataIndex);

                getCascadeChild(field.getIn(['options', 'child']), value).then((data)=>{
                    this.props.actions.changeFormData(field.getIn(['options', 'child']), data);
                })
            }
        }



    }
    setErrorManuale(CAcolumn, CAIndex, dataIndex, error){
        
      if(error){
          let realDataIndex = [];

          dataIndex.map((dIndex, index)=> {
              if (index == 0) {
                  realDataIndex.push(dIndex);
              } else if (index >= 1) {
                  realDataIndex.push('controls')
                  realDataIndex.push(dIndex)
              }
          })
          this.props.actions.setError(CAcolumn, CAIndex, realDataIndex, error)
      }

    }
    componentWillMount() {



        this.props.subItems.map((subItem, index) => {
            this.props.actions.addModal('sub-items-'+subItem.get('connect_column'));
        })

        if(this.props.edit_parent_id){
            this.props.subItems.map((subItem, index) => {


                subItems_edit_request(subItem.get('connect_column'), this.props.edit_parent_id).then((data)=> {
                    if(data.length >= 1)
                        data.map((edit_data)=>{
                            let FD = [];

                            subItem.get('form_input_control').map((form_i_c, edit_index)=>{


                                if(form_i_c.get('type') !== '--group'){


                                        FD.push({
                                            column: form_i_c.get('column'),
                                            show: form_i_c.get('show'),
                                            title: form_i_c.get('title'),
                                            type: form_i_c.get('type'),
                                            value: edit_data[form_i_c.get('column')],
                                            validate: form_i_c.get('validate'),
                                            options:form_i_c.get('options'),
                                            choices: form_i_c.get('choices'),
                                            parent: form_i_c.get('parent'),
                                            child: form_i_c.get('child'),
                                        });

                                } else {


                                    let edit_controls = [];

                                        form_i_c.get('controls').map((scontrol, sub_edit_index)=>{


                                            edit_controls.push({
                                                show: form_i_c.get('show'),
                                                column: scontrol.get('column'),
                                                title: scontrol.get('title'),
                                                type: scontrol.get('type'),
                                                value: edit_data[scontrol.get('column')],
                                                validate: scontrol.get('validate'),
                                                choices: scontrol.get('choices'),
                                                options:scontrol.get('options'),
                                                parent:scontrol.get('parent'),
                                                child:scontrol.get('child')
                                            });


                                    })


                                    FD.push({
                                        title: form_i_c.get('title'),
                                        type: '--group',
                                        controls: edit_controls
                                    });
                                }



                            });

                            let TFD = [];
                            subItem.get('translateFormControls').map((translateFormControl, l_index)=> {

                                let translate_form_input_control = [];
                                translateFormControl.get('translate_form_input_control').map((formControl, index)=> {

                                    if(data[0][formControl.get('column')] !== null && data[0][formControl.get('column')] != ''){
                                        let json_translations =  JSON.parse(edit_data[formControl.get('column')]);

                                        json_translations.map((json_translation) =>{
                                            if(json_translation.locale == translateFormControl.get('locale_code')){
                                                if (formControl.get('type') !== '--hidden'){
                                                    translate_form_input_control.push({
                                                        column: formControl.get('column'),
                                                        show: formControl.get('show'),
                                                        title: formControl.get('title'),
                                                        type: formControl.get('type'),
                                                        value: json_translation.value,
                                                        validate: formControl.get('validate'),
                                                        options:formControl.get('options'),
                                                        choices: formControl.get('choices'),
                                                        parent: formControl.get('parent'),
                                                        child: formControl.get('child'),
                                                    });
                                                }

                                            }

                                        })
                                    }





                                })

                                TFD.push({
                                    locale_id: translateFormControl.get('locale_id'),
                                    locale_code: translateFormControl.get('locale_code'),
                                    translate_form_input_control: translate_form_input_control
                                });


                            })



                            this.props.actions.addSubItem(index, {id:edit_data.id, data:FD, translateFormControls:TFD});
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
            permission,
            translateFormControls,
            button_texts
            } = this.props;


        const Items = showAddEditForm === true ? subItems.map((subItem, index)=>{

            let shwoModal = false;

            modals.map((modal) => {
                if(modal.get('name') == "sub-items-"+subItem.get('connect_column'))
                    shwoModal = modal.get('show');
            })



            const savedItems = subItem.get('items').map((savedItem, savedIndex)=>{
                let gridText = '';
                return <div className="col-md-6 savedIems" key={savedIndex} >

                    {subItem.get('grid_columns').map((g_column, col_index)=>{
                        let dataColumn = savedItem.get('data').filter((data_v)=>data_v.get('column') == g_column);
                        gridText = gridText + dataColumn.getIn([0, 'value'])+' ';
                    })}

                    <span dangerouslySetInnerHTML={{__html: gridText}} />
                    <button className="btn btn-success "  onClick={this.editItem.bind(this, index, savedItem.get('data'), subItem.get('connect_column'), savedIndex, savedItem.get('translateFormControls'))}>
                        <i className="material-icons done">&#xE876;</i>
                        <i className="material-icons edit">&#xE254;</i>
                    </button>

                </div>
            })
            const showDelete = this.props.permission.d == true ? this.props.editIndex == -1 ? false : true : false;
           
            return <div key={index} className="sub-items">
                        <h5>{subItem.get('page_name')}</h5>
                {savedItems}
                <button className="btn btn-primary add-btn" onClick={this.showModal.bind(this,subItem.get('connect_column'))}>
                    <i className="material-icons">&#xE145;</i>
                </button>
                <p >{subItem.get('description')}</p>
                <Window key={index}
                        id={`sub-items-${subItem.get('connect_column')}`}
                        translateFormControls={subItem.get('translateFormControls')}
                        formControls={subItem.get('form_input_control')}
                        edit_parent_id={subItem.getIn(['items', this.props.editIndex, 'id'])}
                        formData={formData}
                        pageName={subItem.get('page_name')}
                        show={shwoModal}
                        setErrorManuale={this.setErrorManuale.bind(this, subItem.get('connect_column'), index)}
                        changeHandler={this.changeValues.bind(this, subItem.get('connect_column'), index)}
                        translateChangeHandler={this.translateChangeHandler.bind(this, subItem.get('connect_column'), index)}
                        saveForm={this.saveForm.bind(this, subItem.get('connect_column'), index)}
                        hideModal={this.hideModal.bind(this, subItem.get('connect_column'), index)}
                        delete={this.delete.bind(this, subItem.get('connect_column'), index, subItem.get('items'))}
                        permission={{c:true, r:true, u:true, d:true}}
                        ifUpdateDisabledCanEditColumns={[]}
                        showDelete={showDelete}
                        button_texts={button_texts}
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

    permission:{c:false, r:false, u:false, d:false}
}
SubItemsContainer.propTypes = {
    subItems: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    const SubItems = state.SubItems;

    const Modal = state.Modal;
    const Grid = state.Grid;

    return {
        modals: Modal.get('modals'),
        editIndex: SubItems.get('editIndex'),
        permission: Grid.get('setup').toJS().permission,
        button_texts: Grid.get('button_texts'),
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
