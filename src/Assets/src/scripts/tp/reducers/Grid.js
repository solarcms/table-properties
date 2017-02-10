import createReducer from '../createStore/createReducer';

import Immutable, {fromJS} from 'immutable';

import * as types from '../constants/grid';

const initialState = {
    setup: {},
    listData:[],
    form_input_control:{},
    grid_extra_data:{},
    currentPage:1,
    pageLimit:500,
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
    translateFormControls:{},
    button_texts:{},
    defaultLocale:null,
    edit_delete_column_title:'Засах',
    showAdvenced:false,
    gridTop:83,
    gridTopWithAdvenced:145,
    order:{
        column:null,
        sortOrder: null
    },
    advancedSearch:{},
    hideMainOrder:false
};

export default createReducer(initialState, {
    [types.SETUP](state, { setupData }) {

        const data = fromJS(setupData);
        const order = fromJS(setupData.order);

        const advancedSearch = fromJS(setupData.advancedSearch);
        const columnSummary = fromJS(setupData.columnSummary);
        const grid_extra_data = fromJS(setupData.grid_extra_data);

        state = state.set('setup', data);
        state = state.set('order', order);
        state = state.set('advancedSearch', advancedSearch);
        state = state.set('grid_extra_data', grid_extra_data);
        state = state.set('columnSummary', columnSummary);
        state = state.set('defaultLocale', setupData.default_locale);

        state = state.set('pageLimit', setupData.pageLimit);

        state = state.set('gridTop', setupData.gridTop);
        state = state.set('gridTopWithAdvenced', setupData.gridTopWithAdvenced);
        state = state.set('hideMainOrder', setupData.hideMainOrder);
        state = state.set('showAdvenced', setupData.showAdvancedSearch);

        state = state.set('button_texts', setupData.button_texts);
        state = state.set('edit_delete_column_title', setupData.edit_delete_column_title);


        return state;
    },
    [types.SET_SHOW_HIDE_COLUMN](state, { value, index }) {

        state = state.setIn(['setup', 'grid_output_control', index, 'hidden'], value);

        return state;
    },
    [types.SET_LOCALE](state, { locale }) {



        state = state.set('defaultLocale', locale);
        return state;
    },
    [types.SET_LIST](state, { listData }) {

        const data = fromJS(listData);

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
    [types.DYNAMIC_ACTION](state, { index, value }) {

        state = state.setIn(index, value);

        return state;
    },
    [types.SET_SHOW_GRID](state, { value }) {

        state = state.set('showGird', value);

        return state;
    },
    [types.SHOW_ADVENCED](state, { value }) {

        state = state.set('showAdvenced', value);

        return state;
    },
    [types.SET_ORDER](state, { column,  sortOrder}) {

        state = state.setIn(['order', 'column'], column);
        state = state.setIn(['order', 'sortOrder'], sortOrder);

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
