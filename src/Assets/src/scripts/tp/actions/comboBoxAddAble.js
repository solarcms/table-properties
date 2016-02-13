import { setupPage, getFormData } from '../api/'
import * as types from '../constants/comboBoxAddAble';
export {setModal, addModal} from './modal'
export {changeFormData} from './form'

export function addComboAddAble(column, data) {
    return {
        type: types.ADD_COMBO_ADD_ABLE,
        column:column,
        data:data
    }
}
export function  chagenValue(column, CAIndex, index, value) {
    return {
        type: types.COMBO_ADD_CHANGE_VALUE,
        column: column,
        CAIndex: CAIndex,
        index: index,
        value: value
    }
}


export function setError(column, CAIndex, index, error) {
    return {
        type: types.COMBO_SET_ERROR,
        column: column,
        CAIndex: CAIndex,
        index: index,
        error: error
    }
}
export function clearFromValidation(CAIndex) {
    return {
        type: types.COMBO_CLEAR_FORM_VALIDATION,
        CAIndex
    }
}
