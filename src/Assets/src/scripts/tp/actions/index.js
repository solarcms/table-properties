import { setupPage, getFormData } from '../api/'
import * as types from '../constants/';


/*
 * action creators
 */

export function receiveSetupData(setupData) {
    return {
        type: types.SETUP,
        setupData
    }
}
export function receiveListData(listData) {
    return {
        type: types.SET_LIST,
        listData
    }
}

export function setCurrentPage(page) {
    return {
        type: types.SET_CURENT_PAGE,
        page
    }
}
export function setPageLimit(limit) {
    return {
        type: types.SET_PAGE_LIMIT,
        limit
    }
}
export function setSearch(word) {
    return {
        type: types.SET_SEARCH,
        word
    }
}
/// add edit form
export function chagenValue(index, value) {

    return {
        type: types.CHANGE_VALUE,
        index: index,
        value: value
    }
}
export function setError(index, error) {
    return {
        type: types.SET_ERROR,
        index: index,
        error: error
    }
}
export function setFormData(data) {

    return {
        type: types.SET_FORM_DATA,
        data: data
    }
}
export function setRowEdit(editID, focusIndex) {

    return {
        type: types.SET_EDIT_ROW,
        editID: editID,
        focusIndex: focusIndex
    }
}
export function setInlineFrom(value) {

    return {
        type: types.SET_INLINE_FORM,
        value: value
    }
}
export function clearFromValidation() {
    return {
        type: types.CLEAR_FORM_VALIDATION
    }
}

/////
export function getSetupData() {
    return dispatch => {
        setupPage().then((data)=>{
            dispatch(receiveSetupData(data))
        });
        getFormData().then((data)=>{
            dispatch(setFormData(data))
        });
    }
}
