import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/';
import createStore from './lib/createStore';
import { Provider } from 'react-redux';
const store = createStore();
import injectTapEventPlugin from 'react-tap-event-plugin';
import { getSetupData } from './actions/'
// for material ui
injectTapEventPlugin();
//call page setup datas
store.dispatch(getSetupData());


ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('solar-tp')
);





