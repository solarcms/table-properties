import React, { Component, PropTypes }  from 'react';

export default class CK extends Component {

    componentDidMount() {
        CKEDITOR.replace('ckeditor-' + this.props.index, {
            language: 'EN',
            height: '200',
            width: 'auto',
        });

        var self = this;

        CKEDITOR.instances['ckeditor-' + this.props.index].on('change', function () {

            self.props.changeHandler(`${self.props.gridId}-solar-input${self.props.index}`, CKEDITOR.instances['ckeditor-' + self.props.index].getData());

        });
    }

    componentWillUnmount() {

        CKEDITOR.instances['ckeditor-' + this.props.index].destroy(true);
    }

    changeHandler() {
        return false
    }

    render() {
        const { gridId, mainValue, changeHandler, index, errorText, fieldClass, placeholder } = this.props;

        return (

                <div className={`form-group ${fieldClass}  col-md-12`}>
                    <label className="control-label">{placeholder}</label>
                <textarea
                    id={`ckeditor-${index}`}
                    className="form-control ckeditor"
                    name={`${gridId}-solar-input${index}`}
                    value={mainValue}
                    onChange={changeHandler}
                />
                <span className="help-block">
                    {errorText}
                </span>
                </div>



        )
    }
}
