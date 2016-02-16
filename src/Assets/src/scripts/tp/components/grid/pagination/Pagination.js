import React, {Component, PropTypes} from "react";
import pagiator from "paginator";
import classNames from "classnames";
import Page from "./Page";

const lt = <i className="material-icons">&#xE5CB;</i>;
const Lt = "«";
const gt = <i className="material-icons">&#xE5CC;</i>;
const Gt = "»";

const prevPageText = lt;
const firstPageText = Lt;

const nextPageText = gt;
const lastPageText = Gt;

export default class Pagination extends Component {
    constructor(props) {
        super();
    }

    onClick(page, e) {
        e.preventDefault();
        this.props.onChange(page);
    }

    buildPages() {
        let pages = [];

        let {
            itemsCountPerPage = 10,
            pageRangeDisplayed = 5,
            activePage = 1, 
            prevPageText = lt,
            nextPageText = gt,
            firstPageText = Lt,
            lastPageText = Gt,
            totalItemsCount
        } = this.props;

        let paginationInfo = new pagiator(itemsCountPerPage, pageRangeDisplayed).build(totalItemsCount, activePage);

        if (paginationInfo.first_page !== paginationInfo.last_page) {
            for(let i = paginationInfo.first_page; i <= paginationInfo.last_page; i++) {
                pages.push(
                    <Page 
                        isActive={i === activePage} 
                        key={i} 
                        pageNumber={i} 
                        onClick={this.onClick.bind(this)} 
                    />
                );
            }
        }

        paginationInfo.has_previous_page && pages.unshift(
            <Page 
                isActive={false} 
                key={"prev" + paginationInfo.previous_page} 
                pageNumber={paginationInfo.previous_page} 
                onClick={this.onClick.bind(this)}
                pageText={prevPageText}
            />
        );

        paginationInfo.first_page > 1 && pages.unshift(
            <Page 
                isActive={false}
                key={1} 
                pageNumber={1} 
                onClick={this.onClick.bind(this)}
                pageText={firstPageText}
            />
        );

        paginationInfo.has_next_page && pages.push(
            <Page 
                isActive={false}
                key={"next" + paginationInfo.next_page} 
                pageNumber={paginationInfo.next_page} 
                onClick={this.onClick.bind(this)}
                pageText={nextPageText}
            />
        );

        paginationInfo.last_page !== paginationInfo.total_pages && pages.push(
            <Page 
                isActive={false}
                key={paginationInfo.total_pages} 
                pageNumber={paginationInfo.total_pages} 
                onClick={this.onClick.bind(this)}
                pageText={lastPageText}
            />
        );

        return pages;
    }

    render() {
        let pages = this.buildPages();

        return (
            <ul className="pagination pagination-sm">{pages}</ul>
        );
    }
};

Pagination.propTypes = {
    totalItemsCount: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    activePage: PropTypes.number,
    pageRangeDisplayed: PropTypes.number,
    itemsCountPerPage: PropTypes.number,
    prevPageText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]),
    nextPageText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]),
    lastPageText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]),
    firstPageText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ])
}