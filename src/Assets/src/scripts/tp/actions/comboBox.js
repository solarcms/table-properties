import { setupPage, getFormData } from '../api/'
import {SET_ADD_MODAL}  from '../constants/';

export function setAddModal(value) {
    return {
        type: SET_ADD_MODAL,
        value
    }
}
