import React, { Component, PropTypes }  from 'react';
import ReactDOM from 'react-dom';
import Combogrid from './elements/ComboGrid';
import CK from './elements/CK';
import DragMap from './elements/DragMap';
import SingleFileUploader from './elements/SingleFileUploader';
import MultiFileUploader from './elements/MultiFileUploader';
import Select from 'react-select';

import { Tabs, Tab } from 'react-bootstrap';

import {getDate, getDateTime, getTime} from "../../lib/date";
import Datetime from 'react-datetime';


import {moveCursorToEnd} from './helpers/'

//// form elemenets
import Input from './elements/Input'
import ComboBox from './elements/ComboBox'
import ComboBoxAddAble from '../../containers/formContainers/ComboBoxAddAbleContainer'
import numeral from 'numeral';

export default class Form extends Component {


    comboGridSelected(value, text, column) {

        this.props.changeHandler(null, 'combo-grid', value, text, column)

    }

    dateTimeChange(locale_index, dIndex, value) {
        let newValue = getDateTime(value)

       this.manualeChangeHandler(locale_index,dIndex, newValue);

    }


    timeChange(locale_index, dIndex, value) {
        let newValue = getTime(value)

       this.manualeChangeHandler(locale_index,dIndex, newValue);

    }

    dateChange(locale_index, dIndex, value) {

        let newValue = getDate(value);

        this.manualeChangeHandler(locale_index, dIndex, newValue);
    }
    getValueByColumn(column){
        let value = null
        this.props.formControls.map((fcontrol, findex)=>{
            if(fcontrol.get('column') == column){
                value = fcontrol.get('value')
            }
        })

        return value;
    }
    changeHandler(locale_index, e){

        let value  = null;
        if(e.target.type == 'checkbox'){
            value = e.target.checked ? e.target.value : null
        } else {
            value = e.target.value;
        }

        let dataIndexs  =  e.target.getAttribute('data-index').split('-');

        let dataIndex = [];

        dataIndexs.map((key)=>{
            dataIndex.push(key*1);
        });
        if(locale_index === false){
            this.props.changeHandler(dataIndex, value);
        }
        else
            this.props.translateChangeHandler(locale_index, dataIndex, value);

    }
    manualeChangeHandler(locale_index, dIndex, value) {
        

        let dataIndexs  =  dIndex.split('-');

        let dataIndex = [];

        dataIndexs.map((key)=>{
            dataIndex.push(key*1);
        });

        if(locale_index === false)
            this.props.changeHandler(dataIndex, value);
        else
            this.props.translateChangeHandler(locale_index, dataIndex, value);

    }

