import * as types from '../constants/comboGrid';


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
