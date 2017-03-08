import createReducer from '../createStore/createReducer';

import Immutable, {fromJS} from 'immutable';

import * as types from '../constants/form';

const initialState = {
    setup: {},
    form_input_control:{},
    translateFormControls:{},
    multi_items_form_input_control:{},
    multi_items_columnSummary:{},
    save_first_id_column:null,
    identity_name:null,
    formClassName:null,
    fieldClassName:null,
    formData:{},
    listData:[],
    showAddEditForm:false,
    showInsertResponse:false,
    after_save_redirect_url:'',
    after_save_redirect:false,
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
        const translateFormControls_im = fromJS(translateFormControls);
        const form_input_control = fromJS(setupData.form_input_control);
        const setUp = fromJS(setupData);

        const multi_items_form_input_control = fromJS(setupData.multi_items_form_input_control)
        const multi_items_columnSummary = fromJS(setupData.multi_items_columnSummary)

        state = state.set('multi_items_form_input_control', multi_items_form_input_control);
        state = state.set('multi_items_columnSummary', multi_items_columnSummary);
        state = state.set('translateFormControls', translateFormControls_im);
        state = state.set('setup', setUp);
        state = state.set('form_input_control', form_input_control);
        state = state.set('save_first_id_column', setupData.save_first_id_column);
        state = state.set('identity_name', setupData.identity_name);
        state = state.set('show_saved_alert', setupData.show_saved_alert);
        state = state.set('save_alert_word', setupData.save_alert_word);
        state = state.set('showInsertResponse', setupData.show_insert_response);
        state = state.set('formClassName', setupData.formClassName);
        state = state.set('fieldClassName', setupData.fieldClassName);
        state = state.set('after_save_reload_page', setupData.after_save_reload_page);
        state = state.set('after_save_redirect_url', setupData.after_save_redirect_url);
        state = state.set('after_save_redirect', setupData.after_save_redirect);

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
    [types.CHANGE_STATUS](state, { index, status }) {
        let dataIndex = [];
        index.map((key)=>dataIndex.push(key))
        dataIndex.unshift('form_input_control')
        dataIndex.push('disabled')



        state = state.setIn(dataIndex, status);


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

        const formData = fromJS(data);

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


        const translateFormControls_im = fromJS(translateFormControls);
        state = state.set('translateFormControls', translateFormControls_im);


        return state;
    },
    [types.CHANGE_FORM_DATA](state, { column, data }) {

        const formData = fromJS(data);


        state = state.setIn(['formData', column, 'data', 'data'], formData);

        return state;
    },
    [types.SET_LIST](state, { listData }) {

        const data = fromJS(listData);

        state = state.set('listData', data);
        return state;
    },
});
