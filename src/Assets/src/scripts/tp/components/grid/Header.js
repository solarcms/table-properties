import React, { Component, PropTypes }  from 'react';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';

export default class Header extends Component{
    //icons fa fa-plus , fa fa-chevron-left
    // uls #/add, #/
//<FloatingActionButton className="blue pull-right" href={this.props.link} linkButton={true}>
//<i className={this.props.icon}></i>
//</FloatingActionButton>
    render() {
        const addButton = this.props.formType == 'inline'
            ?
                <button className="btn" onClick={this.props.addInlineForm}><i className="fa fa-plus"></i></button>
            :
                <a href={this.props.link} className="btn"><i className="fa fa-plus"></i></a>

        const actionControl = this.props.type == 'list' ?
            <div >
                <div className="btn-group pull-right" role="group" aria-label="actions">
                    <div className="btn-group" role="group">
                        <div className="dropdown ">
                            <a className="btn  dropdown-toggle" id="dropdownMenu2"
                               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fa fa-upload"></i>
                                &nbsp;
                                <span className="caret"></span>
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                <li><a href=""><i className="fa fa-file-pdf-o"></i> PDF</a></li>
                                <li><a href=""><i className="fa fa-file-excel-o"></i> Excel</a></li>
                                <li><a href=""><i className="fa fa-print"></i> Print</a></li>

                            </ul>
                        </div>
                    </div>
                    <a  className="btn" onClick={this.props.handlerReload}><i className="fa fa-refresh"></i></a>
                    {addButton}
                    <div className="btn-group columns-right" role="group">
                        <div className="dropdown ">
                            <a className="btn  dropdown-toggle" id="dropdownMenu"
                               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fa fa-bars"></i>
                                &nbsp;
                                <span className="caret"></span>
                            </a>
                            <ul className="dropdown-menu" >
                                <li><a href="">Тохиргоо нэмэх</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="pull-right search">
                    <a className="btn" onClick={this.props.handlerSearch}>
                        <i className="fa fa-search"></i>
                    </a>
                </div>
                <div className="pull-right search">
                    <input className="form-control" type="text" ref="searchWord" placeholder="Хайх түхүүр үг" style={{display: 'inline-block'}}/>
                </div>

            </div>
        :
        null

        return (
            <div className="p-h-lg">
                <div className="row "  style={{padding: '10px 0'}}>
                    <div className="col-md-4">
                        <h3 className="" style={{margin: '0'}}> {this.props.pageName} </h3>
                    </div>
                    <div className="col-md-8">
                        { actionControl }
                    </div>
                </div>
            </div>

        )
    }
}

