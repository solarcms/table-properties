import React, { Component, PropTypes }  from 'react';
import Select from 'react-select';

export default class ComboBox extends Component {

    comboChange(value){
        let send_value = value;
      if(this.props.multi){
          if(value){
              send_value = '';
              for(let m = 0; m < value.length; m++){
                 send_value = send_value+','+value[m].value;
              }
          }
      }

        this.props.changeHandler(send_value)
    }

    getTranlate(translations){
        if(this.props.fieldOptions.get('with_translation')){

            let json_translations =  JSON.parse(translations);
            let translated_value = null;
            json_translations.map(tranlation =>{
                if(tranlation.locale == this.props.defaultLocale)
                    translated_value = tranlation.value;
            })

            return translated_value;
        } else {
            return translations;
        }

    }

    render() {
        const { fieldClass, formData, column, changeHandler, fieldOptions, value, fieldClassName, errorText, formType, placeholder, name, disabled, multi, dataIndex } = this.props;

        let options = [];




        if(formData.get(column))

            formData.getIn([column, 'data', 'data']).map((data, sindex)=>{

                

                if (fieldOptions.get('textField') instanceof Object) {

                    let arrayLabel = "";

                    for (var i = 0; i < fieldOptions.get('textField').size; ++i) {
                        if(i == 0)
                            arrayLabel = this.getTranlate(data.get(fieldOptions.getIn(['textField', i])))
                        else
                            arrayLabel = arrayLabel +", "+ this.getTranlate(data.get(fieldOptions.getIn(['textField', i])))
                    }

                    options.push({value: data.get(fieldOptions.get('valueField')), label: arrayLabel})
                }
                else {

                    options.push({value: data.get(fieldOptions.get('valueField')), label: this.getTranlate(data.get(fieldOptions.get('textField')))})
                }
        })

        let new_value = value;

        if(multi){
            new_value = [];

            if(value){
                let old_value = value.split(",");
                for(let m = 0; m < options.length; m++){
                    for(let n = 0; n < old_value.length; n++){
                        if(options[m].value == old_value[n]){
                            new_value.push(options[m]);
                            old_value.splice(n, 1);
                        }
                    }
                }
            }


        }


        return (
            <div className={`form-group ${fieldClass} ${fieldClassName}`}  id={`solar-form-group-${dataIndex}`}>
                {formType == 'inline' ? '' : <label className="control-label">{placeholder}</label>}

                {formData.get(column) ?

                    <Select
                        disabled={disabled}
                        name={name}
                        value={new_value}
                        options={options}
                        onChange={this.comboChange.bind(this)}
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
