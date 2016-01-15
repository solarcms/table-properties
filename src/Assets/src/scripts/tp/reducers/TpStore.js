import createReducer from '../lib/createReducer';

import Immutable from 'immutable';

import * as types from '../constants/';

const initialState = {
    setup: {},
    listData:{},
    currentPage:1,
    pageLimit:50,
    formData:{},
    editID:0,
    focusIndex:0,
    showInlineForm: false,
    grid:{
        width: 1000,
        height:600
    }
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
    [types.CHANGE_VALUE](state, { index, value }) {

        //find index example
        //const indexOfColumn = state.getIn(['setup', 'form_input_control']).findIndex(form => form.get('column') === column);

        //state = state.updateIn(['setup', 'form_input_control', index, 'value'], ()=>{
        //    return value
        //});

        state = state.setIn(['setup', 'form_input_control', index, 'value'], value);


        return state;
    },
    [types.SET_ERROR](state, { index, error }) {

       // const indexOfColumn = state.getIn(['setup', 'form_input_control']).findIndex(form => form.get('column') === column);
       state = state.setIn(['setup', 'form_input_control', index, 'error'], error);

       return state;
    },
    [types.SET_EDIT_ROW](state, { editID, focusIndex }) {

       state = state.set('editID', editID);
       state = state.set('focusIndex', focusIndex);

       return state;
    },
    [types.SET_GRID_SIZE](state, { width, height }) {

       state = state.setIn(['grid', 'width'], width);
       state = state.setIn(['grid', 'height'], height);


       return state;
    },
    [types.SET_FORM_DATA](state, { data }) {

        const formData = Immutable.fromJS(data);

       state = state.set('formData', formData);

       return state;
    },
    [types.SET_INLINE_FORM](state, { value }) {

       state = state.set('showInlineForm', value);

       return state;
    },
    [types.CLEAR_FORM_VALIDATION](state, {}) {

        state = state.updateIn(['setup', 'form_input_control'], (formControl) =>{
                return formControl.map((input) => {
                    return (input.set('error', null));
                })

        })

        state = state.updateIn(['setup', 'form_input_control'], (formControl) =>{
                return formControl.map((input) => {
                    const type = input.get('type')
                    if(type == '--checkbox')
                        return (input.set('value', false))
                    else
                        return (input.set('value', null))
                })

        })
        return state;
    },



});
