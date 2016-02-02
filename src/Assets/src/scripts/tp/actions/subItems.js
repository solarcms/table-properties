import { setupPage, getFormData } from '../api/'
import * as types from '../constants/subItems';
export {setModal, addModal} from './modal'
export {changeFormData} from './form'



export function setSubItems(data) {

    return {
        type: types.SET_SUB_ITEMS,
        data
    }
}
export function clearSubItems() {
    return {
        type: types.CLEAR_SUB_ITEMS
    }
}
export function  chagenValue(column, CAIndex, index, value) {
    return {
        type: types.SUB_ITEMS_CHANGE_VALUE,
        column: column,
        CAIndex: CAIndex,
        index: index,
        value: value
    }
}
export function setError(column, CAIndex, index, error) {
    return {
        type: types.SUB_ITEMS_SET_ERROR,
        column: column,
        CAIndex: CAIndex,
        index: index,
        error: error
    }
}
export function clearFromValidation(CAIndex) {
    return {
        type: types.SUB_ITEMS_CLEAR_FORM_VALIDATION,
        CAIndex
    }
}

/// items
export function addSubItem(Sindex, item){
    return {
        type: types.SUB_ITEMS_ADD_ITEM,
        Sindex: Sindex,
        item: item
    }
}
export function editSubItem(Sindex, formControl, editIndex){
    return {
        type: types.SUB_ITEMS_EDIT_ITEM,
        Sindex: Sindex,
        formControl: formControl,
        editIndex: editIndex
    }
}
export function updateSubItem(Sindex, Iindex, item){
    return {
        type: types.SUB_ITEMS_UPDATE_ITEM,
        Sindex: Sindex,
        Iindex: Iindex,
        item: item
    }
}
export function deleteSubItem(Sindex, Iindex){
    return {
        type: types.SUB_ITEMS_DELETE_ITEM,
        Sindex: Sindex,
        Iindex: Iindex
    }
}