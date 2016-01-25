import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { history } from 'history';
import { Router, Route, Link, IndexRoute } from 'react-router';
import Main from './components/Main';
import GridContainer from './containers/GridContainer';
import AddEditContainer from './containers/AddEditContainer';

export default () => {
    return (
        <Router>
            <Route path="/" component={ Main }>
                <IndexRoute component={ GridContainer } />
                <Route path="add" component={ AddEditContainer }  />
                <Route path="edit/:id" component={ AddEditContainer }  />
            </Route>
        </Router>
    );
}
