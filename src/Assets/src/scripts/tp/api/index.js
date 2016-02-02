import {postResuest, getResuest} from './ajaxRequest'


export function setupPage() {

    return postResuest(`setup`, {});
}
export function changeLanguage(locale_id) {

    return postResuest(`change-language`, {locale_id: locale_id});
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

export function save(formData, translateFormControls, subItems) {

    let data = {};
    formData.map((fData) => {
        data[fData.get('column')] = fData.get('value');

    })



    let translateData = [];
    translateFormControls.map((translateFormControl) => {
        let data = {};
        translateFormControl.get('translate_form_input_control').map((ftData) => {
            data[ftData.get('column')] = ftData.get('value');

        })
        let FTData = {
            locale_id: translateFormControl.get('locale_id'),
            data: data
        }

        translateData.push(FTData);

    })

    /////////
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

    return postResuest(`insert`, {data: data, translateData: translateData, subItems: realSubItems});
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
export function editTranslation(id) {

    return postResuest(`edit-translation`, {id: id});
}
export function editComboGrid(column, id) {

    return postResuest(`edit-combo-grid`, {column: column, id: id});
}

export function update(formData, translateFormControls, id, subItems) {

    let data = {};
    formData.map((fData) => {
        data[fData.get('column')] = fData.get('value');

    })

    let translateData = [];
    translateFormControls.map((translateFormControl) => {
        let data = {};
        translateFormControl.get('translate_form_input_control').map((ftData) => {
            data[ftData.get('column')] = ftData.get('value');

        })
        let FTData = {
            locale_id: translateFormControl.get('locale_id'),
            data: data
        }

        translateData.push(FTData);

    })

    /////////

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

    return postResuest(`update`, {id: id, translateData: translateData, data: data, subItems: realSubItems});
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