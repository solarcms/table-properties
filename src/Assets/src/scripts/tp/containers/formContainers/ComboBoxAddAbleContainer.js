import React, { Component, PropTypes } from 'react'
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux'
import * as DataActions from '../../actions/comboBoxAddAble'
import {saveComboAdd, getComboList} from "../../api/comboAddAble"
import Window from "../../components/window/"
import Select from 'react-select';
import validation from "../../components/form/validation/"

class ComboBoxAddAbleContainer extends Component {
    callPageDatas(CAcolumn) {
        getComboList(CAcolumn).then((data)=> {
            this.props.actions.changeFormData(CAcolumn, data);
        });
    }
    showModal(column) {

        this.props.actions.setModal('combo-'+column, true);
    }
    hideModal(column, CAIndex) {
        this.props.actions.setModal('combo-'+column, false);
        this.props.actions.clearFromValidation(CAIndex);
    }
    saveForm(CAcolumn, CAIndex){
        const FD = this.props.comboBoxs[CAIndex].form_input_control;

        let foundError = false;

        FD.map((fromColumn, index) => {
            const error = (validation(fromColumn.value, fromColumn.validate));
            if(error){
                this.props.actions.setError(CAcolumn, CAIndex, index, error);
                foundError = true;
            }

        })

        if(foundError === false)
            saveComboAdd(CAcolumn, FD).done((data)=>{

                if(data == 'success'){
                    this.callPageDatas(CAcolumn);
                    this.hideModal(CAcolumn, CAIndex);
                }

            }).fail(()=>{
                alert("Уучлаарай алдаа гарлаа дахин оролдоно уу")
            })

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

            const FD = this.props.comboBoxs[CAIndex].form_input_control;

            this.props.actions.chagenValue(CAcolumn, CAIndex, index, value)

            // check validation with on change
            const error = (validation(value, FD[index].validate));

            this.props.actions.setError(CAcolumn, CAIndex, index, error);

            $("#combo-grid-"+column).removeClass('open');


        } else if(type && type === 'manual'){

            const index = text.replace(CAcolumn+"-solar-input", "");
            const value = cvalue;


            const FD = this.props.comboBoxs[CAIndex].form_input_control;


            this.props.actions.chagenValue(CAcolumn, CAIndex, index, value)


            // check validation with on change
            const error = (validation(value, FD[index].validate));
            this.props.actions.setError(CAcolumn, CAIndex, index, error);


        }

        else {
            const index = e.target.name.replace(CAcolumn+"-solar-input", "");
            const value = e.target.value;

            const FD = this.props.comboBoxs[CAIndex].form_input_control;

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
        this.props.actions.addModal('combo-'+this.props.column);
        this.props.actions.addComboAddAble(this.props.column, {column: this.props.column, form_input_control: this.props.formControls});

    }
    componentWillUnmount(){

    }
    componentDidMount(){

    }

    render() {

        const {disabled, modals, fieldClass, formData, column, fieldOptions, value, changeHandler, errorText, formType, placeholder, pageName, name, formControls, showAddModal, comboBoxs } = this.props;

        let options = [];
        if(formData[column])
            formData[column].data.data.map((data, sindex)=>{
                if (fieldOptions.textField instanceof Array) {
                    let arrayLabel = "";
                    for (var i = 0; i < fieldOptions.textField.length; ++i) {
                        if(i == 0)
                            arrayLabel = data[fieldOptions.textField[i]]
                        else
                            arrayLabel = arrayLabel +", "+ data[fieldOptions.textField[i]]
                    }

                    options.push({value: data[fieldOptions.valueField], label: arrayLabel})
                }
                else {
                    options.push({value: data[fieldOptions.valueField], label: data[fieldOptions.textField]})
                }

            })

        let windowForm = null;
       if(comboBoxs.length >= 1)
        windowForm = comboBoxs.map((comboBox, index) => {




                if(comboBox.column == column){
                    let shwoModal = false;

                    modals.map((modal) => {
                        if(modal.name == "combo-"+comboBox.column)
                            shwoModal = modal.show;
                    })
                    return <Window key={index}
                                   id={comboBox.column}
                                   formControls={comboBox.form_input_control}
                                   formData={formData}
                                   pageName={pageName}
                                   show={shwoModal}
                                   permission={{c:true, r:true, u:true, d:false}}
                                   ifUpdateDisabledCanEditColumns={[]}
                                   changeHandler={this.changeValues.bind(this, comboBox.column, index)}
                                   saveForm={this.saveForm.bind(this, comboBox.column, index)}
                                   hideModal={this.hideModal.bind(this, comboBox.column, index)}
                    />
                }





        })






        return (
            <div className={`form-group ${fieldClass}  col-md-12`}>
                {formType == 'inline' ? '' : <label className="control-label">{placeholder}</label>}

                {formData[column] ?

                    <Select className="addable-combo"
                            disabled={disabled}
                        name={name}
                        value={value}
                        options={options}
                        onChange={changeHandler}
                            placeholder={`Сонгох`}
                    />
                    :
                    null}

                <button className="btn btn-primary add-btn combo-add-btn" onClick={this.showModal.bind(this,column)} disabled={disabled}>
                    <i className="material-icons">&#xE145;</i>
                </button>

                    <span className="help-block">
                            {errorText}
                    </span>
                {windowForm}
            </div>

        )
    }
}

ComboBoxAddAbleContainer.defaultProps = {
    comboBoxs: []
}
ComboBoxAddAbleContainer.propTypes = {
    comboBoxs: PropTypes.array.isRequired
}

function mapStateToProps(state) {

    const ComboBoxAddAble = state.ComboBoxAddAble;
    const Modal = state.Modal;

    return {

        modals: Modal.get('modals').toJS(),
        comboBoxs: ComboBoxAddAble.get('comboBoxs').toJS()
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
)(ComboBoxAddAbleContainer)
