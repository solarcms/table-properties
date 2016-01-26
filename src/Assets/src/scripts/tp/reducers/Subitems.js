import createReducer from '../lib/createReducer';

import Immutable from 'immutable';

import {
    SET_SUB_ITEMS,
    SUB_ITEMS_CHANGE_VALUE,
    SUB_ITEMS_SET_ERROR,
    SUB_ITEMS_CLEAR_FORM_VALIDATION,
    SUB_ITEMS_ADD_ITEM,
    SUB_ITEMS_EDIT_ITEM,
    SUB_ITEMS_UPDATE_ITEM,
    SUB_ITEMS_DELETE_ITEM,
    CLEAR_SUB_ITEMS
} from '../constants/';

const initialState = {
    subItems: [],
    items:[],
    editIndex: -1
};

export default createReducer(initialState, {

    [SET_SUB_ITEMS](state, { data }) {


       const subitems = Immutable.fromJS(data);

        state = state.set('subItems', subitems);

        return state;

    },

    [CLEAR_SUB_ITEMS](state, { }) {


        state = state.updateIn(['subItems'], (subItems) =>{
            return subItems.map((subItem) => {
                let emptyArray = Immutable.fromJS([]);
                return (subItem.set('items', emptyArray));
            })

        })

        return state;

    },
    [SUB_ITEMS_CHANGE_VALUE](state, { column, CAIndex, index, value }) {

        state = state.setIn(['subItems', CAIndex, 'form_input_control', index, 'value'], value);


        return state;
    },
    [SUB_ITEMS_SET_ERROR](state, { column, CAIndex, index, error }) {

        state = state.setIn(['subItems', CAIndex, 'form_input_control', index, 'error'], error);


        return state;
    },
    [SUB_ITEMS_CLEAR_FORM_VALIDATION](state, {CAIndex}) {

        state = state.updateIn(['subItems', CAIndex, 'form_input_control'], (formControl) =>{
            return formControl.map((input) => {
                return (input.set('error', null));
            })

        })


        state = state.updateIn(['subItems', CAIndex, 'form_input_control'], (formControl) =>{
            return formControl.map((input) => {
                const type = input.get('type')
                if(type == '--checkbox')
                    return (input.set('value', false))
                else
                    return (input.set('value', null))
            })

        })
        state = state.set('editIndex', -1);
        return state;
    },
    [SUB_ITEMS_ADD_ITEM](state, {Sindex, item}){

        const subitem = Immutable.fromJS(item);

        state = state.updateIn(['subItems', Sindex, 'items'], (items)=>
                items.push(subitem)
        );

        return state;

    },
    [SUB_ITEMS_EDIT_ITEM](state, {Sindex, formControl, editIndex}){

        const EditformControl = Immutable.fromJS(formControl);

        state = state.setIn(['subItems', Sindex, 'form_input_control'], EditformControl);
        state = state.set('editIndex', editIndex);

        return state;

    },
    [SUB_ITEMS_UPDATE_ITEM](state, {Sindex, Iindex, item}){

        const updatedItem = Immutable.fromJS(item);

        state = state.setIn(['subItems', Sindex, 'items', Iindex, 'data'], updatedItem);
        state = state.set('editIndex', -1);

        return state;

    },
    [SUB_ITEMS_DELETE_ITEM](state, {Sindex, Iindex}){

        state = state.deleteIn(['subItems', Sindex, 'items', Iindex]);
        state = state.set('editIndex', -1);

        return state;

    },

});


