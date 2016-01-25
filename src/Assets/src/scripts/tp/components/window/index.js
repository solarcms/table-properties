import React, { Component, PropTypes }  from 'react';
import $ from 'jquery'
require('jquery-ui/draggable');

import Form from "../form/Form"

import { Modal } from 'react-bootstrap';

export default class Window extends Component {

    componentDidMount(){
        $(`#windowForm${this.props.id}`).draggable({
            handle: ".modal-header"
        });
    }
    render() {
        const { pageName, formControls, formData, changeHandler, saveForm, hideModal, id, show } = this.props;


        return (
            <Modal id={`windowForm${id}`} show={show} className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content box-shadow-z2">
                        <div className="modal-header">
                            <button type="button" className="close" aria-hidden="true" onClick={hideModal}>&times;</button>
                            <h4 className="modal-title">{pageName}</h4>

                        </div>
                        <div className="modal-body">
                            <Form gridId={id} formControls={formControls} formData={formData} ref="fromRefs" focusIndex="0"
                                  changeHandler={changeHandler}
                            />
                        </div>
                        <div className="modal-footer">
                            {this.props.edit
                                ? <button type="button" className="btn btn-fw btn-success p-h-lg" onClick="">
                                <i className="material-icons">&#xE2C3;</i>

                            </button>
                                :
                                <button type="button" className="btn btn-fw btn-success p-h-lg" onClick={saveForm}>
                                    <i className="material-icons">&#xE2C3;</i>

                                </button>
                            }

                            &nbsp;
                            <a href="javascript:void(0)" className="btn btn-fw danger p-h-lg" onClick={hideModal}>
                                <i className="material-icons">&#xE5CD;</i>
                            </a>

                        </div>
                    </div>

                </div>

            </Modal>

        )
    }
}
Window.defaultProps = {
    formControls: [],
    id: ''
}