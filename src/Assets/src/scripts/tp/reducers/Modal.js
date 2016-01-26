import createReducer from '../lib/createReducer';

import Immutable from 'immutable';

import { SET_MODAL, ADD_MODAL} from '../constants/';

const initialState = {
    modals: []
};

export default createReducer(initialState, {
    [ADD_MODAL](state, { column }) {


        const modalNew = Immutable.fromJS({
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
    [SET_MODAL](state, { column, value }) {


        //find index example
        const indexOfModal = state.get('modals').findIndex(modal => modal.get('name') === column);

        state = state.setIn(['modals', indexOfModal, 'show'], value);

        return state;

    },

});


