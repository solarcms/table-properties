import React, { Component, PropTypes } from 'react'
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import { createHistory } from 'history';
import Main from './components/Main';
import GridContainer from './containers/GridContainer';
import AddEditContainer from './containers/AddEditContainer';

export default class App extends Component {

    render() {
        return (
            <Router history={hashHistory}>
                <Route path="/" component={ Main }>
                    <IndexRoute component={ GridContainer }/>
                    <Route path="add" component={ AddEditContainer }/>
                    <Route path="edit/:id" component={ AddEditContainer }/>
                </Route>
            </Router>
        );
    }
}
