import React, { Component, PropTypes }  from 'react';


// import Draggable from 'react-draggable';

import Form from "../form/Form"

import Modal  from 'react-bootstrap/lib/Modal';

export default class Window extends Component {

    componentDidMount(){


    }
    render() {
        const { pageName, edit_parent_id, sub_index, formControls, formData, changeHandler, saveForm, hideModal, id, show, fromFieldClass, permission, ifUpdateDisabledCanEditColumns, button_texts,  } = this.props;

        const deleteButton = this.props.showDelete == true ? <button type="button" className="btn btn-fw btn-danger p-h-lg" onClick={this.props.delete}>
                                                        <i className="material-icons">&#xE872;</i> {button_texts ? button_texts.delete_text : null}
                                                    </button> : null
        
        return (

                <Modal id={`windowForm${id}`} className="modal-shadowed" show={show} backdrop={false}  onHide={hideModal} bsSize="large">

                    <Modal.Header closeButton>
                        <Modal.Title>{pageName} </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row solar-form">
                            <Form gridId={id} formControls={formControls} formData={formData} ref="fromRefs" focusIndex="0"
                                  permission={permission}
                                  edit_parent_id={edit_parent_id}
                                  ifUpdateDisabledCanEditColumns={ifUpdateDisabledCanEditColumns}
                                  changeHandler={changeHandler}
                                  fromFieldClass={fromFieldClass}
                                  setErrorManuale={this.props.setErrorManuale}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {this.props.edit
                            ? <button type="button" className="btn btn-fw btn-success p-h-lg" onClick="">
                            <i className="material-icons">&#xE2C3;</i> {button_texts ? button_texts.save_text : null}

                        </button>
                            :
                            <button type="button" className="btn btn-fw btn-success p-h-lg" onClick={saveForm}>
                                <i className="material-icons">&#xE2C3;</i> {button_texts ? button_texts.save_text : null}

                            </button>
                        }

                        &nbsp;
                        <a href="javascript:void(0)" className="btn btn-fw danger p-h-lg" onClick={hideModal}>
                            <i className="material-icons">&#xE5CD;</i> {button_texts ? button_texts.cancel_text : null}
                        </a>

                        {deleteButton}

                    </Modal.Footer>

                </Modal>


        )
    }
}
