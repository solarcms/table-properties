import {postResuest, getResuest} from './ajaxRequest'


export function setupPage() {

    return postResuest(`setup`, {});
}
export function changeLanguage(locale) {

    return postResuest(`change-language`, {locale: locale});
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
        if(fData.get('type') == '--group'){
            fData.get('controls').map((fDataSub) => {
                data[fDataSub.get('column')] = fDataSub.get('value');
            })
        } else
            data[fData.get('column')] = fData.get('value');


    })



    let translateData = [];
    translateFormControls.map((translateFormControl) => {
        let data = {};
        translateFormControl.get('translate_form_input_control').map((ftData) => {
            if(ftData.get('type') == '--group'){
                ftData.get('controls').map((ftDataSub) => {
                    data[ftDataSub.get('column')] = ftDataSub.get('value');
                })
            } else
            data[ftData.get('column')] = ftData.get('value');

        })
        let FTData = {
            locale: translateFormControl.get('locale_code'),
            data: data
        }

        translateData.push(FTData);

    })

    /////////
    let realSubItems = [];
    if(subItems.size >=1){
        subItems.map((subItem, subIndex)=>{
            let items = [];
            subItem.get('items').map((sitem)=>{
                let item = {id: sitem.get('id')};
                sitem.get('data').map((data)=>{
                    if(data.get('type') == '--group'){
                        data.get('controls').map((control)=>{
                            item[control.get('column')] = control.get('value')
                        })
                    } else
                    item[data.get('column')] = data.get('value')
                })

                items.push(item);
            })

            realSubItems.push({
                connect_column: subItem.get('connect_column'),
                items:items
            })
        })
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

export function editComboGrid(column, id) {

    return postResuest(`edit-combo-grid`, {column: column, id: id});
}

export function update(formData, translateFormControls, id, subItems) {

    let data = {};
    formData.map((fData) => {
        if(fData.get('type') == '--group'){
            fData.get('controls').map((fDataSub) => {
                data[fDataSub.get('column')] = fDataSub.get('value');
            })
        } else
            data[fData.get('column')] = fData.get('value');

    })

    let translateData = [];
    translateFormControls.map((translateFormControl) => {
        let data = {};
        translateFormControl.get('translate_form_input_control').map((ftData) => {
            if(ftData.get('type') == '--group'){
                ftData.get('controls').map((ftDataSub) => {
                    data[ftDataSub.get('column')] = ftDataSub.get('value');
                })
            } else
                data[ftData.get('column')] = ftData.get('value');

        })
        let FTData = {
            locale: translateFormControl.get('locale_code'),
            data: data
        }

        translateData.push(FTData);

    })

    /////////
    let realSubItems = [];
    if(subItems.size >=1){
        subItems.map((subItem, subIndex)=>{
            let items = [];
            subItem.get('items').map((sitem)=>{
                let item = {id: sitem.get('id')};
                sitem.get('data').map((data)=>{
                    if(data.get('type') == '--group'){
                        data.get('controls').map((control)=>{
                            item[control.get('column')] = control.get('value')
                        })
                    } else
                        item[data.get('column')] = data.get('value')
                })

                items.push(item);
            })

            realSubItems.push({
                connect_column: subItem.get('connect_column'),
                items:items
            })
        })
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

/// cascade

export function getCascadeChild(child, parent) {
    return postResuest(`get-cascade-child`, {child:child, parent: parent});
}


// check unique

export function checkUnique(table, column, value){
    return postResuest(`check-unique`, {table:table, column: column, value: value});
}