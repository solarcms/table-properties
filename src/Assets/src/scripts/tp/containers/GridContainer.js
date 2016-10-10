import React, {Component, PropTypes} from "react"

import {bindActionCreators} from "redux"
import {connect} from "react-redux"

import numeral from 'numeral';


// import Window from "../components/window/"


import * as DataActions from "../actions/grid";
import * as DataActionsForm from "../actions/form"
import {getList, setupPage, deleteItem, save, getCascadeChild, update, edit, changeLanguage, inlineSave, inlineSaveUpdate} from "../api/"
import Header from "../components/grid/Header"
import Pagination from "../components/grid/Paginator"
import {customDropdownRenderer, gridImage, gridJson, genrateComboboxvalues} from '../lib/handSonTableHelper'

import {getDate} from "../lib/date";
import validationGrid from "../components/grid/validation/"
import AdvenvedSearch from "../components/grid/AdvenvedSearch"

/*for handson table*/
var tp_handSonTable = null
var exportPlugin = null
var tp_dataSchema = {};
var maxRows = 0;
import Loading from '../components/loading/loading'

class GridContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tpHeight:window.innerHeight-this.props.gridTop
        };
    }

    /* component life cycle ----------------------------------------- */
    componentWillMount() {

    }

    componentDidMount() {
        this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)

        window.addEventListener('resize', this.handleResize.bind(this));


    }

    handleResize(e) {
        let topH = this.props.showAdvenced ? this.props.gridTopWithAdvenced : this.props.gridTop;
        this.setState({tpHeight: window.innerHeight-topH});

        this.setUpHandsonTable(window.innerHeight-topH);
    }

    componentDidUpdate(prevProps) {

        if (prevProps.defaultLocale != this.props.defaultLocale) {
            this.setUpHandsonTable()
        }
        if (prevProps.permission.r == false && this.props.permission.r == true) {
            this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)
        }
        if (this.props.showInlineForm === true) {
            //this.setUpHandsonTable()

        }

        if (prevProps.order.column != this.props.order.column || prevProps.order.sortOrder != this.props.order.sortOrder) {
            this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)
        }

        if (JSON.stringify(prevProps.advancedSearch) != JSON.stringify(this.props.advancedSearch)) {
            this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)
        }


    }

    componentWillUnmount() {
        //tp_handSonTable.destroy()

        window.removeEventListener('resize', this.handleResize.bind(this));
    }


    /* header functions ----------------------------------------- */
    changeLanguage(locale) {
        changeLanguage(locale).then(()=> {
            this.props.actions.setLocale(locale);

        })

    }

    exportEXCEL() {

        var date;
        date = new Date();
        date = date.getUTCFullYear() + '-' +
            ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + date.getUTCDate()).slice(-2) + ' ' +
            ('00' + date.getUTCHours()).slice(-2) + ':' +
            ('00' + date.getUTCMinutes()).slice(-2) + ':' +
            ('00' + date.getUTCSeconds()).slice(-2);


        exportPlugin.downloadFile('csv', {
            filename: this.props.setup.page_name + '-' + date,
            exportHiddenRows: true,     // default false, exports the hidden rows
            exportHiddenColumns: true,  // default false, exports the hidden columns
            columnHeaders: true,        // default false, exports the column headers
            rowHeaders: true        // default false, exports the row headers\
            //range: [null, null, this.props.gridHeader.length-1, this.props.gridHeader.length-1]
        });
    }

    hideShowColumn(show, columnIndex) {
        this.props.actions.setShowHideColumn(show, columnIndex)
        setTimeout(
            () => {
                this.setUpHandsonTable()
            },
            100
        );
    }

    handleSearch() {
        let sword = this.refs.search.refs.searchWord.value
        this.props.actions.setSearch(sword)
        this.callPageDatas(1, this.props.pageLimit, sword)
    }


    /* pagination */
    hangePageLimitChange(e) {
        this.props.actions.setPageLimit(e.target.value * 1)
        this.props.actions.setCurrentPage(1)
        this.callPageDatas(1, e.target.value, this.props.searchValue)
    }

    handlePageChange(event) {



        this.props.actions.setCurrentPage(event)

        this.callPageDatas(event, this.props.pageLimit, this.props.searchValue)
    }


    /* Window form*/
    callWindowEdit(id) {
        if (this.props.permission.u !== true)
            return false;


        this.props.actions.setRowEdit(id, 0)
        edit(id).then((data)=> {
            if (data.length >= 1)
                this.props.formControls.map((formControl, index)=> {
                    this.props.actions.chagenValue(index, data[0][formControl.column])
                })
            else
                alert('please try agian')
        });
        //$('#windowForm').modal({'backdrop': false}, 'show');


    }

    showModal() {
        if (this.props.permission.c !== true)
            return false;
        //$('#windowForm').modal({'backdrop': false}, 'show');
    }

    hideModal() {
        //$('#windowForm').modal('hide');
        this.props.actions.clearFromValidation();
    }


    /* Grid */
    getColumnIndex(column) {
        //return _.findIndex(this.props.gridHeader, { column: column })
        return this.props.gridHeader.findIndex(x => x.column == column);
    }

    getColumnValdation(column) {
        //return _.findIndex(this.props.gridHeader, { column: column })
        if (this.props.gridHeader[column].validate)
            return this.props.gridHeader[column].validate;
        else
            return ''
    }

    getColumnTranslate(column) {
        //return _.findIndex(this.props.gridHeader, { column: column })
        if (this.props.gridHeader[column] && this.props.gridHeader[column].translate)
            return this.props.gridHeader[column].translate;
        else
            return false
    }

    getColumnType(column) {

        return this.props.gridHeader[column].type;

    }
    getColumn(index) {

        return this.props.gridHeader[index].column;

    }

    callPageDatas(page, pageLimit, searchValue) {
        if (this.props.permission.r !== true)
            return false;

        this.props.actions.setShowGrid(false);
        getList(page, {
            pageLimit: pageLimit,
            searchValue: searchValue,
            order: this.props.order,
            advancedSearch:this.props.advancedSearch
        }).then((data)=> {
            this.props.actions.receiveListData(data);
            this.props.actions.setShowGrid(true);
            this.setUpHandsonTable()
        });
    }

    handleDeleteItem(id) {

        if (id == -1) {
            this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)

            this.removeInlineForm()
        } else if (this.props.permission.d == true) {

            if (!confirm('Delete this record?')) {
                return;
            }
            else {
                deleteItem(id).then((data)=> {

                    this.removeInlineForm()
                    if (data == 'success')
                        this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)
                    else if (data == 'error')
                        alert("Алдаа гарлаа")
                    else
                        alert(data)
                }).fail(()=> {
                    alert("Алдаа гарлаа")
                });
            }


        }
    }

    addInlineForm() {
        this.props.actions.setInlineFrom(true);


        if (this.props.showInlineForm === false) {


            tp_handSonTable.alter('insert_row', 0, 1);

        }

        else
            alert("Эхний өгөгдлөө хадгалана уу")

    }

    removeInlineForm() {

        this.props.actions.setInlineFrom(false);
    }

    getData(row) {
        return tp_handSonTable.getDataAtRow(row);
    }


    editDeleteRender(instance, td, row, col, prop, value, cellProperties) {

        while (td.firstChild) {
            td.removeChild(td.firstChild);
        }
        var self = this;

        let pre_del = document.createElement('a');
        let pre_editBtn = document.createElement('a');
        let pre = document.createElement('span');

        td.appendChild(pre)

        td.setAttribute('class', 'htCenter htMiddle');


        if (this.props.formType != 'inline') {
            ///EDIT BUTTTON
            pre_editBtn.href = "#edit/" + value;
            pre_editBtn.innerHTML = "<i class=\"material-icons green-color\">&#xE254;</i>&nbsp;";

            if (this.props.permission.u == true || this.props.ifUpdateDisabledCanEditColumns.length >= 1)
                pre.appendChild(pre_editBtn);
        }


        // DELETE BUTTON
        pre_del.addEventListener("click", function () {

            self.handleDeleteItem(value)

        });


        pre_del.innerHTML = "<i class=\"material-icons red-color\">&#xE872;</i> ";
        if (this.props.permission.d == true)
            pre.appendChild(pre_del);


        return td;


    }


    internalLink(instance, td, row, col, prop, value, cellProperties) {
        while (td.firstChild) {
            td.removeChild(td.firstChild);
        }


        if (value) {
            let colIndex = this.getColumnIndex(prop)
            let pre_link = document.createElement('a');

            let colOption = this.props.gridHeader[colIndex];
            pre_link.setAttribute('target', '_blank');
            td.setAttribute('class', 'htCenter htMiddle');
            pre_link.setAttribute('href', colOption.link + value);


            pre_link.innerHTML = colOption.icon


            td.appendChild(pre_link);


            return td;
        }
    }

    afterValidater(isValid, value, row, prop, source) {

        let columnIndex = this.getColumnIndex(prop);
        if(isValid){
            tp_handSonTable.setCellMeta(row, columnIndex, 'className', '');
            return true;
        }
        else{

            tp_handSonTable.setCellMeta(row, columnIndex, 'className', 'required-field');
            return false;
        }


    }

    afterChange(changes, source, isValid) {

        if (changes) {

            let colIndex = 0;

            if (changes[0][1] === parseInt(changes[0][1], 10)) {
                colIndex = changes[0][1]
            } else
                colIndex = this.getColumnIndex(changes[0][1]);


            let colType = this.props.gridHeader[colIndex].type

            let row = changes[0][0];

            if (colType != '--auto-calculate') {

                ///auto-calculate
                let calculate_columns = []

                this.props.gridHeader.map((fcontrol, findex)=> {
                    if (fcontrol.type == '--auto-calculate') {


                        let calculate_type = fcontrol.options.calculate_type;
                        let calculate_column = fcontrol.column;

                        let columns = [];

                        fcontrol.options.calculate_columns.map((calculate_column, cal_index)=> {

                            let colIndex_ = this.getColumnIndex(calculate_column)


                            columns.push(
                                {column: calculate_column, value: tp_handSonTable.getDataAtCell(row, colIndex_)}
                            );
                        })

                        calculate_columns.push(
                            {
                                column: calculate_column,
                                type: calculate_type,
                                columns: columns,
                                dataIndex: findex
                            }
                        )
                    }
                })

                calculate_columns.map((calculate_column, index)=> {
                    let checkAllValue = true;
                    calculate_column.columns.map((cal_column)=> {
                        if (cal_column.value === null)
                            checkAllValue = false
                    })
                    let calculate_result = null;
                    if (checkAllValue === true) {
                        if (calculate_column.type == '--multiply') {
                            calculate_column.columns.map((cal_column, calIndex)=> {
                                if (calIndex == 0)
                                    calculate_result = cal_column.value;
                                else
                                    calculate_result = calculate_result * cal_column.value
                            })
                        } else if ((calculate_column.type == '--sum')) {
                            calculate_column.columns.map((cal_column, calIndex)=> {
                                if (calIndex == 0)
                                    calculate_result = cal_column.value;
                                else
                                    calculate_result = calculate_result + cal_column.value
                            })
                        } else if (calculate_column.type == '--average') {
                            calculate_column.columns.map((cal_column, calIndex)=> {
                                if (calIndex == 0)
                                    calculate_result = cal_column.value;
                                else
                                    calculate_result = calculate_result + cal_column.value
                            })
                            calculate_result = calculate_result / calculate_column.columns.length;
                        }
                        if (calculate_result !== null) {

                            tp_handSonTable.setDataAtCell(row, calculate_column.dataIndex, calculate_result);
                        }
                    }
                });
            }


            if (changes[0][1] != this.props.identity_name) {


                let rowDatas = this.getData(changes[0][0]);




                let error_not_found = true;

                let data = {};

                let edit_id = null;
                rowDatas.map((rowData, index)=> {
                    if (index <= this.props.gridHeader.length - 1) {

                        let col = index;

                        tp_handSonTable.getCellValidator(row, col)(rowData, function (isValid) {

                            if (!isValid)
                                error_not_found = false
                        });

                        data[this.props.gridHeader[index].column] = rowData;
                    }
                    if (index == this.props.gridHeader.length) {

                        edit_id = rowData;
                    }
                })


                if (error_not_found && edit_id === -1) {

                    inlineSave(data).then((data)=> {


                        $("#save_info" ).addClass("show-info");

                        this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)

                        this.removeInlineForm();

                        setTimeout(function(){ $("#save_info" ).removeClass("show-info"); }, 2500);



                    }).fail(()=> {
                        $("#save_info_failed" ).addClass("show-info");
                        setTimeout(function(){ $("#save_info_failed" ).removeClass("show-info"); }, 2500);
                    });

                }



                if (error_not_found && edit_id >= 1) {

                    inlineSaveUpdate(edit_id, data).then((data)=> {
                        $("#save_info" ).addClass("show-info");
                        this.removeInlineForm()
                        setTimeout(function(){ $("#save_info" ).removeClass("show-info"); }, 2500);
                    }).fail(()=> {
                        $("#save_info_failed" ).addClass("show-info");
                        setTimeout(function(){ $("#save_info_failed" ).removeClass("show-info"); }, 2500);

                    });

                }


            }


            //tp_handSonTable.getCellValidator(row, col)(newValue, function(isValid) {
            //    if (!isValid) {
            //        hot.setDataAtCell(row, col, null);
            //    }
            //});
        }


    }

    validationCaller(validateData, value, callback) {

        return validationGrid(validateData, value, callback);
    }



    setUpHandsonTable(tpNewHeight) {
        $('#tp_grid').empty();

        const {gridHeader, listData} = this.props;

        if (tp_handSonTable !== null) {
            tp_handSonTable.destroy()
        }


        let tp_colHeader = [];

        let tp_columns = [];
        let fixedColumnsLeft = 0;

        gridHeader.map((header, h_index)=> {
            if (header.hidden) {

            } else {
                tp_colHeader.push(header.title)
                let gridColumn = {}
                switch (header.type) {

                    case "--text":
                        gridColumn = {
                            data: header.column,
                            editor: 'text',
                            type: 'text',
                            validator: this.validationCaller.bind(this, header.validate),

                        }
                        break;
                    case "--textarea":
                        gridColumn = {
                            data: header.column,
                            editor: 'text',
                            type: 'text',
                            validator: this.validationCaller.bind(this, header.validate),
                            //allowInvalid: false
                        }
                        break;
                    case "--checkbox":
                        gridColumn = {
                            data: header.column,
                            type: 'checkbox',
                            checkedTemplate: 1,
                            uncheckedTemplate: 0,
                            validator: this.validationCaller.bind(this, header.validate),
                        }
                        break;
                    case "--combobox":

                        const optionsList = genrateComboboxvalues(this.props.formData[header.column].data.data, header);
                        gridColumn = {
                            data: header.column,
                            editor: "chosen",
                            chosenOptions: {
                                multiple: false,
                                data: optionsList,
                                valueField: header.options.valueField,
                                textField: header.options.textField,
                            },
                            validator: this.validationCaller.bind(this, header.validate),
                            renderer: customDropdownRenderer,
                        }

                        break;
                    case "--tag":
                        const optionsListtag = genrateComboboxvalues(this.props.formData[header.column].data.data, header);
                        gridColumn = {
                            data: header.column,
                            editor: "chosen",

                            chosenOptions: {
                                multiple: true,
                                data: optionsListtag,
                                valueField: header.options.valueField,
                                textField: header.options.textField,
                            },
                            validator: this.validationCaller.bind(this, header.validate),
                            renderer: customDropdownRenderer,
                        }
                        break;
                    case "--image":
                        gridColumn = {
                            data: header.column,
                            renderer: gridImage,
                        }

                        break;
                    case "--json":
                        gridColumn = {
                            data: header.column,
                            renderer: gridJson,
                        }

                        break;
                    case "--internal-link":
                        gridColumn = {
                            data: header.column,
                            validator: this.validationCaller.bind(this, header.validate),
                            renderer: this.internalLink.bind(this),
                            className: "htCenter htMiddle"
                        }

                        break;
                    case "--date":
                        gridColumn = {
                            data: header.column,
                            type: 'date',
                            validator: this.validationCaller.bind(this, header.validate),
                            dateFormat: "YYYY.MM.DD"
                            //allowInvalid: false
                        }

                        break;
                    case "--number":
                        gridColumn =
                        {
                            data: header.column,
                            type: 'numeric',
                            editor: 'numeric',
                            className:'htRight',
                            validator: this.validationCaller.bind(this, header.validate),
                        }
                        break;
                    case "--disabled":
                        gridColumn =
                        {
                            data: header.column,
                            type: 'text',
                            editor: false,
                            validator: this.validationCaller.bind(this, ''),
                        }
                        break;
                    case "--float":
                        gridColumn =
                        {
                            data: header.column,
                            type: 'numeric',
                            editor: 'numeric',
                            format: '0,0.000',
                            className:'htRight',
                            validator: this.validationCaller.bind(this, header.validate),
                        }

                        break;
                    case "--money":
                        gridColumn =
                        {
                            data: header.column,
                            type: 'numeric',
                            format: '0,0.00',
                            className:'htRight',
                            validator: this.validationCaller.bind(this, header.validate),
                        }
                        break;
                    case "--auto-calculate":
                        gridColumn =
                        {
                            data: header.column,
                            type: 'numeric',
                            format: '0,0.00',
                            className:'htRight',
                            readOnly: true,
                            validator: this.validationCaller.bind(this, header.validate),
                        }
                        break;
                    default:

                        gridColumn = {
                            data: header.column,
                        }

                }

                tp_columns.push(gridColumn);


            }

            if (header.fixed)
                fixedColumnsLeft++;

            tp_dataSchema[header.column] = null;
        })

        tp_dataSchema[this.props.identity_name] = -1;

        if (this.props.permission.d == true || this.props.permission.u == true || this.props.ifUpdateDisabledCanEditColumns.length >= 1) {
            tp_colHeader.push(this.props.edit_delete_column_title)

            tp_columns.push({
                data: this.props.identity_name,
                width: 70,
                renderer: this.editDeleteRender.bind(this),
                editor: false
            })
        }


        let gridData = listData;

        // if user column summary
        let columnSummary = this.props.columnSummary;
        let fixedRowsBottom = 0;
        if(columnSummary.length >=1 && gridData.length >=1){

            let preEmpty = gridData[0];
            let lastRow = {};
            Object.keys(preEmpty).map(empty =>{
                lastRow[empty] = null;
            })
            lastRow[this.props.identity_name] = 0;
            gridData.push(lastRow);

            fixedRowsBottom = 1;
        }


        //inline form add
        let trimRows = null
        let readOnly = true
        if (this.props.formType == 'inline') {
            readOnly = false
        }



        var self = this;
        var container = document.getElementById('tp_grid');

        let sortValues = true;

        let identity_name_pre = this.props.identity_name.split('.');
        let identity_name_real = this.props.identity_name;
        if(identity_name_pre.length >= 2)
            identity_name_real = identity_name_pre[1];

        let column_pre = this.props.order.column.split('.');
        let column_real = this.props.order.column;
        if(column_pre.length >= 2)
            column_real = column_pre[1];



        if(column_real !== null && this.props.order.sortOrder !== null && column_real  != identity_name_real)
            sortValues = {
                column: this.getColumnIndex(column_real),
                sortOrder: this.props.order.sortOrder == 'ASC' ? true : false
            }



        let gridHieght = tpNewHeight ? tpNewHeight : this.state.tpHeight

        tp_handSonTable = new Handsontable(container, {
            stretchH: 'all',
            data: gridData,
            dataSchema: tp_dataSchema,
            rowHeaders: true,
            colHeaders: tp_colHeader,
            columns: tp_columns,
            manualColumnResize: true,
            manualRowResize: true,
            fixedColumnsLeft: fixedColumnsLeft,
            readOnly: readOnly,
            columnSorting: sortValues,
            sortIndicator: true,
            fillHandle: false,
            afterChange: this.afterChange.bind(this),
            beforeColumnSort: this.beforeColumnSort.bind(this),
            enterMoves:{row: 0, col: 1},
            fixedRowsBottom:fixedRowsBottom,
            cells: function (row, col, prop) {



                var cellProperties = {};

                var conIndex = self.getColumnIndex(prop)
                var translate = self.getColumnTranslate(conIndex)

                let cellClass = ''

                let hasahToo =  columnSummary.length >=1 ? 2 : 1;

                if(row <= gridData.length-hasahToo || row <=0 ) {
                    if (prop != self.props.identity_name && prop != 'id') {

                        let validate = false;


                        if (self.props.gridHeader[col] && self.props.gridHeader[col].validate)
                            validate = self.props.gridHeader[col].validate;


                        if (validate && gridData.length >= 1 && gridData[row]) {

                            let isvalid = validationGrid(validate, gridData[row][prop]);

                            if (isvalid) {

                            } else {
                                cellClass = 'required-field';
                            }

                        }


                        var type_col = self.getColumnType(conIndex)


                        if (type_col != '--image' && type_col != '--internal-link' && type_col != '--combobox' && type_col != '--tag') {
                            cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {

                                Handsontable.cellTypes[cellProperties.type].renderer.apply(this, arguments);
                                if (translate === true) {
                                    while (td.firstChild) {
                                        td.removeChild(td.firstChild);
                                    }
                                    let json_translations = JSON.parse(value);
                                    json_translations.map(json_translation => {
                                        if (json_translation.locale == self.props.defaultLocale) {
                                            var textNode = document.createElement('span');
                                            textNode.innerHTML = json_translation.value;
                                            td.appendChild(textNode);
                                        }

                                    })

                                } else {
                                    /* chnage 0,1 value to string*/
                                    let change_value = self.props.gridHeader[conIndex].change_value;
                                    if (change_value) {


                                        while (td.firstChild) {
                                            td.removeChild(td.firstChild);
                                        }

                                        var textNode = document.createElement('span');

                                        change_value.map(cvalue=> {
                                            if (value == cvalue.value)
                                                textNode.innerText = cvalue.text
                                        })

                                        td.appendChild(textNode);


                                    }
                                }
                            }
                            cellProperties['className'] = cellClass;
                            return cellProperties;

                        } else {
                            cellProperties['className'] = cellClass;
                            return cellProperties;
                        }



                    }
                } else {
                    cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {

                        Handsontable.cellTypes[cellProperties.type].renderer.apply(this, arguments);


                        while (td.firstChild) {
                            td.removeChild(td.firstChild);
                        }

                        var textNode = document.createElement('span');

                        columnSummary.map(summary=>{

                            if (prop ==summary.column) {

                                if(summary.type == 'sum'){
                                    let columnSum = 0;
                                    for(let q=0; q<=gridData.length-2; q++){
                                        columnSum = (gridData[q][prop]*1)+columnSum;
                                    }

                                    columnSum = numeral(columnSum);
                                    if(summary.format == 'money'){
                                        columnSum = columnSum.format('0,0.00');
                                    } else if(summary.format == 'float'){
                                        columnSum = columnSum.format('0,0.000');
                                    } else{
                                        columnSum = columnSum.format('0,0');
                                    }


                                    textNode.innerHTML = "<b>"+columnSum+"</b>";
                                }
                            }

                        })




                        td.appendChild(textNode);


                    }
                    cellProperties['readOnly'] = true;
                    return cellProperties;
                }


            },
            dropdownMenu: [
                'alignment', '---------',
                'filter_by_condition', '---------',
                'filter_by_value', '---------',
                'filter_action_bar', '---------',
            ],
            filters: true,
            autoWrapRow:true,
            afterValidate:this.afterValidater.bind(this),
            height: gridHieght,



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

    showAdvenced(){
        if(this.props.showAdvenced)
            this.props.actions.showAdvenced(false);
        else
            this.props.actions.showAdvenced(true);

        this.setUpHandsonTable();
    }

    /*advedsen search & order */
    beforeColumnSort(columnIndex, order){
        if(columnIndex == -1)
            return false;

        let column = null;
        let sortOrder = null;

        if(order === true){
            sortOrder = 'ASC';
            column = this.getColumn(columnIndex);
        } else if(order === false){
            sortOrder = 'DESC';
            column = this.getColumn(columnIndex);
        }


        this.props.actions.setOrder(column, sortOrder)




        return false;
    }
    mainOrderNew(){
        this.props.actions.setOrder(this.props.identity_name, 'DESC')
    }
    mainOrderOld(){
        this.props.actions.setOrder(this.props.identity_name, 'ASC')
    }
    parentSelectHandler(index, value){

        this.props.actions.dynamicChange(['advancedSearch', 'parentSelect', index, 'value'], value);



        if(this.props.advancedSearch.parentSelect[index].child){

            this.props.advancedSearch.parentSelect.map((parentSelect, Pindex)=> {

                if(parentSelect.column == this.props.advancedSearch.parentSelect[index].child){
                    this.props.actions.dynamicChange(['advancedSearch', 'parentSelect', Pindex, 'value'], null);
                }
            });
            getCascadeChild(this.props.advancedSearch.parentSelect[index].child, value).then((data)=>{
                this.props.actionsForm.changeFormData(this.props.advancedSearch.parentSelect[index].child, data);
            })
        }
    }
    dateRange(index, v,  value){
      
        let newValue = getDate(value);
        this.props.actions.dynamicChange(['advancedSearch', 'dateRange', index, 'value'+v], newValue);
    }
    dateYearMonthChangeY(value){
        this.props.actions.dynamicChange(['advancedSearch', 'dateYearMonth', 'defaultYear'], value);
    }
    dateYearMonthChangeM(value){
        this.props.actions.dynamicChange(['advancedSearch', 'dateYearMonth', 'defaultMonth'], value);
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
            button_texts,
            advancedSearch,
            order,
            identity_name,
            formDataNew,
            hideMainOrder,
            advancedSearchImmutalbe
        } = this.props;

        if (permission.r === false && permission.c === true) {

            window.location.replace('#/add');

        }

        if (permission.r === false && permission.c === false && permission.d === false && setup.update_row !== null) {

            window.location.replace('#/edit/' + setup.update_row);

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

        const AdvencedClass = this.props.showAdvenced ? 'show_advenced' : '';
        const gridClass = this.props.showAdvenced ? 'with_advenced' : '';
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
                        exportEXCEL={this.exportEXCEL.bind(this)}
                        permission={permission}
                        gridHeader={gridHeader}
                        hideMainOrder={hideMainOrder}
                        hideShowColumn={this.hideShowColumn.bind(this)}
                        showAdvenced={this.showAdvenced.bind(this)}
                        add_button_text={button_texts.add_button_text}
                />
                <AdvenvedSearch
                    AdvencedClass={AdvencedClass}
                    advancedSearch={advancedSearch}
                    order={order}
                    identity_name={identity_name}
                    formDataNew={formDataNew}
                    defaultLocale={defaultLocale}
                    formControls={formControls}
                    hideMainOrder={hideMainOrder}
                    dateRangeChange={this.dateRange.bind(this)}
                    dateYearMonthChangeY={this.dateYearMonthChangeY.bind(this)}
                    dateYearMonthChangeM={this.dateYearMonthChangeM.bind(this)}
                    parentSelectHandler={this.parentSelectHandler.bind(this)}
                    mainOrderNew={this.mainOrderNew.bind(this)}
                    mainOrderOld={this.mainOrderOld.bind(this)}
                />

                <div id="tp_grid" className={gridClass}>
                    <Loading />
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
    listData: [],
    locales: [],
    permission: {c: false, r: true, u: false, d: false},
    ifUpdateDisabledCanEditColumns: []

}


function mapStateToProps(state) {

    const Grid = state.Grid;
    const Form = state.Form;

    return {
        identity_name: Form.get('identity_name'),
        setup: Grid.get('setup').toJS(),
        locales: Grid.get('setup').toJS().locales,
        defaultLocale: Grid.get('defaultLocale'),
        formData: Form.get('formData').toJS(),
        formDataNew: Form.get('formData'),
        editID: Grid.get('editID'),
        showInlineForm: Grid.get('showInlineForm'),
        showGird: Grid.get('showGird'),
        button_texts: Grid.get('button_texts'),
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
        edit_delete_column_title: Grid.get('edit_delete_column_title'),
        showAdvenced: Grid.get('showAdvenced'),
        order: Grid.get('order').toJS(),
        advancedSearch: Grid.get('advancedSearch').toJS(),
        columnSummary: Grid.get('columnSummary').toJS(),
        gridTop: Grid.get('gridTop'),
        gridTopWithAdvenced: Grid.get('gridTopWithAdvenced'),
        hideMainOrder: Grid.get('hideMainOrder'),

    }
}

function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(DataActions, dispatch),
        actionsForm: bindActionCreators(DataActionsForm, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GridContainer)
