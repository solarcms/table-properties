import React, { Component, PropTypes }  from 'react';

export default class Header extends Component {

    render() {
        let addButton = "";

        if(this.props.formType == 'inline')
            addButton = <a href="javascript:void(0)" className="nav-link" onClick={this.props.addInlineForm}><i className="fa fa-plus"></i> Нэмэх</a>
        else if(this.props.formType == 'window')
            addButton = <a className="nav-link" href="javascript:void(0)" onClick={this.props.showModal}><i className="fa fa-plus"></i> Нэмэх</a>
        else
            addButton = <a href={this.props.link} className="nav-link"><i className="fa fa-plus"></i> Нэмэх</a>

        let actionControls = this.props.type == 'list'?
            <ul className="nav navbar-nav pull-right">
                <li className="nav-item dropdown">
                    <a className="nav-link p-l b-l" href="javascript:void(0)" data-toggle="dropdown">
                        <i className="fa fa-upload"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-scale pull-right text-color"
                         role="menu">
                        <a className="dropdown-item" onClick={this.props.exportPDF}><i className="fa fa-file-pdf-o"></i> PDF</a>
                        <a className="dropdown-item" onClick={this.props.exportEXCEL}><i className="fa fa-file-excel-o"></i> Excel</a>
                        <a className="dropdown-item" href=""><i className="fa fa-print"></i> Print</a>
                    </div>
                </li>
                <li className="nav-item">
                    <a className="nav-link" onClick={this.props.handlerReload}>
                        <i className="fa fa-refresh"></i>
                    </a>
                </li>

                <li className="nav-item dropdown">
                    <a className="nav-link p-l b-l" href="" data-toggle="dropdown">
                        <i className="icon-options-vertical icon"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-scale pull-right text-color"
                         role="menu">
                        <a className="dropdown-item" href="">Тохиргоо</a>
                    </div>
                </li>
            </ul>
            :
            null
        let searchBar = this.props.type == 'list' || this.props.type == 'comboGrid'
            ?
            <div className="collapse navbar-toggleable-sm" id="navbar-3">
                <div
                    className="navbar-form form-inline pull-right pull-none-sm navbar-item v-m ng-pristine ng-valid ng-scope"
                    role="search">
                    <div className="form-group l-h m-a-0">
                        <div className="input-group input-group-sm">
                            <input type="text" className="form-control p-x b-a rounded" ref="searchWord"
                                   placeholder="Хайх"/>

                            <span className="input-group-btn">
                                <button type="button" className="btn white b-a rounded no-b-l no-shadow"
                                        onClick={this.props.handlerSearch}>
                                    <i className="fa fa-search"></i>
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
                <ul className="nav navbar-nav">
                    <li className="nav-item dropdown">
                        {addButton}
                    </li>
                </ul>
            </div>
            :
            null
        return (
            <div className="">
                <div className="white box-shadow-z0 b-b">
                    <div className="navbar">

                        <div className="navbar-item pull-left h5 p-l" id="pageTitle">{this.props.pageName}</div>

                        {actionControls}
                        {searchBar}
                    </div>
                </div>
            </div>
        )
    }
}

