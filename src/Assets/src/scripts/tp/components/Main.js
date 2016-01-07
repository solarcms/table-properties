import React, { Component, PropTypes }  from 'react';
import ReactDOM from 'react-dom';
//import Home from './Home';

export default ( props ) => {
    return (
        <div className="solar-grid">
            { props.children }
        </div>
    )

}

