import React, { Component, PropTypes }  from 'react';
import Combogrid from './elements/ComboGrid';
import CK from './elements/CK';
import DragMap from './elements/DragMap';
import SingleFileUploader from './elements/SingleFileUploader';
import Select from 'react-select';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import { Tabs, Tab } from 'react-bootstrap';

import Moment from 'moment'
import momentLocalizer from 'react-widgets/lib/localizers/moment'

momentLocalizer(Moment);

import {moveCursorToEnd} from './helpers/'

//// form elemenets
import Input from './elements/Input'
import ComboBox from './elements/ComboBox'
import ComboBoxAddAble from '../../containers/formContainers/ComboBoxAddAbleContainer'


export default class Form extends Component {


    comboGridSelected(value, text, column) {

        this.props.changeHandler(null, 'combo-grid', value, text, column)

    }

    manualChange(name, value) {

        if(name.indexOf('__locale__') >= 1)
            this.props.translateChangeHandler(null, 'manual', value, name)
        else
            this.props.changeHandler(null, 'manual', value, name)
    }

    dateTimeChange(name, value) {
        value = Moment(value).format("YYYY.MM.DD HH:mm");
        this.props.changeHandler(null, 'manual', value, name)

    }

    dateChange(name, value) {
        value = Moment(value).format("YYYY.MM.DD");
        this.props.changeHandler(null, 'manual', value, name)
    }

