import { setupPage, getFormData } from '../api/'
import * as types from '../constants/form';


/// add edit form
export function setUpForm(setupData) {

    return {
        type: types.FORM_SETUP,
        setupData: setupData
    }
}
export function setShowAddEditForm(value) {

    return {
        type: types.SET_SHOW_ADD_EDIT_FORM,
        value: value
    }
}
export function receiveListData(listData) {
    return {
        type: types.SET_LIST,
        listData
    }
}
export function changeValue(index, value) {

    return {
        type: types.CHANGE_VALUE,
        index: index,
        value: value
    }
}
export function changeStatus(index, status) {

    return {
        type: types.CHANGE_STATUS,
        index: index,
        status: status
    }
}

export function setFormData(data) {

    return {
        type: types.SET_FORM_DATA,
        data: data
    }
}

export function setError(index, error) {

    return {
        type: types.SET_ERROR,
        index: index,
        error: error
    }
}
export function clearFromValidation() {
    return {
        type: types.CLEAR_FORM_VALIDATION
    }
}


/// translation
export function changeTranslationValue(locale_index, index, value) {

    return {
        type: types.CHANGE_TRANSLATION_VALUE,
        locale_index: locale_index,
        index: index,
        value: value
    }
}
export function setTranslationError(locale_index, index, error) {

    return {
        type: types.SET_TRANSLATION_ERROR,
        locale_index: locale_index,
        index: index,
        error: error
    }
}
export function clearTranslationFromValidation() {
    return {
        type: types.CLEAR_TRANSLATION_FORM_VALIDATION
    }
}

///
export function changeFormData(column, data) {
    if(data instanceof Array){

    } else {
        data = [];
    }
    return {
        type: types.CHANGE_FORM_DATA,
        column: column,
        data: data
    }
}