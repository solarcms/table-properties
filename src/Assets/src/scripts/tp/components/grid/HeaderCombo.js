import React, { Component, PropTypes }  from 'react';
import Select from 'react-select';

export default class HeaderComboBox extends Component {

    comboChange(value){

        this.props.changeHandler(value)
    }


    render() {
        const {  fieldOptions, value, fieldClassName, placeholder, name, disabled, multi} = this.props;

        



        return (
            <div className={`form-group ${fieldClassName}`} >
                <label className="control-label">{placeholder}</label>
                
                        <Select
                            disabled={disabled}
                            name={name}
                            value={value}
                            options={fieldOptions}
                            onChange={this.comboChange.bind(this)}
                            placeholder={`Сонгох`}
                            multi={multi}
                            simpleValue
                            clearable={false}

                        />
             
                

            </div>

        )
    }
}