    getFromField(locale_index, index, title, name, field, thisDisabled, fieldClass, mainValue, formType, formData, gridId, focus, just_info){


        if(this.props.just_info === true){
            thisDisabled = true;
        }

        const keyIndex = locale_index === false ? index : `__local__${locale_index}-${index}`

        const fieldClassName = field.get('className') ? field.get('className') : this.props.fieldClassName;

        if(field.get('show')){

            let showCheckers = field.get('show').toJS();
            let hideElement = true;
            showCheckers.map((showChecker)=>{

                Object.keys(showChecker).map(checker=>{
                    //console.log(checker, showChecker[checker])

                    let checkerValue = this.getValueByColumn(checker)


                    if(checkerValue == showChecker[checker])
                        hideElement = false;


                })


            })
            if(hideElement === true){
                return false
            }

        }


        switch (field.get('type')) {
            case "--text":
                return <Input
                    disabled={thisDisabled}
                    key={keyIndex} dataIndex={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="text"
                    autoFocus={focus}
                    placeholder={title}
                    name={name}
                    fieldClassName={fieldClassName}
                    validation={field.get('validate')}
                    setErrorManuale={this.props.setErrorManuale}
                    edit_parent_id={this.props.edit_parent_id}
                    keyPress={this.props.keyPress}
                    changeHandler={this.changeHandler.bind(this, locale_index)}
                    errorText={field.get('error')}

                />
                break;
            case "--password":
                return <Input
                    disabled={thisDisabled}
                    key={keyIndex} dataIndex={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="password"
                    autoFocus={focus}
                    placeholder={title}
                    fieldClassName={fieldClassName}
                    name={name}
                    validation={field.get('validate')}
                    setErrorManuale={this.props.setErrorManuale}
                    edit_parent_id={this.props.edit_parent_id}
                    changeHandler={this.changeHandler.bind(this, locale_index)}
                    errorText={field.get('error')}

                />
                break;
            case "--password-confirm":
                return <Input
                    disabled={thisDisabled}
                    key={keyIndex} dataIndex={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="password-confirm"
                    autoFocus={focus}
                    fieldClassName={fieldClassName}
                    placeholder={title}
                    name={name}
                    validation={field.get('validate')}
                    setErrorManuale={this.props.setErrorManuale}
                    edit_parent_id={this.props.edit_parent_id}
                    changeHandler={this.changeHandler.bind(this, locale_index)}
                    errorText={field.get('error')}

                />
                break;
            case "--auto-calculate":

                var number = numeral(mainValue);
                var money = number.format('0,0.00');
                return <Input
                    disabled={true}
                    key={keyIndex} dataIndex={index}
                    fieldClass={fieldClass}
                    value={money}
                    type="text"
                    autoFocus={focus}
                    placeholder={title}
                    fieldClassName={fieldClassName}
                    name={name}
                    validation={field.get('validate')}
                    setErrorManuale={this.props.setErrorManuale}
                    edit_parent_id={this.props.edit_parent_id}
                    //changeHandler={this.changeHandler.bind(this, locale_index)}
                    errorText={field.get('error')}

                />
                break;
            case "--group":
                
                const groupFields =  field.get('controls').map((control, subindex)=>{

                            let thisSubDisabled = true;


                            if(this.props.permission.u !== true && this.props.edit_parent_id !== false){
                                this.props.ifUpdateDisabledCanEditColumns.map((ifUpdateDisabledCanEditColumn)=>{
                                    if(field.get('column') == ifUpdateDisabledCanEditColumn)
                                        thisSubDisabled = false;
                                })
                            } else
                                thisSubDisabled = false;


                            let subFieldClass = '';
                            if (control.get('error'))
                                subFieldClass = 'has-error'



                            let subMainValue = this.props.formValue ?
                                this.props.formValue
                                :
                                control.get('value')


                            let focus = false;


                            const subname = `solar-input-${index}-${subindex}`;


                    if(control.get('disabled') == 'true' || control.get('disabled') === true){
                        thisSubDisabled = true;

                    }
     

                            return this.getFromField(locale_index, `${index}-${subindex}`, control.get('title'), subname, control, thisSubDisabled, subFieldClass, subMainValue, formType, formData, focus);


                        })

                return <div className={`${fieldClassName}`}>
                    <fieldset className={`field_set`} key={keyIndex}>

                        <legend className="legendStyle">
                            {field.get('title')}
                        </legend>


                        {groupFields}

                    </fieldset>
                </div>
                break;
            case "--number":
                return <Input
                    disabled={thisDisabled}
                    key={keyIndex} dataIndex={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="number"
                    autoFocus={focus}
                    placeholder={title}
                    fieldClassName={fieldClassName}
                    name={name}
                    validation={field.get('validate')}
                    setErrorManuale={this.props.setErrorManuale}
                    edit_parent_id={this.props.edit_parent_id}

                    changeHandler={this.changeHandler.bind(this, locale_index)}
                    errorText={field.get('error')}

                />
                break;
            case "--money":
                return <Input
                    disabled={thisDisabled}
                    key={keyIndex} dataIndex={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="money"
                    autoFocus={focus}
                    fieldClassName={fieldClassName}
                    placeholder={title}
                    validation={field.get('validate')}
                    setErrorManuale={this.props.setErrorManuale}
                    edit_parent_id={this.props.edit_parent_id}
                    name={name}
                    changeHandler={this.manualeChangeHandler.bind(this, locale_index, `${index}`)}
                    errorText={field.get('error')}

                />
                break;
            case "--email":
                return <Input
                    disabled={thisDisabled}
                    key={keyIndex} dataIndex={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="email"
                    autoFocus={focus}
                    placeholder={title}
                    fieldClassName={fieldClassName}
                    name={name}
                    validation={field.get('validate')}
                    setErrorManuale={this.props.setErrorManuale}
                    edit_parent_id={this.props.edit_parent_id}
                    changeHandler={this.changeHandler.bind(this, locale_index)}
                    errorText={field.get('error')}

                />
                break;
            case "--link":
                return <Input
                    disabled={thisDisabled}
                    key={keyIndex} dataIndex={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="text"
                    autoFocus={focus}
                    placeholder={title}
                    fieldClassName={fieldClassName}
                    name={name}
                    validation={field.get('validate')}
                    setErrorManuale={this.props.setErrorManuale}
                    edit_parent_id={this.props.edit_parent_id}
                    changeHandler={this.changeHandler.bind(this, locale_index)}
                    errorText={field.get('error')}

                />
                break;
            case "--textarea":
                return <Input
                    disabled={thisDisabled}
                    key={keyIndex} dataIndex={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="textarea"
                    autoFocus={focus}
                    fieldClassName={fieldClassName}
                    placeholder={title}
                    name={name}
                    validation={field.get('validate')}
                    setErrorManuale={this.props.setErrorManuale}
                    edit_parent_id={this.props.edit_parent_id}
                    changeHandler={this.changeHandler.bind(this, locale_index)}
                    errorText={field.get('error')}

                />
            case "--disabled":
                return <Input
                    disabled={true}
                    key={keyIndex} dataIndex={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="text"
                    autoFocus={focus}
                    placeholder={title}
                    fieldClassName={fieldClassName}
                    name={name}
                    validation={field.get('validate')}
                    setErrorManuale={this.props.setErrorManuale}
                    edit_parent_id={this.props.edit_parent_id}
                    changeHandler={this.changeHandler.bind(this, locale_index)}
                    errorText={field.get('error')}

                />
                break;
            case "--disabled-textarea":
                return <Input
                    disabled={true}
                    key={keyIndex} dataIndex={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="textarea"
                    autoFocus={focus}
                    placeholder={title}
                    fieldClassName={fieldClassName}
                    fieldClassName={fieldClassName}
                    name={name}
                    validation={field.get('validate')}
                    setErrorManuale={this.props.setErrorManuale}
                    edit_parent_id={this.props.edit_parent_id}
                    changeHandler={this.changeHandler.bind(this, locale_index)}
                    errorText={field.get('error')}

                />
                break;
            case "--ckeditor":
                return <CK
                    disabled={thisDisabled}
                    key={keyIndex}
                    keyIndex={keyIndex}
                    dataIndex={index}
                    placeholder={title}
                    fieldClass={fieldClass}
                    fieldClassName={fieldClassName}
                    name={name}
                    gridId={gridId}
                    index={index}
                    mainValue={mainValue}
                    changeHandler={this.manualeChangeHandler.bind(this, locale_index, `${index}`)}
                    errorText={field.get('error')}

                />
                break;
            case "--drag-map":
                return <DragMap
                    disabled={thisDisabled}
                    key={keyIndex} dataIndex={index}
                    placeholder={title}
                    fieldClass={fieldClass}
                    fieldClassName={fieldClassName}
                    gridId={gridId}
                    index={index}
                    name={name}
                    mainValue={mainValue}
                    changeHandler={this.manualeChangeHandler.bind(this, locale_index, `${index}`)}
                    errorText={field.get('error')}

                />
                break;
            case "--single-file":
                return <SingleFileUploader
                    disabled={thisDisabled}
                    key={keyIndex} dataIndex={index}
                    fieldClass={fieldClass}
                    gridId={gridId}
                    placeholder={title}
                    fieldClassName={fieldClassName}
                    index={index}
                    name={name}
                    mainValue={mainValue}
                    changeHandler={this.manualeChangeHandler.bind(this, locale_index, `${index}`)}
                    errorText={field.get('error')}
                />
                break;
            case "--multi-file":
                let max = field.get('max') ? field.get('max') : false;
                return <MultiFileUploader
                    disabled={thisDisabled}
                    key={keyIndex} dataIndex={index}
                    fieldClass={fieldClass}
                    gridId={gridId}
                    placeholder={title}
                    fieldClassName={fieldClassName}
                    index={index}
                    name={name}
                    mainValue={mainValue}
                    max={max}
                    edit_parent_id={this.props.edit_parent_id}
                    changeHandler={this.manualeChangeHandler.bind(this, locale_index, `${index}`)}
                    errorText={field.get('error')}
                />
                break;

            case "--date":
                
                return <div key={keyIndex} dataIndex={index} className={`form-group ${fieldClassName}`}  id={`solar-form-group-${index}`}>
                    <label className={`control-label `}>{title}</label>

                    <Datetime
                        value={mainValue ? mainValue : undefined}
                        defaultValue={mainValue ? mainValue : undefined}
                        viewMode={`days`}
                        dateFormat={`YYYY-MM-DD`}
                        timeFormat={false}
                        onChange={this.dateChange.bind(this, locale_index, `${index}`)}
                        closeOnSelect={true}
                        inputProps={{placeholder:title, disabled:thisDisabled}}

                    />
                                <span className="help-block">
                                    {field.error}
                                </span>
                </div>
                break;
            case "--datetime":

                return <div key={keyIndex} dataIndex={index} className={`form-group ${fieldClass} `}  id={`solar-form-group-${index}`}>
                    <label>

                        {title}
                    </label>
                    <Datetime
                        value={mainValue ? mainValue : undefined}
                        defaultValue={mainValue ? mainValue : undefined}
                        viewMode={`time`}
                        dateFormat={`YYYY-MM-DD  HH:mm`}
                        onChange={this.dateChange.bind(this, locale_index, `${index}`)}
                        closeOnSelect={true}
                        inputProps={{placeholder:title, disabled:thisDisabled}}

                    />
                                <span className="help-block">

                                    {field.error}
                                </span>
                </div>
                break;
            case "--time":
                let time_show = null;

               if(mainValue && mainValue.length <= 8){
                   time_show = new Date('1900.01.01 '+mainValue)

               } else {
                   time_show = new Date(mainValue)
               }
                return <div key={keyIndex} dataIndex={index} className={`form-group ${fieldClass} ${fieldClassName}`}  id={`solar-form-group-${index}`}>
                    <label>

                        {title}
                    </label>

                    <Datetime
                        value={mainValue ? mainValue : undefined}
                        defaultValue={mainValue ? mainValue : undefined}
                              viewMode={`time`}
                              dateFormat={false}
                              timeFormat={`HH:mm`}
                        inputProps={{placeholder:title, disabled:thisDisabled}}
                        onChange={this.timeChange.bind(this, locale_index, `${index}`)}
                              closeOnSelect={true}
                    />,

                                <span className="help-block">

                                    {field.error}
                                </span>
                </div>
                break;
            case "--combogrid":
                return <div key={keyIndex} dataIndex={index} className={`form-group ${fieldClass} ${fieldClassName}`}  id={`solar-form-group-${index}`}>
                    {formType == 'inline' ? '' : <label className="control-label">{title}</label>}
                    <Combogrid listData={formData[field.get('column')].data.data}
                               disabled={thisDisabled}
                               gridHeader={field.getIn(['options', 'grid_output_control'])}
                               valueField={field.getIn(['options', 'valueField'])}
                               textField={field.getIn(['options','textField'])}
                               formControls={formData[field.get('column')].form_input_control}
                               text={formData[field.get('column')].text}
                               column={field.get('column')}
                               totalPages={formData[field.get('column')].data.last_page}
                               totalItems={formData[field.get('column')].data.total}
                               pageName={title}
                               comboGridSelected={this.comboGridSelected.bind(this)}
                    />

                                <span className="help-block">
                                    {field.error}
                                </span>
                </div>
                break;
            case "--combobox":

                return <ComboBox
                    disabled={thisDisabled}
                    key={keyIndex}
                    dataIndex={index}
                    column={field.get('column')}
                    loadOptions={field.getIn(['options','load_options'])}
                    name={name}
                    fieldClass={fieldClass}
                    placeholder={title}
                    formType={formType}
                    formData={formData}
                    fieldClassName={fieldClassName}
                    value={`${mainValue}`}
                    multi={false}
                    defaultLocale={this.props.defaultLocale}
                    fieldOptions={field.get('options')}
                    changeHandler={this.manualeChangeHandler.bind(this, locale_index, `${index}`)}
                    errorText={field.get('error')}
                />
                break;
            case "--combobox-addable":

                return <ComboBoxAddAble
                    disabled={thisDisabled}
                    key={keyIndex} dataIndex={index}
                    column={field.get('column')}
                    loadOptions={field.getIn(['options','load_options'])}
                    name={name}
                    fieldClass={fieldClass}
                    placeholder={title}
                    pageName={field.getIn(['options', 'page_name'])}
                    formType={formType}
                    formData={formData}
                    fieldClassName={fieldClassName}
                    value={`${mainValue}`}
                    defaultLocale={this.props.defaultLocale}
                    fromFieldClass={null}
                    fieldOptions={field.get('options')}
                    formControls={field.getIn(['options', 'form_input_control'])}
                    changeHandler={this.manualeChangeHandler.bind(this, locale_index, `${index}`)}
                    errorText={field.get('error')}
                />
                break;
            case "--tag":
                return <ComboBox
                    disabled={thisDisabled}
                    dataIndex={index}
                    loadOptions={field.getIn(['options','load_options'])}
                    key={keyIndex}
                    column={field.get('column')}
                    name={name}
                    fieldClass={fieldClass}
                    placeholder={title}
                    formType={formType}
                    formData={formData}
                    fieldClassName={fieldClassName}
                    value={`${mainValue}`}
                    multi={true}
                    defaultLocale={this.props.defaultLocale}
                    fieldOptions={field.get('options')}
                    changeHandler={this.manualeChangeHandler.bind(this, locale_index, `${index}`)}
                    errorText={field.get('error')}
                />
                break;
            case "--checkbox":
                return <div key={keyIndex}  className={`form-group ${fieldClass} ${fieldClassName}`}  id={`solar-form-group-${index}`}>
                    <div className="checkbox">
                        {formType == 'inline' ?
                            <input type="checkbox"
                                   disabled={thisDisabled}
                                   name={name}
                                   checked={field.get('value') == 1 ? true: false  }
                                   value={1}

                                   data-index={index}
                                   onChange={this.changeHandler.bind(this, locale_index)}
                            />
                            :
                            <label>
                                <input type="checkbox"
                                       disabled={thisDisabled}
                                       name={name}
                                       checked={field.get('value') == 1 ? true: false  }
                                       value={1}

                                       data-index={index}
                                       onChange={this.changeHandler.bind(this, locale_index)}
                                />
                                {title}
                            </label>
                        }
                        < span className="help-block">
                        {field.error}
                            </span>

                    </div>
                </div>
                break;
            case "--radio":

                return <div key={keyIndex} dataIndex={index} className={`form-group ${fieldClass} ${fieldClassName}`}  id={`solar-form-group-${index}`}>
                    <div className="radio">

                        <label >

                            {title}
                        </label> <br/>

                        {field.get('choices').map((choice, cindex)=>
                            <label key={cindex} className="radio_label">
                                <input type="radio"
                                       disabled={thisDisabled}
                                       name={name}
                                       data-index={index}
                                       checked={field.get('value') == choice.get('value') ? true: false  }

                                       value={choice.get('value')}
                                       onChange={this.changeHandler.bind(this, locale_index)}
                                />
                                {choice.get('text')} &nbsp;&nbsp;&nbsp;
                            </label>
                        )}


                        < span className="help-block">
                        {field.error}
                            </span>

                    </div>
                </div>
                break;
            default:
                return false;
        }
    }

    getTranslationForm(formControls, locale_id, locale_code, locale_index){

  
        return  formControls.map((field, index) => {



                        //formfield start

                        let thisDisabled = true;


                        if(this.props.permission.u !== true && this.props.edit_parent_id !== false){
                            this.props.ifUpdateDisabledCanEditColumns.map((ifUpdateDisabledCanEditColumn)=>{
                                if(field.get('column') == ifUpdateDisabledCanEditColumn)
                                    thisDisabled = false;
                            })
                        } else
                            thisDisabled = false;

                        let fieldClass = '';
                        if (field.get('error'))
                            fieldClass = 'has-error'

                        let mainValue = this.props.formValue ?
                            this.props.formValue
                            :
                            field.get('value')


                        const name = `${locale_index}__locale__${this.props.gridId}-solar-input${index}`;

                        let title = '';

                        if (field.get('title') instanceof Object) {

                            if(field.getIn(['title', locale_code]))
                                title = field.getIn(['title', locale_code])
                            else
                                title = field.get('title').first()
                        } else
                            title = field.get('title');



            if(field.get('disabled') == 'true' || field.get('disabled') === true){
                thisDisabled = true;

            }




                        return this.getFromField(locale_index, `${index}`, title, name, field, thisDisabled, fieldClass, mainValue, this.props.formType, this.props.formData, this.props.gridId, false);


                        //formfield end




        })

    }

    componentDidUpdate() {
        ///auto-calculate
        let calculate_columns = []

        this.props.formControls.map((fcontrol, findex)=>{
            if(fcontrol.get('type') == '--auto-calculate'){


                let calculate_type = fcontrol.getIn(['options', 'calculate_type']);
                let calculate_column = fcontrol.get('column');

                let columns = [];

                fcontrol.getIn(['options', 'calculate_columns']).map((calculate_column, cal_index)=>{


                    columns.push(
                        {column: calculate_column, value: this.getValueByColumn(calculate_column)}
                    );
                })
                calculate_columns.push(
                    {
                        column:calculate_column,
                        type:calculate_type,
                        columns:columns,
                        dataIndex:findex
                    }
                )
            }
        })

        calculate_columns.map((calculate_column, index)=>{
            let checkAllValue = true;
            calculate_column.columns.map((cal_column)=>{
                if(cal_column.value === null)
                    checkAllValue = false
            })
            let calculate_result = null;
            if(checkAllValue === true){
                if(calculate_column.type == '--multiply') {
                    calculate_column.columns.map((cal_column, calIndex)=> {
                        if (calIndex == 0)
                            calculate_result = cal_column.value;
                        else
                            calculate_result = calculate_result * cal_column.value
                    })
                } else if(calculate_column.type == '--divide') {
                    calculate_column.columns.map((cal_column, calIndex)=> {
                        if (calIndex == 0)
                            calculate_result = cal_column.value;
                        else
                            calculate_result = calculate_result / cal_column.value
                    })
                }else if(calculate_column.type == '--minus'){
                    calculate_column.columns.map((cal_column, calIndex)=>{
                        if(calIndex == 0)
                            calculate_result = cal_column.value;
                        else
                            calculate_result = calculate_result - cal_column.value
                    })
                }else if((calculate_column.type == '--sum')){
                    calculate_column.columns.map((cal_column, calIndex)=>{
                        if(calIndex == 0)
                            calculate_result = cal_column.value;
                        else
                            calculate_result = calculate_result + cal_column.value
                    })
                } else if(calculate_column.type == '--average'){
                    calculate_column.columns.map((cal_column, calIndex)=>{
                        if(calIndex == 0)
                            calculate_result = cal_column.value;
                        else
                            calculate_result = calculate_result + cal_column.value
                    })
                    calculate_result = calculate_result/calculate_column.columns.length;
                }
                if(calculate_result !== null){
                    this.props.changeHandler([calculate_column.dataIndex], calculate_result);
                }
            }
        });

    }

    componentWillUnmount(){

    }




    render() {
        const { formControls, translateFormControls, changeHandler, formClassName, fieldClassName, formData, formType, just_info, formValue, focusIndex, gridIndex, gridId, ifUpdateDisabledCanEditColumns, permission, edit_parent_id  } = this.props;

        let formFields =  formControls.map((field, index) => {




                                //formfield start



                                let thisDisabled = true;



                                if(permission.u !== true && this.props.edit_parent_id !== false){
                                    ifUpdateDisabledCanEditColumns.map((ifUpdateDisabledCanEditColumn)=>{
                                        if(field.get('column') == ifUpdateDisabledCanEditColumn)
                                            thisDisabled = false;
                                    })
                                } else
                                    thisDisabled = false;


                                let fieldClass = '';
                                if (field.get('error'))
                                    fieldClass = 'has-error'

                                let mainValue = formValue ?
                                    formValue
                                    :
                                    field.get('value')


                                let focus = false;
                                if (gridIndex) {
                                    if (focusIndex == gridIndex)
                                        focus = true;

                                    index = gridIndex

                                } else {
                                    if (focusIndex == index)
                                        focus = true;
                                }

                                const name = `solar-input-${index}`;



            if(field.get('disabled') == 'true' || field.get('disabled') === true){
                thisDisabled = true;

            }




                                return this.getFromField(false, index, field.get('title'), name, field, thisDisabled, fieldClass, mainValue, formType, formData, gridId, focus);




        })



        const translateForm = translateFormControls && translateFormControls.size >= 1 ? translateFormControls.map((translateFormControl, locale_index)=>{
            return <Tab eventKey={locale_index} title={translateFormControl.get('locale_code')} key={locale_index}>
                        {this.getTranslationForm(translateFormControl.get('translate_form_input_control'), translateFormControl.get('locale_id'), translateFormControl.get('locale_code'), locale_index)}
                    </Tab>
        }) : null


        return (
            <div className={`add-edit-form ${formClassName}`}>

                <div className="none-translate-form">
                    {formFields}
                    <div style={{clear:'both'}}></div>
                </div>

                {translateForm !== null
                    ? <br/>
                    : null}

                {translateForm !== null
                    ? <Tabs defaultActiveKey={0} animation={false}>
                        {translateForm}
                        </Tabs>
                    : null}

            </div>
        )
    }
}
Form.defaultProps = {
    ifUpdateDisabledCanEditColumns:[],
    locales:[],
};

Form.propTypes = {
    formControls: PropTypes.object.isRequired,
    changeHandler: PropTypes.func.isRequired
};