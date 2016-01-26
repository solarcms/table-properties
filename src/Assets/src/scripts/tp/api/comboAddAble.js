import {postResuest, getResuest} from './ajaxRequest'

export function saveComboAdd(column, formData) {

    let data = {};
    formData.map((fData) => {
        data[fData.column] = fData.value;

    })

    return postResuest(`insert-combo-add-able`, {column:column, data: data});
}
export function getComboList(column) {
    return postResuest(`combo-list`,  {column:column});
}