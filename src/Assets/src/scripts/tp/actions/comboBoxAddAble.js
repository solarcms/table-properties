import { setupPage, getFormData } from '../api/'
import {SET_MODAL, ADD_MODAL,  ADD_COMBO_ADD_ABLE, COMBO_ADD_CHANGE_VALUE, COMBO_SET_ERROR, COMBO_CLEAR_FORM_VALIDATION, CHANGE_FORM_DATA}  from '../constants/';

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
export function clearFromValidation(CAIndex) {
    return {
        type: COMBO_CLEAR_FORM_VALIDATION,
        CAIndex
    }
}
export function changeFormData(column, data) {

    return {
        type: CHANGE_FORM_DATA,
        column: column,
        data: data
    }
}