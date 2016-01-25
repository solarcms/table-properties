import React, { Component, PropTypes }  from 'react';
import Select from 'react-select';

export default class ComboBoxAddAble extends Component {

    openComboxFrom(column) {
        //this.props.openComboboxAdableForm(column)
    }
    render() {
        const { fieldClass, formData, column, fieldOptions, value, changeHandler, errorText, formType, placeholder, name } = this.props;

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

                <button className="btn btn-success" onClick={this.openComboxFrom.bind(this,column)}>
                    <i className="material-icons">&#xE145;</i>
                </button>

                    <span className="help-block">
                            {errorText}
                    </span>

            </div>

        )
    }
}
