import React, { Component, PropTypes }  from 'react';

export default class Header extends Component {

    changeLanguage(id){
        this.props.changeLanguage(id)
    }
    hideShowColumn(index, e){

        this.props.hideShowColumn(e.target.checked, index)
    }


    render() {
        const {
            permission,
            formType
        } = this.props;
        let addButton = "";
        if(permission.c == true){
            if(formType == 'inline')
                addButton = <a href="javascript:void(0)" className="nav-link" onClick={this.props.addInlineForm}>
                    <i className="material-icons green bold">&#xE145;</i>
                    <span className="hidden-xs">
                        {this.props.add_button_text}
                    </span>
                </a>
            else if(formType == 'window')
                addButton = <a className="nav-link" href="javascript:void(0)" onClick={this.props.showModal}>
                    <i className="material-icons green bold" >&#xE145;</i>
                    <span className="hidden-xs">
                        {this.props.add_button_text}
                    </span>

                </a>
            else
                addButton = <a href={this.props.link} className="nav-link"><i className="material-icons green bold" >&#xE145;</i>
                <span className="hidden-xs">
                        {this.props.add_button_text}
                    </span>
                </a>
        }
        let hideshow = this.props.gridHeader.map((header, index)=>
            <li key={index}>
                <label> <input type="checkbox" onChange={this.hideShowColumn.bind(this, index)} /> {header.title}</label>
            </li>
        )

        let actionControls = this.props.type == 'list'?
            <ul className="nav navbar-nav pull-right hidden-sm hidden-xs">
                <li className="nav-item dropdown">
                    <a className="nav-link p-l b-l" href="javascript:void(0)"   onClick={this.props.exportEXCEL}>

                        <i className="material-icons">&#xE2C6;</i>
                    </a>

                </li>
         

                <li className="nav-item dropdown">
                    <a className="nav-link p-l b-l" href="" data-toggle="dropdown">
                        <i className="material-icons">&#xE8B8;</i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-scale pull-right text-color"
                         role="menu" style={{width: '320px'}}>
                        <div style={{margin: '10px', paddingTop: '5px', border: '1px solid #ccc', maxHeight:'250px', overflowY:'auto'}}>
                            <h6 style={{paddingLeft:'20px'}}>Багана нуух</h6>
                            <ul id="tp_column_option">
                                {hideshow}
                            </ul>

                            {this.props.locales.map((locale)=>
                                <a className="dropdown-item" href="javascript:void(0)" key={locale.code} onClick={this.changeLanguage.bind(this, locale.code)}>
                                    <i className="material-icons">&#xE894;</i> {locale.code}
                                </a>
                            )}
                        </div>
                        <div className="">

                            <a className="dropdown-item" onClick={this.props.showAdvenced}>

                                    <i className="material-icons">&#xE8B6;</i> Дэлгэрэнгүй хайлт, <i className="material-icons">&#xE053;</i> Эрэмбэлэх
                             
                            </a>
                        
                        </div>

                    </div>
                </li>
            </ul>
            :
            null

        let searchBar = this.props.type == 'list' || this.props.type == 'comboGrid'
            ?
            <div className="navbar-toggleable-sm " id="navbar-3">
                <div
                    className="navbar-form form-inline pull-right pull-none-sm navbar-item v-m hidden-sm hidden-xs"
                    role="search">
                    <div className="form-group l-h m-a-0">
                        <div className="input-group input-group-sm">
                            <input type="text" className="form-control p-x b-a " ref="searchWord"
                                   placeholder="Хайх"/>

                            <span className="input-group-btn">
                                <button type="button" className="btn white b-a no-b-l no-shadow"
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
                    <li className="nav-item dropdown saved-success" id="save_info">
                       <span className="nav-link">
                            Амжилттай хадгалагдлаа
                       </span>
                    </li>
                    <li className="nav-item dropdown saved-failed" id="save_info_failed">

                       <span className="nav-link " >
                            Алдаа гарлаа
                       </span>
                    </li>
                </ul>
            </div>
            :
            null
        return (
            <div className="tp_header">

                    <div className="navbar">


                        <div className="navbar-item pull-left h6 p-l hidden-xs" id="pageTitle" >{this.props.pageName} :</div>

                        {actionControls}
                        {searchBar}
                    </div>

            </div>
        )
    }
}
Header.defaultProps = {
    permission:{c:false, r:false, u:false, d:false}

}
