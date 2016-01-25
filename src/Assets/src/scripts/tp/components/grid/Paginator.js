import React, { Component, PropTypes }  from 'react';

import Pagination from "./pagination/Pagination";
import ComboBox from "../form/elements/ComboBox";

export default class Paginator extends Component {


    render() {
        const { totalItems, totalPages, pageLimits, handler, currentPage, pageLimit, handlerPage, paginationMarg } = this.props;

        return (
            <div className={`p-a-sm white  with-3d-shadow ${paginationMarg}`}>
                <div className="row">
                    <div className="col-md-12 solar-pagination" >
                        <div className="pull-left ">
                            <div style={{display: 'inline-block'}}>
                                Нийт: <b>{totalItems}</b>.
                                Нийт хуудас: <b> {totalPages}</b>.
                            </div>
                            <div style={{display: 'inline-block', marginLeft:'10px'}} className="hidden-md-down page-limit">
                                <ComboBox
                                    comboClass="form-control pull-right form-control-sm"
                                    changeHandler={ handler }
                                    selected={pageLimit}
                                    datas={pageLimits}
                                    label="Хуудсанд харагдах тоо"
                                    style={{width:'80px'}}
                                />
                            </div>
                        </div>

                        <div className="pull-right" style={{height: '32px'}}>
                            <Pagination
                                activePage={currentPage}
                                totalItemsCount={totalItems}
                                itemsCountPerPage={pageLimit}
                                onChange={ handlerPage }

                            />
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
Paginator.defaultProps = {
    pageLimits: [
        {value: 10, text: 10},
        {value: 20, text: 20},
        {value: 50, text: 50},
        {value: 100, text: 100},
        {value: 500, text: 500},
        {value: 1000, text: 1000}
    ]
};

Paginator.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    pageLimits: PropTypes.array,
    pageLimit: PropTypes.number.isRequired,
    handler: PropTypes.func,
    handlerPage: PropTypes.func,
};