    getFromField(index, title, name, field, thisDisabled, fieldClass, mainValue, changeHandler, formType, formData, gridId, focus){
        switch (field.type) {
            case "--text":
                return <Input
                    disabled={thisDisabled}
                    key={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="text"
                    autoFocus={focus}
                    placeholder={title}
                    name={name}
                    changeHandler={changeHandler}
                    errorText={field.error}

                />
                break;
            case "--number":
                return <Input
                    disabled={thisDisabled}
                    key={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="number"
                    autoFocus={focus}
                    placeholder={title}
                    name={name}
                    changeHandler={changeHandler}
                    errorText={field.error}

                />
                break;
            case "--money":
                return <Input
                    disabled={thisDisabled}
                    key={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="money"
                    autoFocus={focus}
                    placeholder={title}
                    name={name}
                    changeHandler={changeHandler}
                    errorText={field.error}

                />
                break;
            case "--email":
                return <Input
                    disabled={thisDisabled}
                    key={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="email"
                    autoFocus={focus}
                    placeholder={title}
                    name={name}
                    changeHandler={changeHandler}
                    errorText={field.error}

                />
                break;
            case "--link":
                return <Input
                    disabled={thisDisabled}
                    key={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="text"
                    autoFocus={focus}
                    placeholder={title}
                    name={name}
                    changeHandler={changeHandler}
                    errorText={field.error}

                />
                break;
            case "--textarea":
                return <Input
                    disabled={thisDisabled}
                    key={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="textarea"
                    autoFocus={focus}
                    placeholder={title}
                    name={name}
                    changeHandler={changeHandler}
                    errorText={field.error}

                />
                break;
            case "--ckeditor":
                return <CK
                    disabled={thisDisabled}
                    key={index}
                    placeholder={title}
                    fieldClass={fieldClass}
                    name={name}
                    gridId={gridId}
                    index={index}
                    mainValue={mainValue}
                    changeHandler={this.manualChange.bind(this)}
                    errorText={field.error}

                />
                break;
            case "--drag-map":
                return <DragMap
                    disabled={thisDisabled}
                    key={index}
                    placeholder={title}
                    fieldClass={fieldClass}
                    gridId={gridId}
                    index={index}
                    name={name}
                    mainValue={mainValue}
                    changeHandler={this.manualChange.bind(this)}
                    errorText={field.error}

                />
                break;
            case "--single-file":
                return <SingleFileUploader
                    disabled={thisDisabled}
                    key={index}
                    fieldClass={fieldClass}
                    gridId={gridId}
                    placeholder={title}
                    index={index}
                    name={name}
                    mainValue={mainValue}
                    changeHandler={this.manualChange.bind(this)}
                    errorText={field.error}
                />
                break;
            case "--date":
                return <div key={index} className={`form-group ${fieldClass}  col-md-12`}>
                    <label className="control-label">{title}</label>
                    <DateTimePicker
                        disabled={thisDisabled}
                        name={name}
                        defaultValue={mainValue === null ? null : new Date(mainValue)}
                        value={mainValue === null ? null : new Date(mainValue)}
                        format={"YYYY.MM.DD"}
                        time={false}
                        onChange={this.dateChange.bind(this, `${gridId}-solar-input${index}`)}
                        placeholder={title}
                    />
                                <span className="help-block">
                                    {field.error}
                                </span>
                </div>
                break;
            case "--datetime":
                return <div key={index} className={`form-group ${fieldClass}  col-md-12`}>
                    <label>

                        {title}
                    </label>
                    <DateTimePicker
                        disabled={thisDisabled}
                        name={name}
                        defaultValue={mainValue === null ? null : new Date(mainValue)}
                        value={mainValue === null ? null : new Date(mainValue)}
                        format={"YYYY.MM.DD HH:mm"}
                        placeholder={title}
                        onChange={this.dateTimeChange.bind(this, `${gridId}-solar-input${index}`)}
                    />
                                <span className="help-block">

                                    {field.error}
                                </span>
                </div>
                break;
            case "--combogrid":
                return <div key={index} className={`form-group ${fieldClass}  col-md-12`}>
                    {formType == 'inline' ? '' : <label className="control-label">{title}</label>}
                    <Combogrid listData={formData[field.column].data.data}
                               disabled={thisDisabled}
                               gridHeader={field.options.grid_output_control}
                               valueField={field.options.valueField}
                               textField={field.options.textField}
                               formControls={formData[field.column].form_input_control}
                               text={formData[field.column].text}
                               column={field.column}
                               totalPages={formData[field.column].data.last_page}
                               totalItems={formData[field.column].data.total}
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
                    key={index}
                    column={field.column}
                    name={name}
                    fieldClass={fieldClass}
                    placeholder={title}
                    formType={formType}
                    formData={formData}
                    value={mainValue}
                    fieldOptions={field.options}
                    changeHandler={this.manualChange.bind(this, `${gridId}-solar-input${index}`)}
                    errorText={field.error}
                />
                break;
            case "--combobox-addable":
                return <ComboBoxAddAble
                    disabled={thisDisabled}
                    key={index}
                    column={field.column}
                    name={name}
                    fieldClass={fieldClass}
                    placeholder={title}
                    pageName={field.options.page_name}
                    formType={formType}
                    formData={formData}
                    value={mainValue}
                    fieldOptions={field.options}
                    formControls={field.options.form_input_control}
                    changeHandler={this.manualChange.bind(this, `${gridId}-solar-input${index}`)}
                    errorText={field.error}
                />
                break;
            case "--tag":
                let options_tag = [];
                if (formData[field.column])
                    formData[field.column].data.data.map((data, sindex)=> {
                        if (field.options.textField instanceof Array) {
                            let arrayLabel = "";
                            for (var i = 0; i < field.options.textField.length; ++i) {
                                if (i == 0)
                                    arrayLabel = data[field.options.textField[i]]
                                else
                                    arrayLabel = arrayLabel + ", " + data[field.options.textField[i]]
                            }

                            options_tag.push({value: data[field.options.valueField], label: arrayLabel})
                        }
                        else {
                            options_tag.push({
                                value: data[field.options.valueField],
                                label: data[field.options.textField]
                            })
                        }
                    })

                return <div key={index} className={`form-group ${fieldClass}  col-md-12`}>
                    {formType == 'inline' ? '' : <label className="control-label">{title}</label>}


                    {formData[field.column] ?


                        <Select
                            disabled={thisDisabled}
                            name={name}
                            value={field.value}
                            options={options_tag}
                            placeholder={`Сонгох`}
                            multi={true}
                            onChange={this.manualChange.bind(this, `${gridId}-solar-input${index}`)}
                        />


                        :
                        null}
                    <span className="help-block">
                            {field.error}
                    </span>


                </div>
                break;
            case "--checkbox":
                return <div key={index} className={`form-group ${fieldClass} col-md-12`}>
                    <div className="checkbox">
                        {formType == 'inline' ?
                            <input type="checkbox"
                                   disabled={thisDisabled}
                                   name={name}
                                   checked={field.value == 1 ? true: false  }
                                   value={1}
                                   defaultChecked={mainValue}
                                   onChange={changeHandler}
                            />
                            :
                            <label>
                                <input type="checkbox"
                                       disabled={thisDisabled}
                                       name={name}
                                       checked={field.value == 1 ? true: false  }
                                       value={1}
                                       defaultChecked={mainValue}
                                       onChange={changeHandler}
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

                return <div key={index} className={`form-group ${fieldClass} col-md-12`}>
                    <div className="radio">

                        <label>

                            {title}
                        </label> <br/>

                        {field.choices.map((choice, cindex)=>
                            <label key={cindex}>
                                <input type="radio"
                                       disabled={thisDisabled}
                                       name={name}

                                       checked={field.value == choice.value ? true: false  }

                                       value={choice.value}
                                       onChange={changeHandler}
                                />
                                {choice.text} &nbsp;&nbsp;&nbsp;
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
        return formControls.map((field, index) => {
            let thisDisabled = true;
            if(this.props.permission.u !== true && addFrom == false){
                ifUpdateDisabledCanEditColumns.map((ifUpdateDisabledCanEditColumn)=>{
                    if(field.column == ifUpdateDisabledCanEditColumn)
                        thisDisabled = false;
                })
            } else
                thisDisabled = false;


            let fieldClass = '';
            if (field.error)
                fieldClass = 'has-error'

            let mainValue = this.props.formValue ?
                formValue
                :
                field.value



            const focus = false;


            const name = `${locale_index}__locale__${this.props.gridId}-solar-input${index}`;

            let title = '';

            if (field.title instanceof Object) {

                if(field.title[locale_code])
                    title = field.title[locale_code]
                else
                    title = field.title[Object.keys(field.title)[0]]
            } else
                title = field.title;



            return this.getFromField(`${locale_id}-${index}`, title, name, field, thisDisabled, fieldClass, mainValue, this.props.translateChangeHandler, this.props.formType, this.props.formData, this.props.gridId, focus);


        })
    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    render() {
        const { formControls, translateFormControls, changeHandler, formData, formType, formValue, focusIndex, gridIndex, gridId, ifUpdateDisabledCanEditColumns, permission, addFrom  } = this.props;


        const formFields = formControls.map((field, index) => {
            let thisDisabled = true;
            if(permission.u !== true && addFrom == false){
                ifUpdateDisabledCanEditColumns.map((ifUpdateDisabledCanEditColumn)=>{
                    if(field.column == ifUpdateDisabledCanEditColumn)
                        thisDisabled = false;
                })
            } else
                thisDisabled = false;


            let fieldClass = '';
            if (field.error)
                fieldClass = 'has-error'

            let mainValue = formValue ?
                formValue
                :
                field.value


            let focus = false;
            if (gridIndex) {
                if (focusIndex == gridIndex)
                    focus = true;

                index = gridIndex

            } else {
                if (focusIndex == index)
                    focus = true;
            }

            const name = `${gridId}-solar-input${index}`;


            return this.getFromField(index, field.title, name, field, thisDisabled, fieldClass, mainValue, changeHandler, formType, formData, gridId, focus);


        })


        const translateForm = translateFormControls.map((translateFormControl, locale_index)=>{

            return <Tab eventKey={locale_index} title={translateFormControl.locale_code} key={locale_index}>
                {this.getTranslationForm(translateFormControl.translate_form_input_control, translateFormControl.locale_id, translateFormControl.locale_code, locale_index)}
            </Tab>
        })


        return (
            <div>
                <Tabs defaultActiveKey={0} animation={false}>
                    {translateForm}
                </Tabs>

                <div className="none-translate-form">

                    {formFields}
                    <div style={{clear:'both'}}></div>
                </div>


            </div>)

    }
}
Form.defaultProps = {
    ifUpdateDisabledCanEditColumns:[],
    locales:[],
    translateFormControls:[],
};

Form.propTypes = {
    formControls: PropTypes.array.isRequired,
    changeHandler: PropTypes.func.isRequired
};