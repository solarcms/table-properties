import createReducer from '../lib/createReducer';

import Immutable from 'immutable';

import { ADD_COMBO_ADD_ABLE, COMBO_ADD_CHANGE_VALUE, COMBO_SET_ERROR, COMBO_CLEAR_FORM_VALIDATION} from '../constants/';

const initialState = {
    comboBoxs: [],
};

export default createReducer(initialState, {

    [ADD_COMBO_ADD_ABLE](state, { column, data }) {

        const comboNew = Immutable.fromJS(data);

        const comboBoxs = state.get('comboBoxs').toJS();
        let found = false;
        comboBoxs.map((comboBox)=>{

            if(comboBox.column == column)
                found = true
        })


        if(found === false)
            state = state.update('comboBoxs', (comboBoxs) =>
                comboBoxs.push(comboNew)
            );

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
    [COMBO_CLEAR_FORM_VALIDATION](state, {CAIndex}) {

        state = state.updateIn(['comboBoxs', CAIndex, 'form_input_control'], (formControl) =>{
            return formControl.map((input) => {
                return (input.set('error', null));
            })

        })


        state = state.updateIn(['comboBoxs', CAIndex, 'form_input_control'], (formControl) =>{
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


