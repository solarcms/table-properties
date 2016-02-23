import React, { Component, PropTypes }  from 'react';

export default class CK extends Component {

    componentDidMount() {
        CKEDITOR.replace('ckeditor-' + this.props.keyIndex, {
            language: 'EN',
            height: '200',
            width: 'auto',
            filebrowserBrowseUrl: '/shared/ckeditor/ckfinder/ckfinder.html',
            filebrowserImageBrowseUrl: '/shared/ckeditor/ckfinder/ckfinder.html?type=Images',
            filebrowserFlashBrowseUrl: '/shared/ckeditor/ckfinder/ckfinder.html?type=Flash',
            filebrowserUploadUrl: '/shared/ckeditor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files',
            filebrowserImageUploadUrl: '/shared/ckeditor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images',
            filebrowserFlashUploadUrl: '/shared/ckeditor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Flash'
        });

        var self = this;

        CKEDITOR.instances['ckeditor-' + this.props.keyIndex].on('change', function () {

            self.props.changeHandler(CKEDITOR.instances['ckeditor-' + self.props.keyIndex].getData());

        });
    }

    componentWillUnmount() {

        CKEDITOR.instances['ckeditor-' + this.props.keyIndex].destroy(true);
    }

    changeHandler() {
        return false
    }

    render() {
        const { gridId, mainValue, changeHandler, index, errorText, fieldClass, placeholder, disabled, keyIndex } = this.props;

        return (

                <div className={`form-group ${fieldClass}  `}>
                    <label className="control-label">{placeholder}</label>
                <textarea
                    id={`ckeditor-${keyIndex}`}
                    className="form-control ckeditor"
                    name={this.props.name}
                    value={mainValue}
                    onChange={changeHandler}
                    disabled={disabled}
                />
                <span className="help-block">
                    {errorText}
                </span>
                </div>



        )
    }
}
