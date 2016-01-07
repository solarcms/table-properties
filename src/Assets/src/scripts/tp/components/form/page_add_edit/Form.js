import React, { Component, PropTypes }  from 'react';
import Combogrid from '../elements/ComboGrid';


export default class Form extends Component {
    moveCursorToEnd(e) {

        var index = e.target.value.length;
        e.target.setSelectionRange(index, index);

    }

    render() {
        const { formControls, changeHandler, formData, formType, formValue, focusIndex, gridIndex  } = this.props;


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
                                name={`solar-input${index}`}
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
                                name={`solar-input${index}`}
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

                return <div key={field.column} className={`form-group ${fieldClass}`}>
                    {formType == 'inline' ? '' : <label className="control-label">{field.title}</label>}
                    <textarea
                        className="form-control"
                        name={`solar-input${index}`}
                        placeholder={field.title}
                        onChange={changeHandler}
                    >
                        {mainValue}
                    </textarea>
                    <span className="help-block">
                        {field.error}
                    </span>


                </div>
            else if (field.type == '--combogrid') {

                return <div key={field.column} className={`form-group ${fieldClass}`}>
                    {formType == 'inline' ? '' : <label className="control-label">{field.title}</label>}

                    {formData[field.column] ?
                        <Combogrid listData={formData[field.column].data} gridHeader={field.options.columns}/>
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

                                   name={`solar-input${index}`}

                                   defaultChecked={mainValue}
                                   onChange={changeHandler}
                            />
                            :
                            <label>
                                <input type="checkbox"

                                       name={`solar-input${index}`}

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
        })

        return <div>{formFields}</div>

    }
}
Form.defaultProps = {};

Form.propTypes = {
    formControls: PropTypes.array.isRequired,
    changeHandler: PropTypes.func.isRequired
};