import React, { Component, PropTypes }  from 'react';
import $ from 'jquery'

import Draggable from 'react-draggable';

import Form from "../form/Form"

import { Modal } from 'react-bootstrap';

export default class Window extends Component {

    componentDidMount(){


    }
    render() {
        const { pageName, formControls, formData, changeHandler, saveForm, hideModal, id, show } = this.props;

        const deleteButton = this.props.showDelete == true ? <button type="button" className="btn btn-fw btn-danger p-h-lg" onClick={this.props.delete}>
                                                        <i className="material-icons">&#xE872;</i>
                                                    </button> : null


        return (
            <Draggable handle=".modal-header">
                <Modal id={`windowForm${id}`} className="modal-shadowed" show={show} backdrop={false}  onHide={hideModal} bsSize="large">

                    <Modal.Header closeButton>
                        <Modal.Title>{pageName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <Form gridId={id} formControls={formControls} formData={formData} ref="fromRefs" focusIndex="0"
                                  changeHandler={changeHandler}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
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

                        {deleteButton}

                    </Modal.Footer>

                </Modal>
            </Draggable>

        )
    }
}
