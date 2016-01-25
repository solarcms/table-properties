import React, { Component, PropTypes }  from 'react';
import Select from 'react-select';

export default class ComboBox extends Component {


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
                    <span className="help-block">
                            {errorText}
                    </span>

            </div>

        )
    }
}
