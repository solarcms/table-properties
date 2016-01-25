import { setupPage, getFormData } from '../api/'
import {SET_ADD_MODAL, ADD_COMBO_ADD_ABLE, COMBO_ADD_CHANGE_VALUE, COMBO_SET_ERROR}  from '../constants/';

export function setAddModal(value) {
    return {
        type: SET_ADD_MODAL,
        value
    }
}

export function addComboAddAble(data) {
    return {
        type: ADD_COMBO_ADD_ABLE,
        data:data
    }
}
export function  chagenValue(column, CAIndex, index, value) {
    return {
        type: COMBO_ADD_CHANGE_VALUE,
        column: column,
        CAIndex: CAIndex,
        index: index,
        value: value
    }
}


export function setError(column, CAIndex, index, error) {
    return {
        type: COMBO_SET_ERROR,
        column: column,
        CAIndex: CAIndex,
        index: index,
        error: error
    }
}
