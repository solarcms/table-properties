import React, { Component, PropTypes }  from 'react';
import Combogrid from '../elements/ComboGrid';
import Select from 'react-select';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';


import Moment from 'moment'
import momentLocalizer from 'react-widgets/lib/localizers/moment'

momentLocalizer(Moment);




export default class Form extends Component {
    openComboxFrom(column) {

        this.props.openComboboxAdableForm(column)

    }
    moveCursorToEnd(e) {


        var index = e.target.value.length;
        e.target.setSelectionRange(index, index);

    }
    moneyMask(n){
        n = n * 1;
        return n.toFixed(2).replace(/./g, function(c, i, a) {
                return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
            });

    }
    comboGridSelected(value, text, column){

        this.props.changeHandler(null, 'combo-grid', value, text, column)


    }

    comboBoxSelected(name, value){



       this.props.changeHandler(null, 'combobox', value, name)

    }

    dateTimeChange(name, value){
        value = Moment(value).format("YYYY.MM.DD HH:mm");
       this.props.changeHandler(null, 'combobox', value, name)

    }


    dateChange(name, value){
        value = Moment(value).format("YYYY.MM.DD");
       this.props.changeHandler(null, 'combobox', value, name)

    }

    date(name, value){

       this.props.changeHandler(null, 'combobox', value, name)

    }
    componentDidUpdate(){

        //$('.number').autoNumeric("init", {aPad:false});
        $('.money').autoNumeric({aPad: true, aForm: true});

    }
    render() {
        const { formControls, changeHandler, formData, formType, formValue, focusIndex, gridIndex, gridId  } = this.props;



        const formFields = formControls.map((field, index) => {

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


            if (field.type == '--text')
                return <div key={field.column}>
                        {formType == 'inline' ? <div className={`form-group ${fieldClass}`}>
                            <input
                                autoFocus={focus}
                                className="form-control"
                                name={`${gridId}-solar-input${index}`}
                                defaultValue={mainValue}
                                placeholder={field.title}
                                onFocus={this.moveCursorToEnd.bind(this)}
                                onChange={changeHandler}
                                type="text"/>


                                <span className="help-block">

                                    {field.error}
                                </span>
                        </div>
                        : <div key={field.column} className={`form-group ${fieldClass}`}>
                            <label className="control-label">{field.title}</label>
                            <input
                                autoFocus={focus}
                                className="form-control"
                                name={`${gridId}-solar-input${index}`}
                                value={mainValue}
                                placeholder={field.title}
                                onFocus={this.moveCursorToEnd.bind(this)}
                                onChange={changeHandler}
                                type="text"/>
                            <span className="help-block">

                                {field.error}
                            </span>
                        </div>}
                </div>
            else if (field.type == '--number')
                return <div key={field.column}>
                    {formType == 'inline' ? <div className={`form-group ${fieldClass}`}>
                        <input
                            autoFocus={focus}
                            className="form-control number"
                            name={`${gridId}-solar-input${index}`}
                            defaultValue={mainValue}
                            placeholder={field.title}

                            onChange={changeHandler}
                            type="number"/>


                                <span className="help-block">

                                    {field.error}
                                </span>
                    </div>
                        : <div key={field.column} className={`form-group ${fieldClass}`}>
                        <label className="control-label">{field.title}</label>
                        <input
                            autoFocus={focus}
                            className="form-control number"
                            name={`${gridId}-solar-input${index}`}
                            value={mainValue}
                            placeholder={field.title}

                            onChange={changeHandler}
                            type="number"/>
                            <span className="help-block">

                                {field.error}
                            </span>
                    </div>}
                </div>
            else if (field.type == '--money'){



                return <div key={field.column}>
                    {formType == 'inline' ? <div className={`form-group ${fieldClass}`}>
                        <input
                            autoFocus={focus}
                            className="form-control money"
                            name={`${gridId}-solar-input${index}`}
                            defaultValue={mainValue}
                            placeholder={field.title}
                            onFocus={this.moveCursorToEnd.bind(this)}
                            onKeyUp={changeHandler}
                            type="text"/>


                                <span className="help-block">

                                    {field.error}
                                </span>
                    </div>
                        : <div key={field.column} className={`form-group ${fieldClass}`}>
                        <label className="control-label">{field.title}</label>
                        <input
                            autoFocus={focus}
                            className="form-control money"
                            name={`${gridId}-solar-input${index}`}
                            value={mainValue}
                            placeholder={field.title}
                            onFocus={this.moveCursorToEnd.bind(this)}
                            onKeyUp={changeHandler}
                            type="text"/>
                            <span className="help-block">

                                {field.error}
                            </span>
                    </div>}
                </div>
            }

            else if (field.type == '--email')
                return <div key={field.column}>
                    {formType == 'inline' ? <div className={`form-group ${fieldClass}`}>
                        <input
                            autoFocus={focus}
                            className="form-control"
                            name={`${gridId}-solar-input${index}`}
                            defaultValue={mainValue}
                            placeholder={field.title}

                            onChange={changeHandler}
                            type="email"/>


                                <span className="help-block">

                                    {field.error}
                                </span>
                    </div>
                        : <div key={field.column} className={`form-group ${fieldClass}`}>
                        <label className="control-label">{field.title}</label>
                        <input
                            autoFocus={focus}
                            className="form-control"
                            name={`${gridId}-solar-input${index}`}
                            value={mainValue}
                            placeholder={field.title}

                            onChange={changeHandler}
                            type="email"/>
                            <span className="help-block">

                                {field.error}
                            </span>
                    </div>}
                </div>

            else if (field.type == '--link')
                return <div key={field.column}>
                    {formType == 'inline' ? <div className={`form-group ${fieldClass}`}>
                        <input
                            autoFocus={focus}
                            className="form-control"
                            name={`${gridId}-solar-input${index}`}
                            defaultValue={mainValue}
                            placeholder={field.title}
                            onFocus={this.moveCursorToEnd.bind(this)}
                            onChange={changeHandler}
                            type="text"/>


                                <span className="help-block">

                                    {field.error}
                                </span>
                    </div>
                        : <div key={field.column} className={`form-group ${fieldClass}`}>
                        <label className="control-label">{field.title}</label>
                        <input
                            autoFocus={focus}
                            className="form-control"
                            name={`${gridId}-solar-input${index}`}
                            value={mainValue}
                            placeholder={field.title}
                            onFocus={this.moveCursorToEnd.bind(this)}
                            onChange={changeHandler}
                            type="text"/>
                            <span className="help-block">

                                {field.error}
                            </span>
                    </div>}
                </div>

            if (field.type == '--textarea')

                return <div key={field.column}>
                {formType == 'inline' ? <div className={`form-group ${fieldClass}`}>
                    <textarea
                        autoFocus={focus}
                        className="form-control"
                        name={`${gridId}-solar-input${index}`}
                        defaultValue={mainValue}
                        placeholder={field.title}
                        onFocus={this.moveCursorToEnd.bind(this)}
                        onChange={changeHandler}
                        type="text"/>


                                <span className="help-block">

                                    {field.error}
                                </span>
                </div>
                    : <div key={field.column} className={`form-group ${fieldClass}`}>
                    <label className="control-label">{field.title}</label>
                    <textarea
                        autoFocus={focus}
                        className="form-control"
                        name={`${gridId}-solar-input${index}`}
                        value={mainValue}
                        placeholder={field.title}
                        onFocus={this.moveCursorToEnd.bind(this)}
                        onChange={changeHandler}
                        type="text"/>
                            <span className="help-block">

                                {field.error}
                            </span>
                </div>}
            </div>

            else if (field.type == '--date')

                return <div key={field.column}>
                    {formType == 'inline' ? <div className={`form-group ${fieldClass}`}>

                        <DateTimePicker
                            name={`${gridId}-solar-input${index}`}
                            defaultValue={mainValue === null ? null : new Date(mainValue)}
                            format={"YYYY.MM.DD"}
                            placeholder={field.title}
                            time={false}
                            onChange={this.dateChange.bind(this, `${gridId}-solar-input${index}`)}
                        />


                                <span className="help-block">

                                    {field.error}
                                </span>
                    </div>
                        : <div key={field.column} className={`form-group ${fieldClass}`}>
                        <label className="control-label">{field.title}</label>
                        <DateTimePicker
                            name={`${gridId}-solar-input${index}`}
                            value={mainValue === null ? null : new Date(mainValue)}
                            format={"YYYY.MM.DD"}
                            time={false}
                            onChange={this.dateChange.bind(this, `${gridId}-solar-input${index}`)}
                            placeholder={field.title}
                        />
                            <span className="help-block">

                                {field.error}
                            </span>
                    </div>}
                </div>

            else if (field.type == '--datetime')

                return <div key={field.column}>
                {formType == 'inline' ? <div className={`form-group ${fieldClass}`}>

                    <DateTimePicker
                        name={`${gridId}-solar-input${index}`}
                        defaultValue={mainValue === null ? null : new Date(mainValue)}
                        format={"YYYY.MM.DD HH:mm"}
                        placeholder={field.title}
                        onChange={this.dateTimeChange.bind(this, `${gridId}-solar-input${index}`)}
                    />


                                <span className="help-block">

                                    {field.error}
                                </span>
                </div>
                    : <div key={field.column} className={`form-group ${fieldClass}`}>
                    <label className="control-label">{field.title}</label>
                    <DateTimePicker
                        name={`${gridId}-solar-input${index}`}
                        value={mainValue === null ? null : new Date(mainValue)}
                        format={"YYYY.MM.DD HH:mm"}
                        onChange={this.dateTimeChange.bind(this, `${gridId}-solar-input${index}`)}
                        placeholder={field.title}
                    />
                            <span className="help-block">

                                {field.error}
                            </span>
                </div>}
            </div>
            else if (field.type == '--combogrid') {

                return <div key={field.column} className={`form-group ${fieldClass}`}>
                    {formType == 'inline' ? '' : <label className="control-label">{field.title}</label>}

                    {formData[field.column] ?

                            <Combogrid listData={formData[field.column].data.data}
                                       gridHeader={field.options.grid_output_control}
                                       valueField={field.options.valueField}
                                       textField={field.options.textField}
                                       formControls={formData[field.column].form_input_control}
                                       text={formData[field.column].text}

                                       column={field.column}
                                       totalPages={formData[field.column].data.last_page}
                                       totalItems={formData[field.column].data.total}
                                       pageName={field.title}

                                        comboGridSelected={this.comboGridSelected.bind(this)}


                    />


                        :
                        null}
                    <span className="help-block">
                            {field.error}
                    </span>


                </div>
            }
            else if (field.type == '--combobox') {
                let options = [];
                if(formData[field.column])
                formData[field.column].data.data.map((data, sindex)=>{
                    if (field.options.textField instanceof Array) {
                        let arrayLabel = "";
                        for (var i = 0; i < field.options.textField.length; ++i) {
                            if(i == 0)
                                arrayLabel = data[field.options.textField[i]]
                            else
                                arrayLabel = arrayLabel +", "+ data[field.options.textField[i]]
                        }

                        options.push({value: data[field.options.valueField], label: arrayLabel})
                    }
                    else {
                        options.push({value: data[field.options.valueField], label: data[field.options.textField]})
                    }

                })

                return <div key={field.column} className={`form-group ${fieldClass}`}>
                    {formType == 'inline' ? '' : <label className="control-label">{field.title}</label>}





                    {formData[field.column] ?



                        <Select
                        name={`${gridId}-solar-input${index}`}
                        value={field.value}
                        options={options}
                        onChange={this.comboBoxSelected.bind(this, `${gridId}-solar-input${index}`)}
                        />


                        :
                        null}
                    <span className="help-block">
                            {field.error}
                    </span>


                </div>
            }
            else if (field.type == '--combobox-addable') {
                let options = [];
                if(formData[field.column])
                formData[field.column].data.data.map((data, sindex)=>{
                    if (field.options.textField instanceof Array) {
                        let arrayLabel = "";
                        for (var i = 0; i < field.options.textField.length; ++i) {
                            if(i == 0)
                                arrayLabel = data[field.options.textField[i]]
                            else
                                arrayLabel = arrayLabel +", "+ data[field.options.textField[i]]
                        }

                        options.push({value: data[field.options.valueField], label: arrayLabel})
                    }
                    else {
                        options.push({value: data[field.options.valueField], label: data[field.options.textField]})
                    }

                })

                return <div key={field.column} className={`form-group ${fieldClass}`}>
                    {formType == 'inline' ? '' : <label className="control-label">{field.title}</label>}

                    {formData[field.column] ?

                        <Select
                        name={`${gridId}-solar-input${index}`}
                        value={field.value}
                        options={options}
                        onChange={this.comboBoxSelected.bind(this, `${gridId}-solar-input${index}`)}
                        />


                        :
                        null}
                    <span className="help-block">
                            {field.error}
                    </span>

                    <button className="btn btn-success" onClick={this.openComboxFrom.bind(this,field.column)}>
                        <i className="material-icons">&#xE145;</i>
                    </button>

                </div>
            }
            else if (field.type == '--tag') {
                let options = [];
                if(formData[field.column])
                formData[field.column].data.data.map((data, sindex)=>{
                    if (field.options.textField instanceof Array) {
                        let arrayLabel = "";
                        for (var i = 0; i < field.options.textField.length; ++i) {
                            if(i == 0)
                                arrayLabel = data[field.options.textField[i]]
                            else
                                arrayLabel = arrayLabel +", "+ data[field.options.textField[i]]
                        }

                        options.push({value: data[field.options.valueField], label: arrayLabel})
                    }
                    else {
                        options.push({value: data[field.options.valueField], label: data[field.options.textField]})
                    }
                })

                return <div key={field.column} className={`form-group ${fieldClass}`}>
                    {formType == 'inline' ? '' : <label className="control-label">{field.title}</label>}





                    {formData[field.column] ?



                        <Select
                        name={`${gridId}-solar-input${index}`}
                        value={field.value}
                        options={options}
                        multi={true}
                        onChange={this.comboBoxSelected.bind(this, `${gridId}-solar-input${index}`)}
                        />


                        :
                        null}
                    <span className="help-block">
                            {field.error}
                    </span>


                </div>
            }
            else if (field.type == '--checkbox')
                return <div key={field.column} className={`form-group ${fieldClass}`}>
                    <div className="checkbox">
                        {formType == 'inline' ?
                            <input type="checkbox"

                                   name={`${gridId}-solar-input${index}`}
                                   checked={field.value == 1 ? true: false  }
                                   value={1}
                                   defaultChecked={mainValue}
                                   onChange={changeHandler}
                            />
                            :
                            <label>
                                <input type="checkbox"

                                       name={`${gridId}-solar-input${index}`}
                                       checked={field.value == 1 ? true: false  }
                                       value={1}
                                       defaultChecked={mainValue}
                                       onChange={changeHandler}
                                />
                                {field.title}
                            </label>
                        }
                        < span className="help-block">
                        {field.error}
                            </span>

                    </div>
                </div>
            else if (field.type == '--radio')
                return <div key={field.column} className={`form-group ${fieldClass}`}>
                    <div className="radio">

                            <label>

                                {field.title}
                            </label> <br/>

                        {field.choices.map((choice, cindex)=>
                            <label key={cindex}>
                            <input type="radio"

                                   name={`${gridId}-solar-input${index}`}

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
        })

        return <div>{formFields}</div>

    }
}
Form.defaultProps = {};

Form.propTypes = {
    formControls: PropTypes.array.isRequired,
    changeHandler: PropTypes.func.isRequired
};