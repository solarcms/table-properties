import $ from 'jquery'
export function postResuest(url, data) {
    return $.ajax({
        url: url,
        type: 'POST',
        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
        data:data
    })
}

export function getResuest(url) {
    return $.ajax({
        url: url,
        type: 'GET'
    })
}

export function setupPage() {
    return postResuest(`setup`, {});
}


export function deleteItem(id) {
    return postResuest(`delete`, {id: id});
}

export function getList(page, data) {
    return postResuest(`grid_list?page=${page}`, data);
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
export function edit(id) {

    return postResuest(`edit`, {id: id});
}

export function update(formData, id) {

    let data = {};
    formData.map((fData) => {
        data[fData.column] = fData.value;

    })

    return postResuest(`update`, {id: id, data: data});
}

