import { setupPage, getFormData } from '../api/'
import {SET_SUB_ITEMS,
    SUB_ITEMS_CHANGE_VALUE,
    SUB_ITEMS_SET_ERROR,
    SUB_ITEMS_CLEAR_FORM_VALIDATION,
    SUB_ITEMS_ADD_ITEM,
    SUB_ITEMS_EDIT_ITEM,
    SUB_ITEMS_UPDATE_ITEM,
    SUB_ITEMS_DELETE_ITEM,
    CLEAR_SUB_ITEMS
}  from '../constants/';
export {setModal, addModal} from './modal'



export function setSubItems(data) {
    return {
        type: SET_SUB_ITEMS,
        data
    }
}
export function clearSubItems() {
    return {
        type: CLEAR_SUB_ITEMS
    }
}
export function  chagenValue(column, CAIndex, index, value) {
    return {
        type: SUB_ITEMS_CHANGE_VALUE,
        column: column,
        CAIndex: CAIndex,
        index: index,
        value: value
    }
}
export function setError(column, CAIndex, index, error) {
    return {
        type: SUB_ITEMS_SET_ERROR,
        column: column,
        CAIndex: CAIndex,
        index: index,
        error: error
    }
}
export function clearFromValidation(CAIndex) {
    return {
        type: SUB_ITEMS_CLEAR_FORM_VALIDATION,
        CAIndex
    }
}

/// items
export function addSubItem(Sindex, item){
    return {
        type:SUB_ITEMS_ADD_ITEM,
        Sindex: Sindex,
        item: item
    }
}
export function editSubItem(Sindex, formControl, editIndex){
    return {
        type:SUB_ITEMS_EDIT_ITEM,
        Sindex: Sindex,
        formControl: formControl,
        editIndex: editIndex
    }
}
export function updateSubItem(Sindex, Iindex, item){
    return {
        type:SUB_ITEMS_UPDATE_ITEM,
        Sindex: Sindex,
        Iindex: Iindex,
        item: item
    }
}
export function deleteSubItem(Sindex, Iindex){
    return {
        type:SUB_ITEMS_DELETE_ITEM,
        Sindex: Sindex,
        Iindex: Iindex
    }
}