import {postResuest, getResuest} from './ajaxRequest'
export {getCascadeChild} from './index'
export function saveComboAdd(column, formData) {

    let data = {};
    formData.map((fData) => {
        if(fData.get('type') == '--group'){
            fData.get('controls').map((fDataSub) => {
                data[fDataSub.get('column')] = fDataSub.get('value');
            })
        } else
            data[fData.get('column')] = fData.get('value');
    })

    return postResuest(`insert-combo-add-able`, {column:column, data: data});
}
export function getComboList(column) {
    return postResuest(`combo-list`,  {column:column});
}
