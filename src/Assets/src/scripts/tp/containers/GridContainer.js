import React, { Component, PropTypes } from "react"
import $ from "jquery"

//import {modal} from 'bootstrap'
import * as DataActions from "../actions/grid"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import { getList, setupPage, deleteItem, save, update, edit, changeLanguage } from "../api/"
import Header from "../components/grid/Header"
import Body from "../components/grid/Body"
import Pagination from "../components/grid/Paginator"
import validation from "../components/form/validation/"
import Window from "../components/window/"
var tp_handSonTable = null
var exportPlugin = null
class GridContainer extends Component {
    //export
    exportPDF(){
        //$('#tp-table').tableExport({type:'csv'});
    }
    hideShowColumn(show, columnIndex){

        this.props.actions.setShowHideColumn(show, columnIndex)

        setTimeout(
            () => {
                this.setUpHandsonTable()
            },
            100
        );


    }
    exportEXCEL(){
        var date;
        date = new Date();
        date = date.getUTCFullYear() + '-' +
            ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
            ('00' + date.getUTCDate()).slice(-2) + ' ' +
            ('00' + date.getUTCHours()).slice(-2) + ':' +
            ('00' + date.getUTCMinutes()).slice(-2) + ':' +
            ('00' + date.getUTCSeconds()).slice(-2);


        exportPlugin.downloadFile('csv', {
            filename: this.props.setup.page_name+'-'+date,
            exportHiddenRows: true,     // default false, exports the hidden rows
            exportHiddenColumns: true,  // default false, exports the hidden columns
            columnHeaders: true,        // default false, exports the column headers
            rowHeaders: true,           // default false, exports the row headers
        });
    }
    selectRow(row){
        return false;
    }
    //export
    //translation
    changeLanguage(locale){
        changeLanguage(locale).then(()=>{

            this.props.actions.setLocale(locale);


        })

    }
    /*
     * Grid main actions starting
     * */
    callPageDatas(page, pageLimit, searchValue) {
        if(this.props.permission.r !== true)
            return false;

         this.props.actions.setShowGrid(false);
        getList(page, {
            pageLimit: pageLimit,
            searchValue: searchValue
        }).then((data)=> {
            this.props.actions.receiveListData(data);
           this.props.actions.setShowGrid(true);

            this.setUpHandsonTable()
        });
    }
    hangePageLimitChange(e) {
        this.props.actions.setPageLimit(e.target.value*1)
        this.props.actions.setCurrentPage(1)
        this.callPageDatas(1, e.target.value, this.props.searchValue)
    }
    handlePageChange(pageNumber) {
        this.props.actions.setCurrentPage(pageNumber)

        this.callPageDatas(pageNumber, this.props.pageLimit, this.props.searchValue)
    }
    handleSearch() {
        let sword = this.refs.search.refs.searchWord.value
        this.props.actions.setSearch(sword)
        this.callPageDatas(1, this.props.pageLimit, sword)
    }
    handleDeleteItem(id) {
        if(this.props.permission.d == true) {
            deleteItem(id).then((data)=> {
                if (data == 'success')
                    this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)
                else
                    alert("Please try agian")
            });
        }
    }
    /*
     * Grid main actions starting
     * */

    /*
    * Grid Inline from starting
    * */
    addInlineForm(){
        this.props.actions.setInlineFrom(true);
    }
    setRowEdit(editId, focusIndex){


        if(this.props.permission.u !== true)
            return false;

            const FC = this.props.formControls;

            if (FC.length >= 1)
                this.props.actions.clearFromValidation();

            if (editId === this.props.editID)
                return false;

            this.props.actions.setRowEdit(editId, focusIndex)
            if (editId >= 1)
                edit(editId).then((data)=> {
                    if (data.length >= 1)
                        this.props.formControls.map((formControl, index)=> {

                            this.props.actions.chagenValue(index, data[0][formControl.column])
                        })
                    else
                        alert('please try agian')

                });


    }
    removeInlineForm(){
        this.props.actions.setInlineFrom(false);
    }


    /*
     * Grid Inline from ending
     * */

    /*
    * Window form
    * */
    callWindowEdit(id){
        if(this.props.permission.u !== true)
            return false;


            this.props.actions.setRowEdit(id, 0)
            edit(id).then((data)=> {
                if(data.length >= 1)
                    this.props.formControls.map((formControl, index)=>{
                        this.props.actions.chagenValue(index, data[0][formControl.column])
                    })
                else
                    alert('please try agian')
            });
            $('#windowForm').modal({'backdrop': false}, 'show');


    }
    showModal(){
        if(this.props.permission.c !== true)
           return false;
        $('#windowForm').modal({'backdrop': false}, 'show');
    }
    hideModal(){
        $('#windowForm').modal('hide');
        this.props.actions.clearFromValidation();
    }
    /*
    * Component life circyle
    * */
    componentWillMount() {

    }
    setUpHandsonTable(){

        const {gridHeader, listData} = this.props;

        if(tp_handSonTable !== null){
            tp_handSonTable.destroy()
        }


        let tp_colHeader = [];
        let tp_columns = [];
        let fixedColumnsLeft = 0;

        gridHeader.map((header, h_index)=>{
            if(header.hidden){

            } else {
                tp_colHeader.push(header.title)
                tp_columns.push({data: header.column})
            }

            if(header.fixed)
                fixedColumnsLeft++;

        })


        var container = document.getElementById('tp_grid');
        tp_handSonTable = new Handsontable(container, {
            stretchH: 'all',
            data: listData,
            rowHeaders: true,
            colHeaders: tp_colHeader,
            columns: tp_columns,
            manualColumnResize: true,
            manualRowResize: true,
            fixedColumnsLeft: fixedColumnsLeft,
            readOnly: true,
            //fixedRowsBottom: 1,
            //columnSummary: [
            //    {
            //        "destinationColumn": 0,
            //        "destinationRow": 49,
            //        "type": "average",
            //        "forceNumeric": true,
            //        "suppressDataTypeErrors": false,
            //        "readOnly": true
            //    }
            //],

        });

        exportPlugin = tp_handSonTable.getPlugin('exportFile');
        exportPlugin.exportAsString('csv', {
            exportHiddenRows: true, // default false
            exportHiddenColumns: true, // default false
            columnHeaders: true, // default false
            rowHeaders: true, // default false
            columnDelimiter: ';', // default ','

        });
    }
    componentDidMount() {
        this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)




    }
    componentDidUpdate(prevProps) {

        if(prevProps.permission.r == false && this.props.permission.r == true){
            this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)
        }

    }

    render() {

        const {
            setup,
            defaultLocale,
            locales,
            listData,
            gridHeader,
            totalPages,
            pageLimit,
            totalItems,
            currentPage,
            paginationPosition,
            formData,
            editID,
            formType,
            formControls,
            focusIndex,
            showInlineForm,
            gridWidth,
            gridHeight,
            showGird,
            permission,
            ifUpdateDisabledCanEditColumns,
            } = this.props;

        if (permission.r === false && permission.c === true) {

            window.location.replace('#/add');

        }

        if (permission.r === false && permission.c === false && permission.d === false && setup.update_row !== null) {

            window.location.replace('#/edit/'+setup.update_row);

        }


        const BottomPagination = <Pagination
                totalItems={totalItems}
                totalPages={totalPages}
                currentPage={currentPage}
                pageLimit={pageLimit}
                handler={this.hangePageLimitChange.bind(this)}
                handlerPage={this.handlePageChange.bind(this)}
                paginationMarg="paginationBottom"
            />




        return (
            <div >
                <Header pageName={setup.page_name} icon="fa fa-plus"
                        locales={locales}
                        changeLanguage={this.changeLanguage.bind(this)}
                        link="#/add"
                        type="list"
                        formType={formType}
                        addInlineForm={this.addInlineForm.bind(this)}
                        ref="search"
                        handlerSearch={this.handleSearch.bind(this)}
                        showModal={this.showModal.bind(this)}
                        handlerReload={this.callPageDatas.bind(this, this.props.currentPage, this.props.pageLimit, this.props.searchValue)}
                        exportPDF={this.exportPDF.bind(this)}
                        exportEXCEL={this.exportEXCEL.bind(this)}
                        permission={permission}
                        gridHeader={gridHeader}
                        hideShowColumn={this.hideShowColumn.bind(this)}
                />

                <div id="tp_grid">

                </div>

                {BottomPagination}



            </div>

        )
    }
}

