import React, { Component, PropTypes }  from 'react';

import {moveCursorToEnd} from '../helpers/'

export default class Input extends Component {

    componentDidMount(){
        if(this.props.type == 'money')
            $('.money').autoNumeric({aPad: true, aForm: true});
    }
    componentWillUnmount(){
        if(this.props.type == 'money')
            $('.money').autoNumeric('destroy');
    }
    render() {
        const { autoFocus, name, value, placeholder, changeHandler, errorText, fieldClass, type } = this.props;

        const focusHandler = type == 'text' ? moveCursorToEnd : false

        const realType =  type == 'money' ? 'text' : type

        let input = ''
        switch (type){
            case 'money':
                input = <input
                        autoFocus={autoFocus}
                        className="form-control money"
                        name={name}
                        value={value}
                        defaultValue={value}
                        placeholder={placeholder}
                        onKeyUp={changeHandler}
                        onChange={changeHandler}
                        type={realType}/>
                break;
            case 'textarea':
                input = <textarea
                        autoFocus={autoFocus}
                        className="form-control"
                        name={name}
                        value={value}
                        defaultValue={value}
                        placeholder={placeholder}
                        onChange={changeHandler}
                        onFocus={moveCursorToEnd}
                        type={realType}/>
                break;
            default:
                input = <input
                        autoFocus={autoFocus}
                        className="form-control"
                        name={name}
                        value={value}
                        defaultValue={value}
                        placeholder={placeholder}
                        onChange={changeHandler}
                        onFocus={focusHandler}
                        type={realType}/>

        }


        return (

                <div  className={`form-group ${fieldClass}`}>
                    <label className="control-label">{placeholder}</label>
                    {input}
                    <span className="help-block">
                        {errorText}
                    </span>
                </div>


        )
    }
}
