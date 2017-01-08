import createReducer from '../createStore/createReducer';

import Immutable, {fromJS} from 'immutable';

import * as types from '../constants/comboBoxAddAble';

const initialState = {
    comboBoxs: [],
    translateFormControls: {},
};

export default createReducer(initialState, {

    [types.ADD_COMBO_ADD_ABLE](state, { column, data }) {

        const comboNew = fromJS(data);

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
    [types.COMBO_ADD_CHANGE_VALUE](state, { column, CAIndex, index, value }) {

        let dataIndex = [];
        index.map((key)=>dataIndex.push(key))


        dataIndex.unshift('form_input_control')

        dataIndex.unshift(CAIndex)

        dataIndex.unshift('comboBoxs')

        dataIndex.push('value')

        state = state.setIn(dataIndex, value);

        return state;
    },
    [types.COMBO_SET_ERROR](state, { column, CAIndex, index, error }) {



        let dataIndex = [];
        index.map((key)=>dataIndex.push(key))

        dataIndex.unshift('form_input_control')

        dataIndex.unshift(CAIndex)

        dataIndex.unshift('comboBoxs')

        dataIndex.push('error')



        state = state.setIn(dataIndex, error);


        return state;
    },
    [types.COMBO_CLEAR_FORM_VALIDATION](state, {CAIndex}) {

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


