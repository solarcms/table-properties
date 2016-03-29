import React, { Component, PropTypes } from 'react'

export default class Main extends Component {
    render() {
        return (
            <div className="solar-grid">
                { this.props.children }
            </div>
        )

    }
}

