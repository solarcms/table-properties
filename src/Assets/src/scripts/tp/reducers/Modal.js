import createReducer from '../createStore/createReducer';

import Immutable, {fromJS} from 'immutable';

import * as types from '../constants/modal';

const initialState = {
    modals: []
};

export default createReducer(initialState, {
    [types.ADD_MODAL](state, { column }) {


        const modalNew = fromJS({
            name: column,
            show: false
        });

        const modals = state.get('modals').toJS();
        let found = false;
        modals.map((modal)=>{

            if(modal.name == column)
                found = true
        })


        if(found === false)
        state = state.update('modals', (modals) =>
                modals.push(modalNew)
        );

        return state;

    },
    [types.SET_MODAL](state, { column, value }) {


        //find index example
        const indexOfModal = state.get('modals').findIndex(modal => modal.get('name') === column);

        state = state.setIn(['modals', indexOfModal, 'show'], value);

        return state;

    },

});


