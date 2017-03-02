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


        let subItems = [];

        data.map(subItem=>{
            const translate_form_input_control = subItem.translate_form_input_control;



            let translateFormControls = [];
            subItem.locales.map((locale)=>{

                translateFormControls.push(
                    {
                        locale_id: locale.id,
                        locale_code: locale.code,
                        translate_form_input_control: translate_form_input_control
                    }
                )

            });
            subItem.translateFormControls = translateFormControls;
            subItem.translateFormControlsInit = translateFormControls;



            subItems.push(subItem);
        })






       const subitemsIM = fromJS(subItems);

        state = state.set('subItems', subitemsIM);
        state = state.set('subItemsInit', subitemsIM);

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
    [types.SUB_ITEMS_CHANGE_TRANSLATION_VALUE](state, { column, CAIndex, locale_index, index, value }) {


        let dataIndex = [];
        index.map((key)=>dataIndex.push(key))
        dataIndex.unshift('translate_form_input_control')

        dataIndex.unshift(locale_index)
        dataIndex.unshift('translateFormControls')
        dataIndex.unshift(CAIndex)
        dataIndex.unshift('subItems')
        dataIndex.push('value')



        state = state.setIn(dataIndex, value);

        return state;
    },
    [types.SUB_ITEMS_SET_TRANSLATION_ERROR](state, { column, CAIndex, locale_index, index, error }) {

        let dataIndex = [];
        index.map((key)=>dataIndex.push(key))
        dataIndex.unshift('translate_form_input_control')

        dataIndex.unshift(locale_index)
        dataIndex.unshift('translateFormControls')
        dataIndex.unshift(CAIndex)
        dataIndex.unshift('subItems')
        dataIndex.push('error')

        state = state.setIn(dataIndex, error);

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
            state = state.setIn(['subItems', subIndex, 'translateFormControls'], initSubItem.get('translateFormControlsInit'))

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
    [types.SUB_ITEMS_EDIT_ITEM](state, {Sindex, formControl, editIndex, translateFormControls}){

        const EditformControl = fromJS(formControl);
        const EditTranslateFormControls = fromJS(translateFormControls);

        state = state.setIn(['subItems', Sindex, 'form_input_control'], EditformControl);
        state = state.setIn(['subItems', Sindex, 'translateFormControls'], EditTranslateFormControls);
        state = state.set('editIndex', editIndex);

        return state;

    },
    [types.SUB_ITEMS_UPDATE_ITEM](state, {Sindex, Iindex, item, translateFormControls}){

        //const updatedItem = Immutable.fromJS(item);

        state = state.setIn(['subItems', Sindex, 'items', Iindex, 'data'], item);
        state = state.setIn(['subItems', Sindex, 'items', Iindex, 'translateFormControls'], translateFormControls);

        state = state.set('editIndex', -1);

        return state;

    },
    [types.SUB_ITEMS_DELETE_ITEM](state, {Sindex, Iindex}){

        state = state.deleteIn(['subItems', Sindex, 'items', Iindex]);
        state = state.set('editIndex', -1);

        return state;

    },

});


