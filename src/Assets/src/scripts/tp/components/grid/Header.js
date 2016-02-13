import React, { Component, PropTypes }  from 'react';

export default class Header extends Component {

    changeLanguage(id){
        this.props.changeLanguage(id)
    }


    render() {
        let addButton = "";
        if(this.props.permission.c == true){
            if(this.props.formType == 'inline')
                addButton = <a href="javascript:void(0)" className="nav-link" onClick={this.props.addInlineForm}>
                    <i className="material-icons">&#xE145;</i>
                    Нэмэх
                </a>
            else if(this.props.formType == 'window')
                addButton = <a className="nav-link" href="javascript:void(0)" onClick={this.props.showModal}>
                    <i className="material-icons">&#xE145;</i>
                    Нэмэх
                </a>
            else
                addButton = <a href={this.props.link} className="nav-link"><i className="material-icons">&#xE145;</i> Нэмэх</a>
        }


        let actionControls = this.props.type == 'list'?
            <ul className="nav navbar-nav pull-right hidden-md-down">
                <li className="nav-item dropdown">
                    <a className="nav-link p-l b-l" href="javascript:void(0)" data-toggle="dropdown">

                        <i className="material-icons">&#xE2C6;</i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-scale pull-right text-color"
                         role="menu">
                        <a className="dropdown-item" onClick={this.props.exportPDF}>
                            <i className="material-icons">&#xE415;</i>
                            &nbsp;&nbsp;PDF
                        </a>
                        <a className="dropdown-item" onClick={this.props.exportEXCEL}>
                            <i className="material-icons">&#xE3EC;</i>
                            &nbsp;&nbsp;Excel
                        </a>
                        <a className="dropdown-item" href="">
                            <i className="material-icons">&#xE8AD;</i>
                            &nbsp;&nbsp;Print
                        </a>
                    </div>
                </li>
                <li className="nav-item">
                    <a className="nav-link" onClick={this.props.handlerReload}>

                        <i className="material-icons">&#xE5D5;</i>
                    </a>
                </li>

                <li className="nav-item dropdown">
                    <a className="nav-link p-l b-l" href="" data-toggle="dropdown">
                        <i className="material-icons">&#xE8B8;</i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-scale pull-right text-color"
                         role="menu">
                        <a className="dropdown-item" href="javascript:void(0)">Тохиргоо</a>

                        {this.props.locales.map((locale)=>
                            <a className="dropdown-item" href="javascript:void(0)" key={locale.code} onClick={this.changeLanguage.bind(this, locale.code)}>
                                <i className="material-icons">&#xE894;</i> {locale.code}
                            </a>
                        )}

                    </div>
                </li>
            </ul>
            :
            null
        let searchBar = this.props.type == 'list' || this.props.type == 'comboGrid'
            ?
            <div className="collapse navbar-toggleable-sm hidden-sm-down" id="navbar-3">
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

                                    <i className="material-icons">&#xE8B6;</i>

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
                        <ul className="nav navbar-nav pull-left hidden-lg-up">
                            <li className="nav-item">
                                <a data-toggle="modal" data-target="#aside" className="nav-link p-r b-r">
                                    <i className="material-icons">menu</i>
                                </a>
                            </li>
                        </ul>

                        <div className="navbar-item pull-left h6 p-l" id="pageTitle" >{this.props.pageName}</div>

                        {actionControls}
                        {searchBar}
                    </div>
                </div>
            </div>
        )
    }
}
Header.defaultProps = {
    permission:{c:false, r:false, u:false, d:false}

}
