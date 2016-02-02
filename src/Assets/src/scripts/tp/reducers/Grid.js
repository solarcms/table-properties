import createReducer from '../lib/createReducer';

import Immutable from 'immutable';

import * as types from '../constants/';

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
    focusIndex:0,
    showInlineForm: false,
    comboGrid:{
        currentPage:1,
    },
    comboBoxAddAble: {},
    translateFormControls:{}
};

export default createReducer(initialState, {
    [types.SETUP](state, { setupData }) {

        const data = Immutable.fromJS(setupData);

        state = state.set('setup', data);

        state = state.set('pageLimit', setupData.pageLimit);

        const translate_form_input_control = setupData.translate_form_input_control;
        const locales = setupData.locales;

        const translateFormControls = [];
        locales.map((locale)=>{

            translateFormControls.push(
                {
                    locale_id: locale.id,
                    locale_code: locale.code,
                    translate_form_input_control: translate_form_input_control
                }
            )

        });
        const translateFormControls_im = Immutable.fromJS(translateFormControls);
        const form_input_control = Immutable.fromJS(setupData.form_input_control);

        state = state.set('translateFormControls', translateFormControls_im);
        state = state.set('form_input_control', form_input_control);

        return state;
    },
    [types.SET_LIST](state, { listData }) {

        const data = Immutable.fromJS(listData);

        state = state.set('listData', data);
        return state;
    },
    [types.SET_CURENT_PAGE](state, { page }) {

        state = state.set('currentPage', page);

        return state;
    },
    [types.SET_PAGE_LIMIT](state, { limit }) {

        state = state.set('pageLimit', limit);

        return state;
    },
    [types.SET_SEARCH](state, { word }) {

        state = state.set('searchValue', word);

        return state;
    },
    [types.SET_SHOW_ADD_EDIT_FORM](state, { value }) {

        state = state.set('showAddEditForm', value);

        return state;
    },
    [types.SET_SHOW_GRID](state, { value }) {

        state = state.set('showGird', value);

        return state;
    },
    [types.SET_ERROR](state, { index, error }) {
        let dataIndex = [];
        index.map((key)=>dataIndex.push(key))
        dataIndex.unshift('form_input_control')
        dataIndex.push('error')

        state = state.setIn(dataIndex, error);

        return state;
    },
    [types.CHANGE_VALUE](state, { index, value }) {
        let dataIndex = [];
        index.map((key)=>dataIndex.push(key))
        dataIndex.unshift('form_input_control')
        dataIndex.push('value')

        state = state.setIn(dataIndex, value);


        return state;
    },
    [types.CLEAR_FORM_VALIDATION](state, {}) {

        state = state.updateIn(['form_input_control'], (formControl) =>{
            return formControl.map((input) => {
                return (input.set('error', null));
            })

        })


        state = state.updateIn(['form_input_control'], (formControl) =>{
            return formControl.map((input) => {
                const type = input.get('type')
                const value = input.get('value')
                if(type == '--hidden'){
                    return (input.set('value', value))
                } else {
                    if(type == '--checkbox')
                        return (input.set('value', false))
                    else
                        return (input.set('value', null))

                }

            })

        })
        return state;
    },


    [types.SET_EDIT_ROW](state, { editID, focusIndex }) {

       state = state.set('editID', editID);
       state = state.set('focusIndex', focusIndex);

       return state;
    },
    [types.SET_FORM_DATA](state, { data }) {

        const formData = Immutable.fromJS(data);

       state = state.set('formData', formData);

       return state;
    },

    [types.SET_INLINE_FORM](state, { value }) {

       state = state.set('showInlineForm', value);

       return state;
    },



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
    ////////// tanslation

    [types.CHANGE_TRANSLATION_VALUE](state, { locale_index, index, value }) {


        let dataIndex = [];
        index.map((key)=>dataIndex.push(key))
        dataIndex.unshift('translate_form_input_control')
        dataIndex.unshift(locale_index)
        dataIndex.unshift('translateFormControls')
        dataIndex.push('value')

        state = state.setIn(dataIndex, value);

        return state;
    },
    [types.SET_TRANSLATION_ERROR](state, { locale_index, index, error }) {

        let dataIndex = [];
        index.map((key)=>dataIndex.push(key))
        dataIndex.unshift('translate_form_input_control')
        dataIndex.unshift(locale_index)
        dataIndex.unshift('translateFormControls')
        dataIndex.push('error')

        state = state.setIn(dataIndex, error);

        return state;
    },
    [types.CLEAR_TRANSLATION_FORM_VALIDATION](state, {}) {

        state = state.updateIn(['translateFormControls'], (translateFormControls) =>{

            return translateFormControls.map((translateFormControl) => {
                return translateFormControl.updateIn(['translate_form_input_control'], (translate_form_input_control)=>{
                    return translate_form_input_control.map((input) => {
                        return (input.set('error', null));
                    })
                })
            })
        })


        state = state.updateIn(['translateFormControls'], (translateFormControls) =>{

            return translateFormControls.map((translateFormControl) => {
                return translateFormControl.updateIn(['translate_form_input_control'], (translate_form_input_control)=>{
                    return translate_form_input_control.map((input) => {
                        const type = input.get('type')
                        const value = input.get('value')
                        if(type == '--hidden'){
                            return (input.set('value', value))
                        } else {
                            if(type == '--checkbox')
                                return (input.set('value', false))
                            else
                                return (input.set('value', null))

                        }
                    })
                })
            })
        })





        return state;
    },

});
