import {postResuest} from './ajaxRequest'

export function deleteFile(filename) {

    return postResuest(`delete-file`, {filename:filename});
}

export function deleteFile_for_multi(image_table, filename, id) {

    return postResuest(`delete-file-multi`, {image_table:image_table, filename:filename, id:id});
}


export function getExtraImages(image_table, parent_id) {

    return postResuest(`get-extra-images`, {image_table:image_table, parent_id:parent_id});
}

