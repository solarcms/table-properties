import React, { Component, PropTypes }  from 'react';

import {moveCursorToEnd} from '../helpers/'

export default class Input extends Component {

    componentDidMount(){


    }
    componentWillUnmount(){


    }

    render() {
        const { autoFocus, name, value, placeholder, changeHandler, errorText, fieldClass, type } = this.props;

        return (

                <div  className={`form-group ${fieldClass}`}>
                    <label className="control-label">{placeholder}</label>

                    <input
                        autoFocus={autoFocus}
                        className="form-control"
                        name={name}
                        value={value}
                        placeholder={placeholder}
                        onFocus={moveCursorToEnd}
                        onChange={changeHandler}
                        type={type}/>

                    <span className="help-block">

                                        {errorText}
                    </span>

                </div>


        )
    }
}