GridContainer.defaultProps = {
    gridHeader: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageLimit: 10,
    searchValue: '',
    listData:[],
    locales:[],
    permission:{c:false, r:true, u:false, d:false},
    ifUpdateDisabledCanEditColumns:[]

}
GridContainer.propTypes = {
    //setup: PropTypes.object.isRequired,
    //listData: PropTypes.object.isRequired,
}

function mapStateToProps(state) {

    const Grid = state.Grid;
    const Form = state.Form;

    return {
        setup: Grid.get('setup').toJS(),
        locales: Grid.get('setup').toJS().locales,
        defaultLocale: Grid.get('defaultLocale'),
        formData: Form.get('formData'),
        editID: Grid.get('editID'),
        showInlineForm: Grid.get('showInlineForm'),
        showGird: Grid.get('showGird'),
        focusIndex: Grid.get('focusIndex'),
        formControls: Form.get('form_input_control'),
        permission: Grid.get('setup').toJS().permission,
        ifUpdateDisabledCanEditColumns: Grid.get('setup').toJS().ifUpdateDisabledCanEditColumns,
        paginationPosition: Grid.get('setup').toJS().pagination_position,
        formType: Grid.get('setup').toJS().formType,
        listData: Grid.get('listData').toJS().data,
        gridHeader: Grid.get('setup').toJS().grid_output_control,
        totalItems: Grid.get('listData').toJS().total,
        totalPages: Grid.get('listData').toJS().last_page,
        currentPage: Grid.get('currentPage'),
        pageLimit: Grid.get('pageLimit'),
        searchValue: Grid.get('searchValue'),

    }
}

function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(DataActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GridContainer)
