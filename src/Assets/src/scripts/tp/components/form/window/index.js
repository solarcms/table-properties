import React, { Component, PropTypes }  from 'react';
import $ from 'jquery'
require('jquery-ui/draggable');

import Form from "../page_add_edit/Form"

export default class Window extends Component {

    componentDidMount(){
        $("#windowForm").draggable({
            handle: ".modal-header"
        });
    }
    render() {
        const { pageName, formControls, formData, changeHandler, saveForm, hideModal } = this.props;
        return (
            <div id="windowForm" className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content box-shadow-z2">
                        <div className="modal-header">
                            <button type="button" className="close" aria-hidden="true" onClick={hideModal}>&times;</button>
                            <h4 className="modal-title">{pageName}</h4>

                        </div>
                        <div className="modal-body">
                            <Form formControls={formControls} formData={formData} ref="fromRefs" focusIndex="0"
                                  changeHandler={changeHandler}
                            />
                        </div>
                        <div className="modal-footer">
                            {this.props.edit
                                ? <button type="button" className="btn btn-fw btn-success p-h-lg" onClick="">
                                <i className="fa fa-check"></i>

                            </button>
                                :
                                <button type="button" className="btn btn-fw btn-success p-h-lg" onClick={saveForm}>
                                    <i className="fa fa-check"></i>

                                </button>
                            }

                            &nbsp;
                            <a href="javascript:void(0)" className="btn btn-fw danger p-h-lg" onClick={hideModal}>
                                <i className="fa fa-times"></i>
                            </a>

                        </div>
                    </div>

                </div>

            </div>

        )
    }
}
Window.defaultProps = {
    formControls: []
}