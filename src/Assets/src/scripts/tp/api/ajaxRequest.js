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
