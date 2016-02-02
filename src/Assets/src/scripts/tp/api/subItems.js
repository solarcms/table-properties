import {postResuest, getResuest} from './ajaxRequest'
export {getCascadeChild} from './index'
export function subItems_edit_request(connect_column, parent_id) {

     return postResuest(`edit-sub-items`, {connect_column:connect_column, parent_id: parent_id});
}


export function delete_sub_item(connect_column, id) {

     return postResuest(`delete-sub-items`, {connect_column:connect_column, id: id});
}
