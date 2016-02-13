import $ from 'jquery'

const protcol = window.location.protocol !== 'https:' ? 'http://' :  'https://';
const baseUrl = protcol+window.location.hostname + window.location.pathname+'/';
//const baseUrl = "http://localhost:8080" + window.location.pathname+'/';



export function postResuest(url, data) {
    return $.ajax({
        url: baseUrl+url,
        type: 'POST',
        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
        data:data
    })
}

export function getResuest(url) {
    return $.ajax({
        url: baseUrl+url,
        type: 'GET'
    })
}
