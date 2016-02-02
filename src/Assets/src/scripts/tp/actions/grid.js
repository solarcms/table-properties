import { setupPage, getFormData } from '../api/'
import * as types from '../constants/grid';
import {setSubItems} from './subItems'

// setup all
import {setUpForm, setFormData} from './form'


//init action
export function getSetupData() {
    return dispatch => {
        setupPage().then((data)=>{
            dispatch(receiveSetupData(data))
            dispatch(setSubItems(data.subItems))
            dispatch(setUpForm(data))
        });
        getFormData().then((data)=>{
            dispatch(setFormData(data))
        });
    }
}

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

export function setShowGrid(value) {

    return {
        type: types.SET_SHOW_GRID,
        value: value
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





