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




        return (
            <Draggable handle=".modal-header">
                <Modal id={`windowForm${id}`} show={show} backdrop={false}  onHide={hideModal}>

                    <Modal.Header closeButton>
                        <Modal.Title>{pageName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form gridId={id} formControls={formControls} formData={formData} ref="fromRefs" focusIndex="0"
                              changeHandler={changeHandler}
                        />
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
                    </Modal.Footer>

                </Modal>
            </Draggable>

        )
    }
}
