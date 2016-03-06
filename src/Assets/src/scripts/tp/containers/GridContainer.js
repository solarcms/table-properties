import React, { Component, PropTypes } from "react"
import * as DataActions from "../actions/grid"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import { getList, setupPage, deleteItem, save, update, edit, changeLanguage, inlineSave, inlineSaveUpdate } from "../api/"

import Header from "../components/grid/Header"

import Pagination from "../components/grid/Paginator"

import Window from "../components/window/"

import validationGrid from "../components/grid/validation/"

/*for handson table*/
var tp_handSonTable = null
var exportPlugin = null
var tp_dataSchema = {};
var maxRows = 0;

class GridContainer extends Component {

    /* component life cycle ----------------------------------------- */
    componentWillMount() {

    }
    componentDidMount() {
        this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)
    }
    componentDidUpdate(prevProps) {

        if(prevProps.defaultLocale != this.props.defaultLocale){
            this.setUpHandsonTable()
        }

        if(prevProps.permission.r == false && this.props.permission.r == true){
            this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)
        }
        if(this.props.showInlineForm === true){
            //this.setUpHandsonTable()

        }

    }
    componentWillUnmount() {
        //tp_handSonTable.destroy()
    }


    /* header functions ----------------------------------------- */
    changeLanguage(locale){
        changeLanguage(locale).then(()=>{
            this.props.actions.setLocale(locale);

        })

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
            rowHeaders: true        // default false, exports the row headers\
            //range: [null, null, this.props.gridHeader.length-1, this.props.gridHeader.length-1]
        });
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
    handleSearch() {
        let sword = this.refs.search.refs.searchWord.value
        this.props.actions.setSearch(sword)
        this.callPageDatas(1, this.props.pageLimit, sword)
    }


    /* pagination */
    hangePageLimitChange(e) {
        this.props.actions.setPageLimit(e.target.value*1)
        this.props.actions.setCurrentPage(1)
        this.callPageDatas(1, e.target.value, this.props.searchValue)
    }
    handlePageChange(pageNumber) {
        this.props.actions.setCurrentPage(pageNumber)

        this.callPageDatas(pageNumber, this.props.pageLimit, this.props.searchValue)
    }


    /* Window form*/
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
            //$('#windowForm').modal({'backdrop': false}, 'show');


    }
    showModal(){
        if(this.props.permission.c !== true)
           return false;
        //$('#windowForm').modal({'backdrop': false}, 'show');
    }
    hideModal(){
        //$('#windowForm').modal('hide');
        this.props.actions.clearFromValidation();
    }


    /* Grid */
    getColumnIndex(column){
        //return _.findIndex(this.props.gridHeader, { column: column })
        return this.props.gridHeader.findIndex(x => x.column == column );
    }
    getColumnValdation(column){
        //return _.findIndex(this.props.gridHeader, { column: column })
        if(this.props.gridHeader[column].validate)
        return this.props.gridHeader[column].validate;
        else
            return ''
    }
    getColumnTranslate(column){
        //return _.findIndex(this.props.gridHeader, { column: column })
        if(this.props.gridHeader[column] && this.props.gridHeader[column].translate)
            return this.props.gridHeader[column].translate;
        else
            return false
    }
    getColumnType(column){

        return this.props.gridHeader[column].type;

    }
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
    handleDeleteItem(id) {

        if(id == -1){
            this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)

            this.removeInlineForm()
        } else if(this.props.permission.d == true) {

            if (!confirm('Delete this record?')) {
                return;
            }
            else{
                deleteItem(id).then((data)=> {

                    this.removeInlineForm()
                    if (data == 'success')
                        this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)
                    else
                        alert("Please try agian")
                });
            }


        }
    }
    addInlineForm(){
        this.props.actions.setInlineFrom(true);


        if(this.props.showInlineForm === false){


            tp_handSonTable.alter('insert_row', 0, 1);

        }

        else
            alert("Эхний өгөгдлөө хадгалана уу")

    }
    removeInlineForm(){

        this.props.actions.setInlineFrom(false);
    }
    getData(row){
        return tp_handSonTable.getDataAtRow(row);
    }
    editDeleteRender(instance, td, row, col, prop, value, cellProperties) {

        while (td.firstChild) {
            td.removeChild(td.firstChild);
        }
                    var self = this;

                    let pre_del =  document.createElement('a');
                    let pre_editBtn =  document.createElement('a');
                    let pre =  document.createElement('span');

                    td.appendChild(pre)

                    if(this.props.formType != 'inline'){
                        ///EDIT BUTTTON
                        pre_editBtn.href = "#edit/"+value;
                        pre_editBtn.innerHTML = "<i class=\"material-icons\">&#xE254;</i>&nbsp;";

                        if(this.props.permission.u == true || this.props.ifUpdateDisabledCanEditColumns.length >=1)
                            pre.appendChild(pre_editBtn);
                    }






                    // DELETE BUTTON
                    pre_del.addEventListener("click", function(){

                        self.handleDeleteItem(value)

                    });



                    pre_del.innerHTML = "<i class=\"material-icons\">&#xE872;</i> ";
                    if(this.props.permission.d == true)
                        pre.appendChild(pre_del);




                    return td;










    }
    gridImage(instance, td, row, col, prop, value, cellProperties) {

        while (td.firstChild) {
            td.removeChild(td.firstChild);
        }


        if(value){
            let pre_link =  document.createElement('a');



            let value_image =  JSON.parse(value);

            let image_thum_url = value_image.thumbUrl+value_image.uniqueName
            let image_url = value_image.destinationUrl+value_image.uniqueName

            pre_link.setAttribute('target', '_blank');
            pre_link.setAttribute('href', image_url);

            let image =  document.createElement('img');
            image.setAttribute('class', 'grid-thumb');
            image.setAttribute('src', image_thum_url);

            pre_link.appendChild(image)



            td.appendChild(pre_link);


            return td;
        }


    }
    internalLink(instance, td, row, col, prop, value, cellProperties) {
        while (td.firstChild) {
            td.removeChild(td.firstChild);
        }


        if(value){
            let colIndex = this.getColumnIndex(prop)
            let pre_link =  document.createElement('a');

            let colOption = this.props.gridHeader[colIndex];
            pre_link.setAttribute('target', '_blank');
            td.setAttribute('class', 'htCenter htMiddle');
            pre_link.setAttribute('href', colOption.link+value);


            pre_link.innerHTML = colOption.icon



            td.appendChild(pre_link);


            return td;
        }
    }
    afterChange(changes, source, isValid){

        if(changes){

            let colIndex = 0;

            if (changes[0][1] === parseInt(changes[0][1], 10)){
                colIndex = changes[0][1]
            }else
            colIndex = this.getColumnIndex(changes[0][1]);



            let colType = this.props.gridHeader[colIndex].type

            let row = changes[0][0];

            if(colType != '--auto-calculate'){

                ///auto-calculate
                let calculate_columns = []

                this.props.gridHeader.map((fcontrol, findex)=>{
                    if(fcontrol.type == '--auto-calculate'){


                        let calculate_type = fcontrol.options.calculate_type;
                        let calculate_column = fcontrol.column;

                        let columns = [];

                        fcontrol.options.calculate_columns.map((calculate_column, cal_index)=>{

                            let colIndex_ = this.getColumnIndex(calculate_column)



                            columns.push(
                                {column: calculate_column, value: tp_handSonTable.getDataAtCell(row, colIndex_)}
                            );
                        })

                        calculate_columns.push(
                            {
                                column:calculate_column,
                                type:calculate_type,
                                columns:columns,
                                dataIndex:findex
                            }
                        )
                    }
                })

                calculate_columns.map((calculate_column, index)=>{
                    let checkAllValue = true;
                    calculate_column.columns.map((cal_column)=>{
                        if(cal_column.value === null)
                            checkAllValue = false
                    })
                    let calculate_result = null;
                    if(checkAllValue === true){
                        if(calculate_column.type == '--multiply'){
                            calculate_column.columns.map((cal_column, calIndex)=>{
                                if(calIndex == 0)
                                    calculate_result = cal_column.value;
                                else
                                    calculate_result = calculate_result * cal_column.value
                            })
                        }else if((calculate_column.type == '--sum')){
                            calculate_column.columns.map((cal_column, calIndex)=>{
                                if(calIndex == 0)
                                    calculate_result = cal_column.value;
                                else
                                    calculate_result = calculate_result + cal_column.value
                            })
                        } else if(calculate_column.type == '--average'){
                            calculate_column.columns.map((cal_column, calIndex)=>{
                                if(calIndex == 0)
                                    calculate_result = cal_column.value;
                                else
                                    calculate_result = calculate_result + cal_column.value
                            })
                            calculate_result = calculate_result/calculate_column.columns.length;
                        }
                        if(calculate_result !== null){

                            tp_handSonTable.setDataAtCell(row, calculate_column.dataIndex, calculate_result);
                        }
                    }
                });
            }





            if(changes[0][1] != 'id' && colType != '--combobox' && colType != '--tag') {


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

                        this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)

                        this.removeInlineForm()

                    });

                }

                if (error_not_found && edit_id >= 1) {

                    inlineSaveUpdate(edit_id, data).then((data)=> {
                        this.removeInlineForm()
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
    validationCaller(validateData, value, callback){

        return validationGrid(validateData, value, callback);
    }
    afterValidater(isValid, value, row, prop, source){

        //let ColIndex = this.getColumnIndex(prop);
        //if(isValid)
        //    return true;
        //else
        //    return false;

    }
    customDropdownRenderer(instance, td, row, col, prop, value, cellProperties) {

        while (td.firstChild) {
            td.removeChild(td.firstChild);
        }

        var selectedId;
        var optionsList = cellProperties.chosenOptions.data;
        var valueField = cellProperties.chosenOptions.valueField;
        var textField = cellProperties.chosenOptions.textField;




        var values = (value + "").split(",");
        var value = [];
        for (var index = 0; index < optionsList.length; index++) {
            if (values.indexOf(optionsList[index][valueField] + "") > -1) {
                selectedId = optionsList[index][valueField];

                if (textField instanceof Array) {
                    textField.map(tf=>{
                        value.push(optionsList[index][tf]);
                    })
                }
                else {
                    value.push(optionsList[index][textField]);
                }

            }
        }
        value = value.join(", ");


        let pre =  document.createElement('span');
        pre.innerHTML = value
        td.appendChild(pre)


        return td;
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
                            validator: this.validationCaller.bind(this, header.validate),
                            //allowInvalid: false
                        }
                        break;
                    case "--textarea":
                        gridColumn ={
                            data: header.column,
                            editor: 'text',
                            type: 'text',
                            validator: this.validationCaller.bind(this, header.validate),
                            //allowInvalid: false
                        }
                        break;
                    case "--checkbox":
                        gridColumn ={
                            data: header.column,
                            type: 'checkbox',
                            checkedTemplate: 1,
                            uncheckedTemplate: 0,
                            validator: this.validationCaller.bind(this, header.validate),
                        }
                        break;
                    case "--combobox":



                        gridColumn = {
                            data: header.column,
                            editor: "chosen",

                            chosenOptions: {
                                multiple: false,
                                data: this.props.formData[header.column].data.data,
                                valueField: header.options.valueField,
                                textField: header.options.textField,
                            },
                            validator: this.validationCaller.bind(this, header.validate),
                            renderer: this.customDropdownRenderer.bind(this),
                        }

                        break;
                    case "--tag":

                        gridColumn = {
                            data: header.column,
                            editor: "chosen",

                            chosenOptions: {
                                multiple: true,
                                data: this.props.formData[header.column].data.data
                            },
                            validator: this.validationCaller.bind(this, header.validate),
                            renderer: this.customDropdownRenderer.bind(this),
                        }
                        break;
                    case "--image":
                        gridColumn = {
                            data: header.column,
                            renderer: this.gridImage.bind(this),
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
                        gridColumn ={
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
                            validator: this.validationCaller.bind(this, header.validate),
                        }

                        break;
                    case "--money":
                        gridColumn =
                        {
                            data: header.column,
                            type: 'numeric',
                            format: '0,0.00',
                            validator: this.validationCaller.bind(this, header.validate),
                        }
                        break;
                    case "--auto-calculate":
                        gridColumn =
                        {
                            data: header.column,
                            type: 'numeric',
                            format: '0,0.00',
                            readOnly:true,
                            validator: this.validationCaller.bind(this, header.validate),
                        }
                        break;
                    default:

                        gridColumn ={
                            data: header.column,
                        }

                }

                tp_columns.push(gridColumn);


            }

            if(header.fixed)
                fixedColumnsLeft++;

            tp_dataSchema[header.column] = null;
        })

        tp_dataSchema['id'] = -1;

        if(this.props.permission.u == true || this.props.ifUpdateDisabledCanEditColumns.length >=1){
            tp_colHeader.push('Засах')
            tp_columns.push({
                data: 'id',
                width: 40,

                renderer: this.editDeleteRender.bind(this),
                editor: false
            })
        }


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

        maxRows = gridData.length;
        //if(this.props.formType == 'inline' && this.props.showInlineForm === false)
        //    maxRows = gridData.length+1;

        var self = this;
        var container = document.getElementById('tp_grid');
        tp_handSonTable = new Handsontable(container, {
            stretchH: 'all',
            data: gridData,
            dataSchema: tp_dataSchema,
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
            fillHandle: false, // drag change value and create row disable
            //trimRows: trimRows,
            //maxRows:maxRows,
            afterChange:this.afterChange.bind(this),
            //afterCreateRow: function(index, amount){
            //    if(index >= 1){
            //        gridData.splice(index, amount)
            //    }
            //
            //
            //},
            cells: function (row, col, prop) {

                var cellProperties = {};

                var conIndex = self.getColumnIndex(prop)
                var translate = self.getColumnTranslate(conIndex)



                if(prop != self.props.identity_name && prop != 'id'){
                    var type_col = self.getColumnType(conIndex)
                    if(type_col != '--image' && type_col != '--internal-link' && type_col != '--combobox' && type_col != '--tag'){
                        cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {

                            Handsontable.cellTypes[cellProperties.type].renderer.apply(this, arguments);
                            if (translate === true) {
                                while (td.firstChild) {
                                    td.removeChild(td.firstChild);
                                }
                                let json_translations =  JSON.parse(value);
                                json_translations.map(json_translation =>{
                                    if(json_translation.locale == self.props.defaultLocale){
                                        var textNode = document.createElement('span');
                                        textNode.innerHTML = json_translation.value;
                                        td.appendChild(textNode);
                                    }

                                })

                            } else {
                                /* chnage 0,1 value to string*/
                                let change_value = self.props.gridHeader[conIndex].change_value;
                               if(change_value){

                                   while (td.firstChild) {
                                       td.removeChild(td.firstChild);
                                   }

                                   var textNode = document.createElement('span');



                                       if(value == '1'){
                                           textNode.innerText = self.props.gridHeader[conIndex].change_value[0]

                                       } else{
                                           textNode.innerText = self.props.gridHeader[conIndex].change_value[1]

                                       }


                                   td.appendChild(textNode);


                               }
                            }
                        }
                        return cellProperties;

                    }

                }


            },


            //afterValidate:this.afterValidater.bind(this),
            //comments: true,


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
