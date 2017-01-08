import createReducer from '../createStore/createReducer';

import Immutable, {fromJS} from 'immutable/';
import * as types from '../constants/subItems';

const initialState = {
    subItemsInit: [],
    subItems: [],
    items:[],
    editIndex: -1
};

export default createReducer(initialState, {

    [types.SET_SUB_ITEMS](state, { data }) {


       const subitems = fromJS(data);

        state = state.set('subItems', subitems);
        state = state.set('subItemsInit', subitems);

        return state;

    },

    [types.CLEAR_SUB_ITEMS](state, { }) {


        state = state.updateIn(['subItems'], (subItems) =>{
            return subItems.map((subItem) => {
                let emptyArray = fromJS([]);
                return (subItem.set('items', emptyArray));
            })

        })

        return state;

    },
    [types.SUB_ITEMS_CHANGE_VALUE](state, { column, CAIndex, index, value }) {

        let dataIndex = [];
        index.map((key)=>dataIndex.push(key))


        dataIndex.unshift('form_input_control')

        dataIndex.unshift(CAIndex)

        dataIndex.unshift('subItems')

        dataIndex.push('value')

        state = state.setIn(dataIndex, value);


        return state;
    },
    [types.SUB_ITEMS_SET_ERROR](state, { column, CAIndex, index, error }) {

        let dataIndex = [];
        index.map((key)=>dataIndex.push(key))


        dataIndex.unshift('form_input_control')

        dataIndex.unshift(CAIndex)

        dataIndex.unshift('subItems')

        dataIndex.push('error')

        state = state.setIn(dataIndex, error);


        return state;
    },
    [types.SUB_ITEMS_CLEAR_FORM_VALIDATION](state, {CAIndex}) {

       let initSubItems = state.get('subItemsInit');

        initSubItems.map((initSubItem, subIndex)=>{

            state = state.setIn(['subItems', subIndex, 'form_input_control'], initSubItem.get('form_input_control'))

        })

        state = state.set('editIndex', -1);
        return state;
    },
    [types.SUB_ITEMS_ADD_ITEM](state, {Sindex, item}){



        const subitem = fromJS(item);

        state = state.updateIn(['subItems', Sindex, 'items'], (items)=>
                items.push(subitem)
        );

        return state;

    },
    [types.SUB_ITEMS_EDIT_ITEM](state, {Sindex, formControl, editIndex}){

        const EditformControl = fromJS(formControl);

        state = state.setIn(['subItems', Sindex, 'form_input_control'], EditformControl);
        state = state.set('editIndex', editIndex);

        return state;

    },
    [types.SUB_ITEMS_UPDATE_ITEM](state, {Sindex, Iindex, item}){

        //const updatedItem = Immutable.fromJS(item);

        state = state.setIn(['subItems', Sindex, 'items', Iindex, 'data'], item);
        state = state.set('editIndex', -1);

        return state;

    },
    [types.SUB_ITEMS_DELETE_ITEM](state, {Sindex, Iindex}){

        state = state.deleteIn(['subItems', Sindex, 'items', Iindex]);
        state = state.set('editIndex', -1);

        return state;

    },

});


