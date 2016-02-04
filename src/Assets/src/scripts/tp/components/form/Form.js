import React, { Component, PropTypes }  from 'react';
import Combogrid from './elements/ComboGrid';
import CK from './elements/CK';
import DragMap from './elements/DragMap';
import SingleFileUploader from './elements/SingleFileUploader';
import MultiFileUploader from './elements/MultiFileUploader';
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

    dateTimeChange(locale_index, dIndex, value) {
        value = Moment(value).format("YYYY.MM.DD HH:mm");

       this.manualeChangeHandler(locale_index,dIndex, value);

    }

    dateChange(locale_index, dIndex, value) {
        value = Moment(value).format("YYYY.MM.DD");
        this.manualeChangeHandler(locale_index, dIndex, value);
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
        if(locale_index === false)
            this.props.changeHandler(dataIndex, value);
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

    getFromField(locale_index, index, title, name, field, thisDisabled, fieldClass, mainValue, formType, formData, gridId, focus){


        const keyIndex = locale_index === false ? index : `__local__${locale_index}-${index}`

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
                    changeHandler={this.changeHandler.bind(this, locale_index)}
                    errorText={field.get('error')}

                />
                break;
            case "--group":
                return <fieldset className="field_set" key={keyIndex}>
                            <legend className="legendStyle">
                                {field.get('title')}
                            </legend>
                    {field.get('controls').map((control, subindex)=>{

                        let thisSubDisabled = true;
                        if(this.props.permission.u !== true && this.props.edit_parent_id == false){
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

                        return this.getFromField(locale_index, `${index}-${subindex}`, control.get('title'), subname, control, thisSubDisabled, subFieldClass, subMainValue, formType, formData, focus);


                    })}

                       </fieldset>
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
                    name={name}
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
                    placeholder={title}
                    name={name}
                    changeHandler={this.changeHandler.bind(this, locale_index)}
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
                    name={name}
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
                    name={name}
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
                    placeholder={title}
                    name={name}
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
                return <div key={keyIndex} dataIndex={index} className={`form-group ${fieldClass}  `}>
                    <label className="control-label">{title}</label>
                    <DateTimePicker
                        disabled={thisDisabled}
                        name={name}
                        defaultValue={mainValue === null ? null : new Date(mainValue)}
                        value={mainValue === null ? null : new Date(mainValue)}
                        format={"YYYY.MM.DD"}
                        time={false}
                        onChange={this.dateChange.bind(this, locale_index, `${index}`)}
                        placeholder={title}
                    />
                                <span className="help-block">
                                    {field.error}
                                </span>
                </div>
                break;
            case "--datetime":
                return <div key={keyIndex} dataIndex={index} className={`form-group ${fieldClass}  `}>
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
                        onChange={this.dateTimeChange.bind(this, locale_index, `${index}`)}
                    />
                                <span className="help-block">

                                    {field.error}
                                </span>
                </div>
                break;
            case "--combogrid":
                return <div key={keyIndex} dataIndex={index} className={`form-group ${fieldClass}  `}>
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
                    column={field.get('column')}
                    name={name}
                    fieldClass={fieldClass}
                    placeholder={title}
                    formType={formType}
                    formData={formData}
                    value={mainValue}
                    multi={false}
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
                    name={name}
                    fieldClass={fieldClass}
                    placeholder={title}
                    pageName={field.getIn(['options', 'page_name'])}
                    formType={formType}
                    formData={formData}
                    value={mainValue}
                    fieldOptions={field.get('options')}
                    formControls={field.getIn(['options', 'form_input_control'])}
                    changeHandler={this.manualeChangeHandler.bind(this, locale_index, `${index}`)}
                    errorText={field.get('error')}
                />
                break;
            case "--tag":
                return <ComboBox
                    disabled={thisDisabled}
                    key={keyIndex}
                    column={field.get('column')}
                    name={name}
                    fieldClass={fieldClass}
                    placeholder={title}
                    formType={formType}
                    formData={formData}
                    value={mainValue}
                    multi={true}
                    fieldOptions={field.get('options')}
                    changeHandler={this.manualeChangeHandler.bind(this, locale_index, `${index}`)}
                    errorText={field.get('error')}
                />
                break;
            case "--checkbox":
                return <div key={keyIndex}  className={`form-group ${fieldClass} `}>
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

                return <div key={keyIndex} dataIndex={index} className={`form-group ${fieldClass} `}>
                    <div className="radio">

                        <label>

                            {title}
                        </label> <br/>

                        {field.get('choices').map((choice, cindex)=>
                            <label key={cindex}>
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
        return formControls.map((field, index) => {
            let thisDisabled = true;
            if(this.props.permission.u !== true && edit_parent_id == false){
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



            return this.getFromField(locale_index, `${index}`, title, name, field, thisDisabled, fieldClass, mainValue, this.props.formType, this.props.formData, this.props.gridId, false);


        })
    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    render() {
        const { formControls, translateFormControls, changeHandler, formData, formType, formValue, focusIndex, gridIndex, gridId, ifUpdateDisabledCanEditColumns, permission, edit_parent_id  } = this.props;

        let formFields = formControls.size >= 1 ? formControls.map((field, index) => {
            let thisDisabled = true;
            if(permission.u !== true && edit_parent_id == false){
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



           return this.getFromField(false, index, field.get('title'), name, field, thisDisabled, fieldClass, mainValue, formType, formData, gridId, focus);


        })
            : null

        const translateForm = translateFormControls && translateFormControls.size >= 1 ? translateFormControls.map((translateFormControl, locale_index)=>{

            return <Tab eventKey={locale_index} title={translateFormControl.get('locale_code')} key={locale_index}>
                {this.getTranslationForm(translateFormControl.get('translate_form_input_control'), translateFormControl.get('locale_id'), translateFormControl.get('locale_code'), locale_index)}
            </Tab>
        }) : null

        return (
            <div className="add-edit-form">
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
};

Form.propTypes = {
    formControls: PropTypes.object.isRequired,
    changeHandler: PropTypes.func.isRequired
};