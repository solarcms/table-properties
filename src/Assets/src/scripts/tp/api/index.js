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

export function save(formData, subItems) {

    let data = {};
    formData.map((fData) => {
        data[fData.column] = fData.value;

    })
    let realSubItems = [];
    if(subItems.length >=1){
        for (var i = 0; i < subItems.length; ++i) {
            let items = [];
            for (var a = 0; a < subItems[i].items.length; ++a) {
                let item = {id: subItems[i].items[a].id};
                for (var c = 0; c < subItems[i].items[a].data.length; ++c) {

                    item[subItems[i].items[a].data[c].column] = subItems[i].items[a].data[c].value;

                }

                items.push(item);

            }
            realSubItems.push({
                connect_column: subItems[i].connect_column,
                items:items
            })
        }
    }

    return postResuest(`insert`, {data: data, subItems: realSubItems});
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

export function update(formData, id, subItems) {

    let data = {};
    formData.map((fData) => {
        data[fData.column] = fData.value;

    })

    let realSubItems = [];
    if(subItems.length >=1){
        for (var i = 0; i < subItems.length; ++i) {
            let items = [];
            for (var a = 0; a < subItems[i].items.length; ++a) {
                let item = {id: subItems[i].items[a].id};
                for (var c = 0; c < subItems[i].items[a].data.length; ++c) {

                    item[subItems[i].items[a].data[c].column] = subItems[i].items[a].data[c].value;

                }

                items.push(item);

            }
            realSubItems.push({
                connect_column: subItems[i].connect_column,
                items:items
            })
        }
    }

    return postResuest(`update`, {id: id, data: data, subItems: realSubItems});
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