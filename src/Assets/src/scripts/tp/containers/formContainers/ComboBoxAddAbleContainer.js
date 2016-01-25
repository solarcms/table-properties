import React, { Component, PropTypes } from 'react'
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux'
import * as DataActions from '../../actions/comboBoxAddAble'
import {save, edit, update} from "../../api/"
import Window from "../../components/window/"
import Select from 'react-select';
import validation from "../../components/form/validation/"

class ComboBoxAddAbleContainer extends Component {
    showModal(column) {
        this.props.actions.setAddModal(true);
    }
    hideModal(column) {
        this.props.actions.setAddModal(false);
    }
    saveForm(){
        const FD = this.props.formControls;

        let foundError = false;

        FD.map((fromColumn, index) => {
            const error = (validation(fromColumn.value, fromColumn.validate));
            if(error){
                this.props.actions.setError(CAcolumn, CAIndex, index, error);
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
        let comboBox = []
        this.props.formControls.map((field, index) => {
            if (field.type == '--combobox-addable') {

                comboBox.push({column: field.column, form_input_control:field.options.form_input_control});

            }

        })

        this.props.actions.addComboAddAble(comboBox);
    }
    componentWillUnmount(){

    }
    componentDidMount(){

    }

    render() {

        const { fieldClass, formData, column, fieldOptions, value, changeHandler, errorText, formType, placeholder, name, formControls, showAddModal, comboBoxs } = this.props;

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



                return <Window key={index}
                               id={comboBox.column}
                               formControls={comboBox.form_input_control}
                               formData={formData}
                               pageName="test"
                               show={showAddModal}
                               changeHandler={this.changeValues.bind(this, comboBox.column, index)}
                               saveForm={this.saveForm.bind(this)}
                               hideModal={this.hideModal.bind(this, comboBox.column)}
                />



        })





        return (
            <div className={`form-group ${fieldClass}`}>
                {formType == 'inline' ? '' : <label className="control-label">{placeholder}</label>}

                {formData[column] ?

                    <Select
                        name={name}
                        value={value}
                        options={options}
                        onChange={changeHandler}
                    />
                    :
                    null}

                <button className="btn btn-success" onClick={this.showModal.bind(this,column)}>
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
    const TpStore = state.TpStore;
    const ComboBoxAddAble = state.ComboBoxAddAble;

    return {
        formControls: TpStore.get('setup').toJS().form_input_control,
        showAddModal: ComboBoxAddAble.get('showAddModal'),
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
