import createReducer from '../lib/createReducer';

import Immutable from 'immutable';

import { SET_ADD_MODAL } from '../constants/';

const initialState = {
    comboBoxAddAble: {},
    showAddModal: false,
};

export default createReducer(initialState, {
    [SET_ADD_MODAL](state, { value }) {

        state = state.set('showAddModal', value);

        return state;
    },
});
