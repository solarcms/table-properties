import React, { Component, PropTypes } from 'react'
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux'
import * as DataActions from '../../actions/comboBoxAddAble'
import {saveComboAdd, getComboList, getCascadeChild} from "../../api/comboAddAble"
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

        this.props.actions.setModal('combo-' + column, true);
    }

    hideModal(column, CAIndex) {
        this.props.actions.setModal('combo-' + column, false);
        this.props.actions.clearFromValidation(CAIndex);
    }

    checkValidate(CAcolumn, CAIndex) {
        const FD = this.props.comboBoxs.getIn([CAIndex, 'form_input_control']);
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

    setErrorManuale(CAcolumn, CAIndex, dataIndex, error){
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

    saveForm(CAcolumn, CAIndex) {


        let foundError = this.checkValidate(CAcolumn, CAIndex);

        const FD = this.props.comboBoxs.getIn([CAIndex, 'form_input_control']);

        if (foundError === false)
            saveComboAdd(CAcolumn, FD).done((data)=> {

                if (data == 'success') {
                    this.callPageDatas(CAcolumn);
                    this.hideModal(CAcolumn, CAIndex);
                }

            }).fail(()=> {
                alert("Уучлаарай алдаа гарлаа дахин оролдоно уу")
            })

    }

    changeChildValue(CAcolumn, CAIndex, realDataIndex){


        let childIndex = realDataIndex;


        childIndex[childIndex.length-1] = childIndex[childIndex.length-1]+1;

        const childField =  this.props.comboBoxs.getIn([CAIndex, 'form_input_control']).getIn(childIndex);


        this.props.actions.chagenValue(CAcolumn, CAIndex, childIndex, null)

        if(childField.getIn(['options', 'child'])){
            this.changeChildValue(CAcolumn, CAIndex, childIndex);
        }

    }

    changeValues(CAcolumn, CAIndex, dataIndex, value) {


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

        const field = this.props.comboBoxs.getIn([CAIndex, 'form_input_control']).getIn(realDataIndex);



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



    componentWillMount() {
        this.props.actions.addModal('combo-' + this.props.column);
        this.props.actions.addComboAddAble(this.props.column, {
            column: this.props.column,
            form_input_control: this.props.formControls
        });

    }

    componentWillUnmount() {

    }

    componentDidMount() {

    }

    render() {

        const {button_texts, disabled, modals, fieldClass, formData, column, fieldOptions, value, fromFieldClass, changeHandler, errorText, formType, placeholder, pageName, name, formControls, showAddModal, comboBoxs } = this.props;

        let options = [];

        if (formData.get(column))

            formData.getIn([column, 'data', 'data']).map((data, sindex)=> {

                if (fieldOptions.get('textField') instanceof Object) {

                    let arrayLabel = "";

                    for (var i = 0; i < fieldOptions.get('textField').size; ++i) {
                        if (i == 0)
                            arrayLabel = data.get(fieldOptions.getIn(['textField', i]))
                        else
                            arrayLabel = arrayLabel + ", " + data.get(fieldOptions.getIn(['textField', i]))
                    }

                    options.push({value: data.get(fieldOptions.get('valueField')), label: arrayLabel})
                }
                else {

                    options.push({
                        value: data.get(fieldOptions.get('valueField')),
                        label: data.get(fieldOptions.get('textField'))
                    })
                }
            })


        let windowForm = null;
        if (comboBoxs.size >= 1)
            windowForm = comboBoxs.map((comboBox, index) => {
                if (comboBox.get('column') == column) {
                    let shwoModal = false;

                    modals.map((modal) => {
                        if (modal.get('name') == "combo-" + comboBox.get('column'))
                            shwoModal = modal.get('show');
                    })
                    return <Window key={index}
                                   id={comboBox.get('column')}
                                   formControls={comboBox.get('form_input_control')}

                                   formData={formData}
                                   fromFieldClass={fromFieldClass}
                                   setErrorManuale={this.setErrorManuale.bind(this, comboBox.get('column'), index)}
                                   pageName={pageName}
                                   show={shwoModal}
                                   permission={{c:true, r:true, u:true, d:false}}
                                   ifUpdateDisabledCanEditColumns={[]}
                                   changeHandler={this.changeValues.bind(this, comboBox.get('column'), index)}
                                   saveForm={this.saveForm.bind(this, comboBox.get('column'), index)}
                                   hideModal={this.hideModal.bind(this, comboBox.get('column'), index)}
                    />
                }


            })


        return (
            <div className={`form-group ${fieldClass}  `}>
                {formType == 'inline' ? '' : <label className="control-label">{placeholder}</label>}

                {formData.get(column) ?

                    <Select className="addable-combo"
                            disabled={disabled}
                            name={name}
                            value={value}
                            options={options}
                            onChange={changeHandler}
                            button_texts={button_texts}
                            placeholder={`Сонгох`}
                    />
                    :
                    null}

                <button className="btn btn-primary add-btn combo-add-btn" onClick={this.showModal.bind(this,column)}
                        disabled={disabled}>
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

}
ComboBoxAddAbleContainer.propTypes = {
    comboBoxs: PropTypes.object.isRequired
}

function mapStateToProps(state) {

    const ComboBoxAddAble = state.ComboBoxAddAble;
    const Modal = state.Modal;
    const Grid = state.Grid;

    return {

        modals: Modal.get('modals'),
        comboBoxs: ComboBoxAddAble.get('comboBoxs'),
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
)(ComboBoxAddAbleContainer)
