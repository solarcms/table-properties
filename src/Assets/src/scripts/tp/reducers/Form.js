import createReducer from '../lib/createReducer';

import Immutable from 'immutable';

import * as types from '../constants/form';

const initialState = {
    setup: {},
    form_input_control:{},
    translateFormControls:{},
    formData:{},
    showAddEditForm:false,
    focusIndex:0,

};

export default createReducer(initialState, {
    [types.FORM_SETUP](state, { setupData }) {

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
        const setUp = Immutable.fromJS(setupData);

        state = state.set('translateFormControls', translateFormControls_im);
        state = state.set('setup', setUp);
        state = state.set('form_input_control', form_input_control);

        return state;
    },



    [types.SET_SHOW_ADD_EDIT_FORM](state, { value }) {

        state = state.set('showAddEditForm', value);

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
    [types.SET_ERROR](state, { index, error }) {
        let dataIndex = [];
        index.map((key)=>dataIndex.push(key))
        dataIndex.unshift('form_input_control')
        dataIndex.push('error')

        state = state.setIn(dataIndex, error);

        return state;
    },

    [types.CLEAR_FORM_VALIDATION](state, {}) {

        const form_input_control = state.getIn(['setup', 'form_input_control'])

        state = state.set('form_input_control', form_input_control);

        return state;
    },

    [types.SET_FORM_DATA](state, { data }) {

        const formData = Immutable.fromJS(data);

        state = state.set('formData', formData);

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

        const translate_form_input_control = state.getIn(['setup', 'translate_form_input_control']).toJS()
        const locales = state.getIn(['setup', 'locales']).toJS();

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
        state = state.set('translateFormControls', translateFormControls_im);


        return state;
    },
    [types.CHANGE_FORM_DATA](state, { column, data }) {

        const formData = Immutable.fromJS(data);


        state = state.setIn(['formData', column, 'data', 'data'], formData);

        return state;
    },

});
