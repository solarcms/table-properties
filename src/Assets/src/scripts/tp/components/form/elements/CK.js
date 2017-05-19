import React, { Component, PropTypes }  from 'react';

export default class CK extends Component {

    componentDidMount() {
        CKEDITOR.replace('ckeditor-' + this.props.keyIndex+'-'+this.props.gridId, {
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

        CKEDITOR.instances['ckeditor-' + this.props.keyIndex+'-'+this.props.gridId].on('change', function () {

            self.props.changeHandler(CKEDITOR.instances['ckeditor-' + self.props.keyIndex+'-'+this.props.gridId].getData());

        });
    }

    componentWillUnmount() {

        CKEDITOR.instances['ckeditor-' + this.props.keyIndex+'-'+this.props.gridId].destroy(true);
    }

    changeHandler() {
        return false
    }

    render() {
        const { gridId, mainValue, fieldClassName, changeHandler, index, errorText, fieldClass, placeholder, disabled, keyIndex, dataIndex } = this.props;

        return (

                <div className={`form-group ${fieldClass}  ${fieldClassName}`}  id={`solar-form-group-${dataIndex}`}>
                    <label className="control-label">{placeholder}</label>
                <textarea
                    id={`ckeditor-${keyIndex}-${gridId}`}
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
