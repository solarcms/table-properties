import React from 'react';
import ReactDOM from 'react-dom';
import App from './router';
import createStore from './lib/createStore';
import { Provider } from 'react-redux';
const store = createStore();

import { getSetupData } from './actions/grid'

//call page setup datas
store.dispatch(getSetupData());



ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('solar-tp')
);





