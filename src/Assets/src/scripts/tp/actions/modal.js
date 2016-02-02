import * as types from '../constants/modal';

export function setModal(column, value) {
    return {
        type: types.SET_MODAL,
        column,
        value
    }
}
export function addModal(column) {
    return {
        type: types.ADD_MODAL,
        column
    }
}
