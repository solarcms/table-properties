import createReducer from '../lib/createReducer';

import Immutable from 'immutable';

import { SET_ADD_MODAL, ADD_COMBO_ADD_ABLE, COMBO_ADD_CHANGE_VALUE, COMBO_SET_ERROR} from '../constants/';

const initialState = {
    comboBoxs: [],
    showAddModal: false
};

export default createReducer(initialState, {
    [SET_ADD_MODAL](state, { value }) {

        state = state.set('showAddModal', value);

        return state;

    },
    [ADD_COMBO_ADD_ABLE](state, { column, data }) {

        const new_combo = Immutable.fromJS(data);

        state = state.set('comboBoxs', new_combo);

        return state;
    },
    [COMBO_ADD_CHANGE_VALUE](state, { column, CAIndex, index, value }) {

        state = state.setIn(['comboBoxs', CAIndex, 'form_input_control', index, 'value'], value);


        return state;
    },
    [COMBO_SET_ERROR](state, { column, CAIndex, index, error }) {

        state = state.setIn(['comboBoxs', CAIndex, 'form_input_control', index, 'error'], error);


        return state;
    },
});


