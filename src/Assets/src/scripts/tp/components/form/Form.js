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

    dateTimeChange(dIndex, value) {
        value = Moment(value).format("YYYY.MM.DD HH:mm");

       this.manualChangeHandler(dIndex, value);

    }

    dateChange(dIndex, value) {
        value = Moment(value).format("YYYY.MM.DD");
        this.manualChangeHandler(dIndex, value);
    }
    changeHandler(e){


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

      this.props.changeHandler(dataIndex, value);
    }
    manualChangeHandler(dIndex, value) {


        let dataIndexs  =  dIndex.split('-');

        let dataIndex = [];

        dataIndexs.map((key)=>{
            dataIndex.push(key*1);
        });

       this.props.changeHandler(dataIndex, value);

        //if(name.indexOf('__locale__') >= 1)
        //    this.props.translateChangeHandler(null, 'manual', value, name)
        //else
        //    this.props.changeHandler(null, 'manual', value, name)
    }

    getFromField(index, title, name, field, thisDisabled, fieldClass, mainValue, formType, formData, gridId, focus){


        switch (field.get('type')) {
            case "--text":
                return <Input
                    disabled={thisDisabled}
                    key={index} dataIndex={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="text"
                    autoFocus={focus}
                    placeholder={title}
                    name={name}
                    changeHandler={this.changeHandler.bind(this)}
                    errorText={field.get('error')}

                />
                break;
            case "--number":
                return <Input
                    disabled={thisDisabled}
                    key={index} dataIndex={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="number"
                    autoFocus={focus}
                    placeholder={title}
                    name={name}
                    changeHandler={this.changeHandler.bind(this)}
                    errorText={field.get('error')}

                />
                break;
            case "--money":
                return <Input
                    disabled={thisDisabled}
                    key={index} dataIndex={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="money"
                    autoFocus={focus}
                    placeholder={title}
                    name={name}
                    changeHandler={this.changeHandler.bind(this)}
                    errorText={field.get('error')}

                />
                break;
            case "--email":
                return <Input
                    disabled={thisDisabled}
                    key={index} dataIndex={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="email"
                    autoFocus={focus}
                    placeholder={title}
                    name={name}
                    changeHandler={this.changeHandler.bind(this)}
                    errorText={field.get('error')}

                />
                break;
            case "--link":
                return <Input
                    disabled={thisDisabled}
                    key={index} dataIndex={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="text"
                    autoFocus={focus}
                    placeholder={title}
                    name={name}
                    changeHandler={this.changeHandler.bind(this)}
                    errorText={field.get('error')}

                />
                break;
            case "--textarea":
                return <Input
                    disabled={thisDisabled}
                    key={index} dataIndex={index}
                    fieldClass={fieldClass}
                    value={mainValue}
                    type="textarea"
                    autoFocus={focus}
                    placeholder={title}
                    name={name}
                    changeHandler={this.changeHandler.bind(this)}
                    errorText={field.get('error')}

                />
                break;
            case "--ckeditor":
                return <CK
                    disabled={thisDisabled}
                    key={index} dataIndex={index}
                    placeholder={title}
                    fieldClass={fieldClass}
                    name={name}
                    gridId={gridId}
                    index={index}
                    mainValue={mainValue}
                    changeHandler={this.manualChange.bind(this, `${index}`)}
                    errorText={field.get('error')}

                />
                break;
            case "--drag-map":
                return <DragMap
                    disabled={thisDisabled}
                    key={index} dataIndex={index}
                    placeholder={title}
                    fieldClass={fieldClass}
                    gridId={gridId}
                    index={index}
                    name={name}
                    mainValue={mainValue}
                    changeHandler={this.manualChange.bind(this, `${index}`)}
                    errorText={field.get('error')}

                />
                break;
            case "--single-file":
                return <SingleFileUploader
                    disabled={thisDisabled}
                    key={index} dataIndex={index}
                    fieldClass={fieldClass}
                    gridId={gridId}
                    placeholder={title}
                    index={index}
                    name={name}
                    mainValue={mainValue}
                    changeHandler={this.manualChange.bind(this, `${index}`)}
                    errorText={field.get('error')}
                />
                break;
            case "--date":
                return <div key={index} dataIndex={index} className={`form-group ${fieldClass}  col-md-12`}>
                    <label className="control-label">{title}</label>
                    <DateTimePicker
                        disabled={thisDisabled}
                        name={name}
                        defaultValue={mainValue === null ? null : new Date(mainValue)}
                        value={mainValue === null ? null : new Date(mainValue)}
                        format={"YYYY.MM.DD"}
                        time={false}
                        onChange={this.dateChange.bind(this, `${index}`)}
                        placeholder={title}
                    />
                                <span className="help-block">
                                    {field.error}
                                </span>
                </div>
                break;
            case "--datetime":
                return <div key={index} dataIndex={index} className={`form-group ${fieldClass}  col-md-12`}>
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
                        onChange={this.dateTimeChange.bind(this, `${index}`)}
                    />
                                <span className="help-block">

                                    {field.error}
                                </span>
                </div>
                break;
            case "--combogrid":
                return <div key={index} dataIndex={index} className={`form-group ${fieldClass}  col-md-12`}>
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
                    key={index}
                    column={field.get('column')}
                    name={name}
                    fieldClass={fieldClass}
                    placeholder={title}
                    formType={formType}
                    formData={formData}
                    value={mainValue}
                    multi={false}
                    fieldOptions={field.get('options')}
                    changeHandler={this.manualChangeHandler.bind(this, `${index}`)}
                    errorText={field.get('error')}
                />
                break;
            case "--combobox-addable":
                return <ComboBoxAddAble
                    disabled={thisDisabled}
                    key={index} dataIndex={index}
                    column={field.get('column')}
                    name={name}
                    fieldClass={fieldClass}
                    placeholder={title}
                    pageName={field.getIn(['options', 'page_name'])}
                    formType={formType}
                    formData={formData}
                    value={mainValue}
                    fieldOptions={field.get('options')}
                    formControls={field.getIn(['options', 'form_input_control'])}
                    changeHandler={this.manualChangeHandler.bind(this, `${index}`)}
                    errorText={field.get('error')}
                />
                break;
            case "--tag":
                return <ComboBox
                    disabled={thisDisabled}
                    key={index}
                    column={field.get('column')}
                    name={name}
                    fieldClass={fieldClass}
                    placeholder={title}
                    formType={formType}
                    formData={formData}
                    value={mainValue}
                    multi={true}
                    fieldOptions={field.get('options')}
                    changeHandler={this.manualChangeHandler.bind(this, `${index}`)}
                    errorText={field.get('error')}
                />
                break;
            case "--checkbox":
                return <div key={index}  className={`form-group ${fieldClass} col-md-12`}>
                    <div className="checkbox">
                        {formType == 'inline' ?
                            <input type="checkbox"
                                   disabled={thisDisabled}
                                   name={name}
                                   checked={field.value == 1 ? true: false  }
                                   value={1}

                                   data-index={index}
                                   onChange={this.changeHandler.bind(this)}
                            />
                            :
                            <label>
                                <input type="checkbox"
                                       disabled={thisDisabled}
                                       name={name}
                                       checked={field.value == 1 ? true: false  }
                                       value={1}

                                       data-index={index}
                                       onChange={this.changeHandler.bind(this)}
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

                return <div key={index} dataIndex={index} className={`form-group ${fieldClass} col-md-12`}>
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
                                       onChange={this.changeHandler.bind(this)}
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
                    if(field.get('column') == ifUpdateDisabledCanEditColumn)
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

        let formFields = formControls.map((field, index) => {
            let thisDisabled = true;
            if(permission.u !== true && addFrom == false){
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

            const name = `testt-test${index}`;


           return this.getFromField(index, field.get('title'), name, field, thisDisabled, fieldClass, mainValue, formType, formData, gridId, focus);


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
    formControls: PropTypes.object.isRequired,
    changeHandler: PropTypes.func.isRequired
};