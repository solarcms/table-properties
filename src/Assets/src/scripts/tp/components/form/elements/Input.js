import React, { Component, PropTypes }  from 'react';

import {moveCursorToEnd} from '../helpers/'

import numeral from 'numeral';

export default class Input extends Component {
    constructor(props) {
        super(props);

        this.state = {
            focused: false
        };
    }

    changeHandler(e){

        let value = e.target.value;
        //var number = numeral(value);
        //value = number.value();
        this.props.changeHandler(value)

    }
    moneyFonuce(){
        this.setState({focused: true});
    }
    moneyFonuceFalse(){
        this.setState({focused: false});
    }
    numberToCurrency(e){
        let value = e.target.value;
        var number = numeral(value);
        var string = number.format('0,0.00');
        this.props.changeHandler(string)

    }

    componentDidMount(){
        //if(this.props.type == 'money')
        //    $('.money').autoNumeric({aPad: true, aForm: true});
        //if(this.props.type == 'money'){
        //    var number = numeral(1000);
        //    var string = number.format('0,0');
        //        console.log(string)
        //}

    }
    componentWillUnmount(){
        //if(this.props.type == 'money')
        //    $('.money').autoNumeric('destroy');
    }
    render() {
        const { autoFocus, name, value, placeholder, changeHandler, errorText, fieldClass, type, disabled, dataIndex } = this.props;

        const focusHandler = type == 'text' ? moveCursorToEnd : false

        const realType =  type == 'money' ? 'text' : type

        let input = ''
        switch (type){
            case 'money':

                let moneyValue = null;
                if(!this.state.focused){
                    if(value !== null && value != ''){
                        var number = numeral(value);
                        var moneyValue = number.format('0,0.00');
                    }
                }else{

                        moneyValue = value;

                }

                input = <input
                        disabled={disabled}
                        autoFocus={autoFocus}
                        className="form-control money"
                        data-index={dataIndex}
                        name={name}
                        value={moneyValue}
                        defaultValue={moneyValue}
                        placeholder={placeholder}
                        onChange={this.changeHandler.bind(this)}
                        onFocus={this.moneyFonuce.bind(this)}
                        onBlur={this.moneyFonuceFalse.bind(this)}
                        type="text"/>
                break;
            case 'textarea':
                input = <textarea
                        disabled={disabled}
                        autoFocus={autoFocus}
                        className="form-control"
                        data-index={dataIndex}
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
                        disabled={disabled}
                        autoFocus={autoFocus}
                        className="form-control"
                        data-index={dataIndex}
                        name={name}
                        value={value}
                        defaultValue={value}
                        placeholder={placeholder}
                        onChange={changeHandler}
                        onFocus={focusHandler}
                        type={realType}/>

        }


        return (

                <div  className={`form-group ${fieldClass} `}>
                    <label className="control-label">{placeholder}</label>
                    {input}
                    <span className="help-block">
                        {errorText}
                    </span>
                </div>


        )
    }
}
