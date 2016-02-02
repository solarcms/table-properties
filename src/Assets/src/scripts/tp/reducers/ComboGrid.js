import createReducer from '../lib/createReducer';
import Immutable from 'immutable';
import * as types from '../constants/comboGrid';

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
    comboGrid:{
        currentPage:1,
    },

};

export default createReducer(initialState, {
    /*
    * ComboGrid
    * */

    [types.SET_CURENT_PAGE_COMBO_GRID](state, { page }) {

        state = state.setIn(['comboGrid', 'currentPage'], page);

        return state;
    },
    [types.CHANGE_FORM_DATA](state, { column, data }) {

        const formData = Immutable.fromJS(data);

        state = state.setIn(['formData', column, 'data'], formData);

        return state;
    },
    [types.COMBO_GRID_CHANGE_VALUE](state, { column, index, value }) {


        return state;
    },


    [types.COMBO_GRID_SET_ERROR](state, { column, index, error }) {


        state = state.setIn(['form_input_control', column, 'form_input_control', index, 'error'], error);

        return state;
    },
    [types.SET_COMBO_GRID_TEXT](state, { column, text }) {


        state = state.setIn(['formData', column, 'text'], text);

        return state;
    },
    [types.CLEAR_COMBO_GRID_FORM_VALIDATION](state, {column}) {



        state = state.setIn(['formData', column, 'text'], null);

        state = state.updateIn(['formData', column, 'form_input_control'], (formControl) =>{
            return formControl.map((input) => {
                return (input.set('error', null));
            })

        })

        state = state.updateIn(['formData', column, 'form_input_control'], (formControl) =>{
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
    [types.SET_COMBO_BOX_ADD](state, { column, data }) {

        const formData = Immutable.fromJS(data);



        //state = state.set('comboBoxAddAble', formData);


        return state;
    },


});
