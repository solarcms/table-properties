import React, { Component, PropTypes }  from 'react';

import {moveCursorToEnd} from '../../../tools/cursor'

import numeral from 'numeral';
import {checkUnique} from "../../../api/"

export default class Input extends Component {

    constructor(props) {
        super(props);

        this.state = {
            focused: false
        };
    }
    unique(value, rule, dataIndex, edit_parent_id, errorText) {


        let unique = rule.split('unique:');
        let uniqueConditions = unique[1].split(',');
        let table = uniqueConditions[0];
        let table_colummn = uniqueConditions[1];
        let row_id = edit_parent_id ? edit_parent_id : uniqueConditions[2];
        let row_id_field = uniqueConditions[3];


        //console.log(table, table_colummn, value, row_id, row_id_field)

        let dataIndexnew = ''+dataIndex

        let dataIndexs  =  dataIndexnew.split('-');

        if(value !== null && value != '')
            checkUnique(table, table_colummn, value, row_id, row_id_field).then((count)=>{
                if(count >= 1){

                    if(errorText !== null)
                        this.props.setErrorManuale(dataIndexs, errorText+' Өгөгдөл давахцаж байна')
                    else
                        this.props.setErrorManuale(dataIndexs, 'Өгөгдөл давахцаж байна')
                }

            })

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
    blurFunction(e){
        let value = e.target.value;

        if(this.props.validation.includes('unique')){

            this.unique(value, this.props.validation, this.props.dataIndex, this.props.edit_parent_id, this.props.errorText);
        }

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
        const { autoFocus, name, value, placeholder, changeHandler, fieldClassName, errorText, fieldClass, type, disabled, dataIndex } = this.props;

        const focusHandler = type == 'text' ? moveCursorToEnd : false

        const realType =  type == 'money' ? 'text' : type

        let input = ''
        switch (type){
            case 'money':

                let moneyValue = '';
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
                    placeholder={placeholder}
                    onChange={changeHandler}
                    onFocus={moveCursorToEnd}
                    type={realType}/>
                break;
            case 'password':
                input =
                    <input
                        disabled={disabled}
                        autoFocus={autoFocus}
                        className="form-control"
                        data-index={dataIndex}
                        name={name}
                        value={value}
                        placeholder={placeholder}
                        onChange={changeHandler}
                        onFocus={focusHandler}
                        onBlur={this.blurFunction.bind(this)}
                        type={realType}/>

                break;
            case 'password-confirm':
                input =
                    <input
                        disabled={disabled}
                        autoFocus={autoFocus}
                        className="form-control"
                        data-index={dataIndex}
                        name={name}
                        value={value}
                        placeholder={placeholder}
                        onChange={changeHandler}
                        onFocus={focusHandler}
                        onBlur={this.blurFunction.bind(this)}
                        type='password'/>

                break;
            default:
                input = <input
                    disabled={disabled}
                    autoFocus={autoFocus}
                    className="form-control"
                    data-index={dataIndex}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={changeHandler}
                    onFocus={focusHandler}
                    onBlur={this.blurFunction.bind(this)}
                    onKeyPress = {this.props.keyPress}
                    type={realType}/>

        }

        return (

            <div  className={`form-group ${fieldClass} ${fieldClassName}`} id={`solar-form-group-${dataIndex}`}>
                <label className="control-label">{placeholder}</label>
                {input}
                <span className="help-block">
                        {errorText}
                    </span>
            </div>


        )
    }
}
