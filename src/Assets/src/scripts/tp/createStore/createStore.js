// https://github.com/quangbuule/redux-example/blob/redux%40v1.0.0-rc/src/js/lib/createStore.js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from '../reducers';
import createLogger from 'redux-logger';

const logger = createLogger();

export function arrayMiddleware() {
    return next =>
        (action) => {
            if (Array.isArray(action)) {
                action.forEach((item) => next(item));
                return;
            }

            next(action);
        };
}
export default function (initialState) {
    const createStoreWithMiddleware = applyMiddleware(
        arrayMiddleware,
        thunk
        //logger
    )(createStore);

    const reducer = combineReducers(reducers);

    return createStoreWithMiddleware(reducer, initialState);
}
