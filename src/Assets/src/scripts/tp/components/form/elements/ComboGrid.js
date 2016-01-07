import React, { Component, PropTypes }  from 'react';
import Body from '../../grid/Body'
export default class ComboGrid extends Component {

    render() {
        const { listData, gridHeader} = this.props;

        return (
            <div className="combo-grid">
                <a className="dropdown-toggle realLarge" data-toggle="dropdown" href  aria-haspopup="true" aria-expanded="true">
                <span>test</span>
                <b></b>
                </a>
                <div className="dropdown-menu">

                    <div >
                        <Body bodyData={listData} bodyHeader={gridHeader}/>
                    </div>
                    <div className="combo-grid-action">

                        <button type="button" className="btn btn-primary btn-block add-button" >add</button>
                    </div>
                </div>
            </div>
        )
    }
}
