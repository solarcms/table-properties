import {postResuest, getResuest} from './ajaxRequest'


export function setupPage() {
    return postResuest(`setup`, {});
}


export function deleteItem(id) {
    return postResuest(`delete`, {id: id});
}


export function getList(page, data) {
    return postResuest(`grid_list?page=${page}`, data);
}
export function getComboList(page, data) {
    return postResuest(`grid_combo_list?page=${page}`, data);
}
export function getFormData() {
    return postResuest(`get_form_datas`, {});
}

export function save(formData) {

    let data = {};
    formData.map((fData) => {
        data[fData.column] = fData.value;

    })

    return postResuest(`insert`, {data: data});
}
export function saveComboGrid(column, formData) {



    let data = {};
    formData.map((fData) => {
        data[fData.column] = fData.value;

    })

    return postResuest(`insert-combo-grid`, {column: column, data: data});
}
export function edit(id) {

    return postResuest(`edit`, {id: id});
}
export function editComboGrid(column, id) {

    return postResuest(`edit-combo-grid`, {column: column, id: id});
}

export function update(formData, id) {

    let data = {};
    formData.map((fData) => {
        data[fData.column] = fData.value;

    })

    return postResuest(`update`, {id: id, data: data});
}
export function updateComboGrid(column, formData, id) {

    let data = {};
    formData.map((fData) => {
        data[fData.column] = fData.value;

    })

    return postResuest(`update-combo-grid`, {column: column, id: id, data: data});
}

export function deleteItemComboGrid(column, id) {
    return postResuest(`delete-combo-grid`, {column:column, id: id});
}