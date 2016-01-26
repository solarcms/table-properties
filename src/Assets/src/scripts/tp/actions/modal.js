import {SET_MODAL, ADD_MODAL}  from '../constants/';

export function setModal(column, value) {
    return {
        type: SET_MODAL,
        column,
        value
    }
}
export function addModal(column) {
    return {
        type: ADD_MODAL,
        column
    }
}
