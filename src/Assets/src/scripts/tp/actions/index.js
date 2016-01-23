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


/// combo grid
export function setCurrentPageComboGrid(page) {

    return {
        type: types.SET_CURENT_PAGE_COMBO_GRID,
        page: page
    }
}

export function changeFormData(column, data) {

    return {
        type: types.CHANGE_FORM_DATA,
        column: column,
        data: data
    }
}
export function comboGridChageValue(column, index, value) {

    return {
        type: types.COMBO_GRID_CHANGE_VALUE,
        column: column,
        index: index,
        value: value
    }
}
export function comboGridSetError(column, index, error) {

    return {
        type: types.COMBO_GRID_SET_ERROR,
        column: column,
        index: index,
        error: error
    }
}
export function clearComboGridFormValidation(column) {

    return {
        type: types.CLEAR_COMBO_GRID_FORM_VALIDATION,
        column: column
    }
}
export function setComboGridText(column, text) {

    return {
        type: types.SET_COMBO_GRID_TEXT,
        column: column,
        text: text
    }
}
