import React, { Component, PropTypes }  from 'react';

export default class CK extends Component {

    componentDidMount(){
        CKEDITOR.replace( 'ckeditor-'+this.props.index, {
            language: 'EN',
            height: '200',
            width: 'auto',
        });

        var self = this;

        CKEDITOR.instances['ckeditor-'+this.props.index].on('change', function() {



            self.props.changeHandler(`${self.props.gridId}-solar-input${self.props.index}`, CKEDITOR.instances['ckeditor-'+self.props.index].getData());

        });

    }
    componentWillUnmount(){



        CKEDITOR.instances['ckeditor-'+this.props.index].destroy(true);
    }

    changeHandler(){
        return false
    }
    render() {
        const { gridId, mainValue, changeHandler, index } = this.props;

        return (
                 <textarea
                     id={`ckeditor-${index}`}
                     className="form-control ckeditor"
                     name={`${gridId}-solar-input${index}`}
                     value={mainValue}
                     onChange={this.changeHandler.bind(this)}
                     />

        )
    }
}
