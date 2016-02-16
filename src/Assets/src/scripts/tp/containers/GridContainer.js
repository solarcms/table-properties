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
var tp_dataSchema = {};
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
        console.log(tp_handSonTable.getDataAtRow(0));
        //var date;
        //date = new Date();
        //date = date.getUTCFullYear() + '-' +
        //    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        //    ('00' + date.getUTCDate()).slice(-2) + ' ' +
        //    ('00' + date.getUTCHours()).slice(-2) + ':' +
        //    ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        //    ('00' + date.getUTCSeconds()).slice(-2);
        //
        //
        //exportPlugin.downloadFile('csv', {
        //    filename: this.props.setup.page_name+'-'+date,
        //    exportHiddenRows: true,     // default false, exports the hidden rows
        //    exportHiddenColumns: true,  // default false, exports the hidden columns
        //    columnHeaders: true,        // default false, exports the column headers
        //    rowHeaders: true,           // default false, exports the row headers\
        //    range: [null, null, this.props.gridHeader.length-1, this.props.gridHeader.length-1]
        //});
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

                if (!confirm('Delete this record?')) {
                    return;
                }
                else{
                    deleteItem(id).then((data)=> {

                        if (data == 'success')
                            this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)
                        else
                            alert("Please try agian")
                    });
                }


        }
    }
    /*
     * Grid main actions starting
     * */

    /*
    * Grid Inline from starting
    * */
    getColumnIndex(column){
        //return _.findIndex(this.props.gridHeader, { column: column })
        return this.props.gridHeader.findIndex(x => x.column == column );
    }
    columnToLetter(column) {
            var temp, letter = '';
            while (column > 0)
            {
                temp = (column - 1) % 26;
                letter = String.fromCharCode(temp + 65) + letter;
                column = (column - temp - 1) / 26;
            }
            return letter;
        }

    letterToColumn(letter) {
            var column = 0, length = letter.length;
            for (var i = 0; i < length; i++)
            {
                column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
            }
            return column;
        }
    checkNull(value, callback) {

        if (!value || value == '') {
            callback(false);
        }
        else {
            callback(true);
        }

    }
    afterChange(changes, source, isValid){
        console.log(changes, source, isValid)
        if(changes)
        console.log(changes[0][3]);
        //if(changes)

        if(changes){
            if(changes[0][0] == 0 && changes[0][1] != 'niit_dun'){
                if((tp_handSonTable.getDataAtCell(0, 1) !== null && tp_handSonTable.getDataAtCell(0, 1) != '') || (tp_handSonTable.getDataAtCell(0, 2) !== null && tp_handSonTable.getDataAtCell(0, 2) != '')){
                    let newValue = (tp_handSonTable.getDataAtCell(0, 1)) * (tp_handSonTable.getDataAtCell(0, 2) *1);
                    tp_handSonTable.setDataAtCell(0, 3, newValue);
                }

            }

        }

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
                let gridColumn = {}
                switch (header.type) {
                    case "--text":
                        gridColumn ={
                            data: header.column,
                            editor: 'text',
                            type: 'text',
                            validator: this.checkNull.bind(this), allowInvalid: false
                        }

                        break;
                    case "--number":
                        gridColumn =
                        {
                            data: header.column,
                            type: 'numeric',
                            editor: 'numeric'
                        }

                        break;
                    case "--money":
                        gridColumn =
                        {
                            data: header.column,
                            type: 'numeric',
                            format: '0,0.00',
                        }
                        break;
                    case "--auto-calculate":
                        gridColumn =
                        {
                            data: header.column,
                            type: 'numeric',
                            format: '0,0.00',
                            readOnly:true,

                        }
                        break;
                    default:

                        gridColumn ={
                            data: header.column,
                        }

                }

                tp_columns.push(gridColumn);

                //shema
                if(header.type == '--auto-calculate'){
                    let formula = '=';
                    if(header.options.calculate_type == '--multiply'){
                        header.options.calculate_columns.map((calculate_column, cal_index)=>{
                            let col_index = this.getColumnIndex(calculate_column)
                            let col_letter = this.columnToLetter(col_index+1)

                            if(cal_index == 0)
                                formula = formula+col_letter+'1';
                            else
                                formula = formula+'*'+col_letter+'1';
                        })
                    }
                    tp_dataSchema[header.column] = formula;
                }else
                tp_dataSchema[header.column] = header.value;
            }

            if(header.fixed)
                fixedColumnsLeft++;

        })

        tp_colHeader.push('Засах')
        tp_columns.push({
            data: 'id',
            width: 40,

            renderer: this.editDeleteRender.bind(this),
            editor: false
        })

        let gridData = listData;

        //inline form add
        let trimRows = null
        let readOnly = true
        if(this.props.formType == 'inline'){
            readOnly =false

            //gridData.unshift(
            //    tp_dataSchema
            //)
            //gridData.unshift(
            //    {}
            //)

        }
        if(this.props.formType == 'inline' && this.props.showInlineForm === false)
            trimRows =[0]

        let maxRows = gridData.length;
        if(this.props.formType == 'inline' && this.props.showInlineForm === false)
            maxRows = gridData.length+1;



        var container = document.getElementById('tp_grid');
        tp_handSonTable = new Handsontable(container, {
            stretchH: 'all',
            data: gridData,
            //dataSchema: tp_dataSchema,
            rowHeaders: true,
            //formulas: true,
            colHeaders: tp_colHeader,
            columns: tp_columns,
            manualColumnResize: true,
            manualRowResize: true,
            fixedColumnsLeft: fixedColumnsLeft,
            readOnly: readOnly,
            columnSorting: true,
            sortIndicator: true,
            //trimRows: trimRows,
            maxRows:maxRows,
            afterChange:this.afterChange.bind(this)


            //columnSorting: {
            //    column: 0,
            //    sortOrder: false
            //},

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
    addInlineForm(){
        this.props.actions.setInlineFrom(true);


        if(this.props.showInlineForm === false)
            tp_handSonTable.alter('insert_row', 0);
        else
            alert("Эхний өгөгдлөө хадгалана уу")

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
    editDeleteRender(instance, td, row, col, prop, value, cellProperties) {

        if(!td.hasChildNodes()){
            if(!value)
                return
            var self = this;

            let pre_del =  document.createElement('a');
            let pre_editBtn =  document.createElement('a');
            let pre =  document.createElement('span');


            ///EDIT BUTTTON
            pre_editBtn.href = "#edit/"+value;
            pre_editBtn.innerHTML = "<i class=\"material-icons\">&#xE254;</i>&nbsp;";

            if(this.props.permission.u == true || this.props.ifUpdateDisabledCanEditColumns.length >=1)
                pre.appendChild(pre_editBtn);

            td.appendChild(pre)


            // DELETE BUTTON
            pre_del.addEventListener("click", function(){

                self.handleDeleteItem(value)
            });

            pre_del.innerHTML = "<i class=\"material-icons\">&#xE872;</i>";
            if(this.props.permission.d == true)
                pre.appendChild(pre_del);




            return td;
        } else
            return





    }



    componentDidMount() {
        this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)




    }
    componentDidUpdate(prevProps) {

        if(prevProps.permission.r == false && this.props.permission.r == true){
            this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)
        }
        if(this.props.showInlineForm === true){
            //this.setUpHandsonTable()

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
