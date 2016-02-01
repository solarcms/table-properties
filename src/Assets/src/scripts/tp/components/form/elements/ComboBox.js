import React, { Component, PropTypes }  from 'react';
import Select from 'react-select';

export default class ComboBox extends Component {


    render() {
        const { fieldClass, formData, column, fieldOptions, value, changeHandler, errorText, formType, placeholder, name, disabled, multi } = this.props;

        let options = [];


        if(formData.get(column))

            formData.getIn([column, 'data', 'data']).map((data, sindex)=>{

                if (fieldOptions.get('textField') instanceof Object) {

                    let arrayLabel = "";

                    for (var i = 0; i < fieldOptions.get('textField').size; ++i) {
                        if(i == 0)
                            arrayLabel = data.get(fieldOptions.getIn(['textField', i]))
                        else
                            arrayLabel = arrayLabel +", "+ data.get(fieldOptions.getIn(['textField', i]))
                    }

                    options.push({value: data.get(fieldOptions.get('valueField')), label: arrayLabel})
                }
                else {

                    options.push({value: data.get(fieldOptions.get('valueField')), label: data.get(fieldOptions.get('textField'))})
                }
        })


        return (
            <div className={`form-group ${fieldClass}  col-md-12`}>
                {formType == 'inline' ? '' : <label className="control-label">{placeholder}</label>}

                {formData.get(column) ?

                    <Select
                        disabled={disabled}
                        name={name}
                        value={value}
                        options={options}
                        onChange={changeHandler}
                        placeholder={`Сонгох`}
                        multi={multi}
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
