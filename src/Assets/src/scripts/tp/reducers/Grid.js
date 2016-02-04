import createReducer from '../lib/createReducer';

import Immutable from 'immutable';

import * as types from '../constants/grid';

const initialState = {
    setup: {},
    listData:{},
    form_input_control:{},
    currentPage:1,
    pageLimit:50,
    formData:{},
    showAddEditForm:false,
    showGird:false,
    editID:0,
    focusIndex:0,
    showInlineForm: false,
    comboGrid:{
        currentPage:1,
    },
    comboBoxAddAble: {},
    translateFormControls:{}
};

export default createReducer(initialState, {
    [types.SETUP](state, { setupData }) {

        const data = Immutable.fromJS(setupData);

        state = state.set('setup', data);

        state = state.set('pageLimit', setupData.pageLimit);


        return state;
    },
    [types.SET_LIST](state, { listData }) {

        const data = Immutable.fromJS(listData);

        state = state.set('listData', data);
        return state;
    },
    [types.SET_CURENT_PAGE](state, { page }) {

        state = state.set('currentPage', page);

        return state;
    },
    [types.SET_PAGE_LIMIT](state, { limit }) {

        state = state.set('pageLimit', limit);

        return state;
    },
    [types.SET_SEARCH](state, { word }) {

        state = state.set('searchValue', word);

        return state;
    },
    [types.SET_SHOW_GRID](state, { value }) {

        state = state.set('showGird', value);

        return state;
    },
    [types.SET_EDIT_ROW](state, { editID, focusIndex }) {

       state = state.set('editID', editID);
       state = state.set('focusIndex', focusIndex);

       return state;
    },
    [types.SET_INLINE_FORM](state, { value }) {

        state = state.set('showInlineForm', value);

        return state;
    },




});
