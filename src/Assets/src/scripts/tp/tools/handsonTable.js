import { inlineSave, inlineSaveUpdate, afterChangeTrigger} from "../api/";
import validationGrid from "../components/grid/validation/";
import numeral from 'numeral';
var _table_ = document.createElement('table'),
    _tr_ = document.createElement('tr'),
    _th_ = document.createElement('th'),
    _td_ = document.createElement('td');

function buildHtmlTable(arr) {
    var table = _table_.cloneNode(false),
        columns = addAllColumnHeaders(arr, table);
    for (var i=0, maxi=arr.length; i < maxi; ++i) {
        var tr = _tr_.cloneNode(false);
        for (var j=0, maxj=columns.length; j < maxj ; ++j) {
            var td = _td_.cloneNode(false);

            td.appendChild(document.createTextNode(arr[i][columns[j]] || ''));
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    return table;
}
function addAllColumnHeaders(arr, table) {
    var columnSet = [],
        tr = _tr_.cloneNode(false);
    for (var i=0, l=arr.length; i < l; i++) {
        for (var key in arr[i]) {
            if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key)===-1) {
                columnSet.push(key);
                var th = _th_.cloneNode(false);
                th.appendChild(document.createTextNode(key));
                tr.appendChild(th);
            }
        }
    }
    table.appendChild(tr);
    return columnSet;
}

export function customDropdownRenderer(instance, td, row, col, prop, value, cellProperties) {

    while (td.firstChild) {
        td.removeChild(td.firstChild);
    }

    var selectedId;
    var multiple = cellProperties.chosenOptions.multiple;
    var optionsList = cellProperties.chosenOptions.data;

    var valueField = cellProperties.chosenOptions.valueField;
    var textField = cellProperties.chosenOptions.textField;
    var valueReal = value;







    var values = (value + "").split(",");


    var value = [];
    for (var index = 0; index < optionsList.length; index++) {

        if (multiple === true) {
            values.map(tagValue=> {

                if (tagValue == optionsList[index]['id']) {
                    value.push(optionsList[index]['label']);
                }
            })
        }
        else {
            if (valueReal == optionsList[index]['id']) {
                value.push(optionsList[index]['label']);
            }

        }
    }
    value = value.join(", ");


    let pre = document.createElement('span');
    pre.innerHTML = value
    td.appendChild(pre)


    td.setAttribute('class', cellProperties.className);

    return td;
}
export function gridImage(instance, td, row, col, prop, value, cellProperties) {

    while (td.firstChild) {
        td.removeChild(td.firstChild);
    }


    if (value) {
        let pre_link = document.createElement('a');


        let value_image = JSON.parse(value);

        let image_thum_url = value_image.thumbUrl + value_image.uniqueName
        let image_url = value_image.destinationUrl + value_image.uniqueName

        pre_link.setAttribute('target', '_blank');
        pre_link.setAttribute('href', image_url);

        let image = document.createElement('img');
        image.setAttribute('class', 'grid-thumb');
        image.setAttribute('src', image_thum_url);

        pre_link.appendChild(image)


        td.appendChild(pre_link);


        return td;
    }


}
export function gridColor(instance, td, row, col, prop, value, cellProperties) {

    while (td.firstChild) {
        td.removeChild(td.firstChild);
    }



    if (value) {
        let pre = document.createElement('span');
        pre.innerHTML = value;
        pre.style.color = value;
        td.appendChild(pre);
        td.style.color = value;
        td.style.backgroundColor = value;


        return td;
    }


}
export function genrateComboboxvalues(data, header) {

    let optionsList = [];
    data.map((lsdata, lsindex) => {

        var valuef = [];
        if (header.options.textField instanceof Array) {
            header.options.textField.map(tf=> {

                valuef.push(lsdata[tf]);
            })
        } else
            valuef.push(lsdata[header.options.textField]);

        valuef = valuef.join(", ");
        optionsList.push({
            id:lsdata[header.options.valueField],
            label:valuef
        })
    })

    return optionsList;
}

export function gridJson(instance, td, row, col, prop, value, cellProperties) {

    while (td.firstChild) {
        td.removeChild(td.firstChild);
    }

    if (value) {

        let jsonTable = JSON.parse(value);
        td.appendChild(buildHtmlTable(jsonTable));
        return td;
    }


}


export function afterChange(changes, source, isValid) {



    if (changes) {



        let data_pppp = this.tp_handSonTable.getData();

        let colIndex = 0;

        if (changes[0][1] === parseInt(changes[0][1], 10)) {
            colIndex = changes[0][1]
        } else
            colIndex = this.getColumnIndex(changes[0][1]);


        let colType = this.props.gridHeader[colIndex].type;



        let row = changes[0][0];
        let elValue = changes[0][3];


        ///auto-calculate
        let calculate_columns = []

        this.props.gridHeader.map((fcontrol, findex)=> {
            if (fcontrol.type == '--auto-calculate') {


                let calculate_type = fcontrol.options.calculate_type;
                let calculate_column = fcontrol.column;

                let columns = [];

                fcontrol.options.calculate_columns.map((calculate_column, cal_index)=> {



                    columns.push(
                        {column: calculate_column, value: this.getValueAtCell(row, calculate_column)}
                    );
                })
                if(calculate_type == '--urtug-bodoh'){
                    let noat_shalgah = fcontrol.options.noat_shalgah;
                    let irsen_une = fcontrol.options.irsen_une;



                    calculate_columns.push(
                        {
                            column:calculate_column,
                            type:calculate_type,
                            columns:columns,
                            dataIndex:findex,
                            noat_shalgah: this.getValueAtCell(row, noat_shalgah),
                            irsen_une: this.getValueAtCell(row, irsen_une)
                        }
                    )
                } else if(calculate_type == '--noat-bodoh'){
                    let noat_shalgah = fcontrol.options.noat_shalgah;
                    let irsen_une = fcontrol.options.irsen_une;
                    let urtug_une = fcontrol.options.urtug_une;

                    calculate_columns.push(
                        {
                            column:calculate_column,
                            type:calculate_type,
                            columns:columns,
                            dataIndex:findex,
                            noat_shalgah: this.getValueAtCell(row, noat_shalgah),
                            irsen_une: this.getValueAtCell(row, irsen_une),
                            urtug_une: this.getValueAtCell(row, urtug_une)
                        }
                    )
                } else if(calculate_type == '--hudaldal-une-bodoh'){
                    let borluulaltiin_huvi = fcontrol.options.borluulaltiin_huvi;
                    let urtug_une = fcontrol.options.urtug_une;
                    let noattei_zarah = fcontrol.options.noattei_zarah;
                    let nhattai_zarah = fcontrol.options.nhattai_zarah;



                    calculate_columns.push(
                        {
                            column:calculate_column,
                            type:calculate_type,
                            columns:columns,
                            dataIndex:findex,
                            borluulaltiin_huvi: this.getValueAtCell(row, borluulaltiin_huvi),
                            urtug_une: this.getValueAtCell(row, urtug_une),
                            nhattai_zarah: this.getValueAtCell(row, nhattai_zarah),
                            noattei_zarah: this.getValueAtCell(row, noattei_zarah)
                        }
                    )
                } else if(calculate_type == '--noat-zarah'){
                    let borluulaltiin_huvi = fcontrol.options.borluulaltiin_huvi;
                    let urtug_une = fcontrol.options.urtug_une;
                    let noattei_zarah = fcontrol.options.noattei_zarah;


                    calculate_columns.push(
                        {
                            column:calculate_column,
                            type:calculate_type,
                            columns:columns,
                            dataIndex:findex,
                            borluulaltiin_huvi: this.getValueAtCell(row, borluulaltiin_huvi),
                            urtug_une: this.getValueAtCell(row, urtug_une),
                            noattei_zarah: this.getValueAtCell(row, noattei_zarah)
                        }
                    )
                } else if(calculate_type == '--nhat-zarah'){
                    let borluulaltiin_huvi = fcontrol.options.borluulaltiin_huvi;
                    let urtug_une = fcontrol.options.urtug_une;
                    let nhattai_zarah = fcontrol.options.nhattai_zarah;


                    calculate_columns.push(
                        {
                            column:calculate_column,
                            type:calculate_type,
                            columns:columns,
                            dataIndex:findex,
                            borluulaltiin_huvi: this.getValueAtCell(row, borluulaltiin_huvi),
                            urtug_une: this.getValueAtCell(row, urtug_une),
                            nhattai_zarah: this.getValueAtCell(row, nhattai_zarah)
                        }
                    )
                } else
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
                } else if(calculate_column.type == '--urtug-bodoh'){


                    if(calculate_column.noat_shalgah == 1 || calculate_column.noat_shalgah == '1'){
                        calculate_result = Math.ceil((calculate_column.irsen_une/1.1));
                    } else {

                        calculate_result = calculate_column.irsen_une*1;
                    }

                }else if(calculate_column.type == '--noat-bodoh'){

                    if(calculate_column.noat_shalgah == 1 || calculate_column.noat_shalgah == '1'){
                        calculate_result = (calculate_column.irsen_une*1) - (calculate_column.urtug_une*1);
                    } else {
                        calculate_result = 0;
                    }

                }else if(calculate_column.type == '--hudaldal-une-bodoh'){

                    let hudaldah_und_bodson = 0;

                    let pluss_vlue = (calculate_column.urtug_une/100)*calculate_column.borluulaltiin_huvi;
                    hudaldah_und_bodson = (calculate_column.urtug_une*1)+(pluss_vlue);

                    let noat = 0;
                    let nhat = 0;

                    if(calculate_column.noattei_zarah == 1 || calculate_column.noattei_zarah == '1'){
                        noat = (hudaldah_und_bodson*0.1);

                    }

                    if(calculate_column.nhattai_zarah == 1 || calculate_column.nhattai_zarah == '1'){
                        nhat = (hudaldah_und_bodson*0.01);

                    }
                    hudaldah_und_bodson = hudaldah_und_bodson+nhat+noat;
                    hudaldah_und_bodson = Math.ceil((hudaldah_und_bodson/10))*10;

                    calculate_result = hudaldah_und_bodson;

                }else if(calculate_column.type == '--noat-zarah'){

                    let hudaldah_und_bodson = 0;

                    let pluss_vlue = (calculate_column.urtug_une/100)*calculate_column.borluulaltiin_huvi;
                    hudaldah_und_bodson = (calculate_column.urtug_une*1)+(pluss_vlue);

                    let noat = 0;


                    if(calculate_column.noattei_zarah == 1 || calculate_column.noattei_zarah == '1'){
                        noat = (hudaldah_und_bodson*0.1);

                    }



                    calculate_result = noat;

                } else if(calculate_column.type == '--nhat-zarah'){

                    let hudaldah_und_bodson = 0;

                    let pluss_vlue = (calculate_column.urtug_une/100)*calculate_column.borluulaltiin_huvi;
                    hudaldah_und_bodson = (calculate_column.urtug_une*1)+(pluss_vlue);

                    let nhat = 0;


                    if(calculate_column.nhattei_zarah == 1 || calculate_column.nhattei_zarah == '1'){
                        nhat = (hudaldah_und_bodson*0.01);

                    }



                    calculate_result = nhat;

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

                    let thisValue = this.tp_handSonTable.getDataAtCell(row, calculate_column.dataIndex);

                    if(thisValue != calculate_result){

                        this.tp_handSonTable.setDataAtCell(row, calculate_column.dataIndex, calculate_result);
                    }

                }
            }
        });

        if(this.props.gridHeader[colIndex].after_change_trigger){


            afterChangeTrigger([colIndex], elValue, 'multi_items_form').then((data)=>{
                let setValues = null;



                if(data.status){
                    if(data.status == 'success'){
                        setValues = data.new_values;

                        setValues.map(setValue=>{
                            // console.log(setValue[0][0], 'changeing', setValue[1]);

                            this.tp_handSonTable.setDataAtCell(row, setValue[0][0], setValue[1]);



                            // this.changeValues(setValue[0], setValue[1]);
                        })
                    } else if(data.status == 'error'){
                        alert(data.error_message);
                        window.location.replace('#/');
                    }

                } else {
                    setValues = data;

                    setValues.map(setValue=>{
                        // console.log(setValue[0][0], 'changeing', setValue[1]);

                        this.tp_handSonTable.setDataAtCell(row, setValue[0][0], setValue[1]);

                        // this.changeValues(setValue[0], setValue[1]);
                    })
                }
            })

        }

        if (changes[0][1] != this.props.identity_name) {


            let rowDatas = this.getData(changes[0][0]);




            let error_not_found = true;

            let data = {};

            let edit_id = null;
            rowDatas.map((rowData, index)=> {
                if (index <= this.props.gridHeader.length - 1) {

                    let col = index;

                    this.tp_handSonTable.getCellValidator(row, col)(rowData, function (isValid) {

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

export function exportEXCEL() {

    var date;
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);


    this.exportPlugin.downloadFile('csv', {
        filename: this.props.setup.page_name + '-' + date,
        exportHiddenRows: true,     // default false, exports the hidden rows
        exportHiddenColumns: true,  // default false, exports the hidden columns
        columnHeaders: true,        // default false, exports the column headers
        rowHeaders: true        // default false, exports the row headers\
        //range: [null, null, this.props.gridHeader.length-1, this.props.gridHeader.length-1]
    });
}

export function afterValidater(isValid, value, row, prop, source) {

    let columnIndex = this.getColumnIndex(prop);
    if(isValid){
        this.tp_handSonTable.setCellMeta(row, columnIndex, 'className', '');
        return true;
    }
    else{

        this.tp_handSonTable.setCellMeta(row, columnIndex, 'className', 'required-field');
        return false;
    }


}


export function setUpHandsonTable(tpNewHeight) {


    const {gridHeader, listData} = this.props;

    if (this.tp_handSonTable !== null) {
        this.tp_handSonTable.destroy()
    }
    let tp_colHeader = [];

    let tp_columns = [];
    let fixedColumnsLeft = 0;

    gridHeader.map((header, h_index)=> {
        let colReadOnly = false;
        if (header.hidden) {

        } else {
            if(header.readOnly){
                colReadOnly = true;
            }
            tp_colHeader.push(header.title)
            let gridColumn = {}
            switch (header.type) {

                case "--text":
                    gridColumn = {
                        data: header.column,
                        editor: 'text',
                        type: 'text',
                        readOnly:colReadOnly,
                        validator: this.validationCaller.bind(this, header.validate),

                    }
                    break;
                case "--textarea":
                    gridColumn = {
                        data: header.column,
                        editor: 'text',
                        type: 'text',
                        readOnly:colReadOnly,
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
                        readOnly:colReadOnly,
                        validator: this.validationCaller.bind(this, header.validate),
                    }
                    break;
                case "--combobox":

                    const optionsList = genrateComboboxvalues(this.props.formData[header.column].data.data, header);
                    gridColumn = {
                        data: header.column,
                        editor: "chosen",
                        readOnly:colReadOnly,
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
                        readOnly:colReadOnly,
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
                case "--color":
                    gridColumn = {

                        data: header.column,
                        renderer: gridColor,
                    }

                    break;
                case "--json":
                    gridColumn = {
                        readOnly:colReadOnly,
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
                        readOnly:colReadOnly,
                        validator: this.validationCaller.bind(this, header.validate),
                        dateFormat: "YYYY-MM-DD"
                        //allowInvalid: false
                    }

                    break;
                case "--number":
                    gridColumn =
                    {
                        data: header.column,
                        type: 'numeric',
                        editor: 'numeric',
                        readOnly:colReadOnly,
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
                        readOnly:colReadOnly,
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
                        readOnly:colReadOnly,
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

        this.tp_dataSchema[header.column] = null;
    })

    this.tp_dataSchema[this.props.identity_name] = -1;

    if (this.props.permission.d == true || this.props.permission.u == true || this.props.ifUpdateDisabledCanEditColumns.length >= 1) {
        tp_colHeader.push(this.props.edit_delete_column_title)



        tp_columns.push({
            data: this.props.identity_name,
            width: 70,
            renderer: this.editDeleteRender.bind(this),
            editor: false
        })
    } else {

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
    var container = document.getElementById(this.grid);

    let sortValues = true;

    let identity_name_pre = this.props.identity_name.split('.');
    let identity_name_real = this.props.identity_name;
    if(identity_name_pre.length >= 2)
        identity_name_real = identity_name_pre[1];




    let gridHieght = tpNewHeight ? tpNewHeight : this.state.tpHeight;


    let tp_options = {
        stretchH: 'all',
        data: gridData,
        rowHeaders: true,
        colHeaders: tp_colHeader,
        columns: tp_columns,
        manualColumnResize: true,
        manualRowResize: true,
        fixedColumnsLeft: fixedColumnsLeft,
        readOnly: readOnly,
        columnSorting: sortValues,
        sortIndicator: true,
        afterChange: this.afterChange.bind(this),
        enterMoves:{row: 0, col: 1},
        fixedRowsBottom:fixedRowsBottom,
        cells: function(row, col, prop) {



            var cellProperties = {};

            var conIndex = self.getColumnIndex(prop)
            var translate = self.getColumnTranslate(conIndex)

            let cellClass = ''

            let hasahToo =  columnSummary.length >=1 ? 2 : 1;

            if(row <= gridData.length-hasahToo) {
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
        filters: true,
        autoWrapRow:true,
        afterValidate:this.afterValidater.bind(this),
        height: gridHieght
    };

    if(this.props.order){
        let column_pre = this.props.order.column.split('.');
        let column_real = this.props.order.column;
        if(column_pre.length >= 2)
            column_real = column_pre[1];

        if(column_real !== null && this.props.order.sortOrder !== null && column_real  != identity_name_real)
            sortValues = {
                column: this.getColumnIndex(column_real),
                sortOrder: this.props.order.sortOrder == 'ASC' ? true : false
            };

        //        sord
        tp_options.beforeColumnSort = this.beforeColumnSort.bind(this);
    }

    if(this.state.formGrid){
        tp_options.minSpareRows =1;
        tp_options.startRows =1;
    } else {
        tp_options.dataSchema = this.tp_dataSchema;
        tp_options.dropdownMenu = [
            'alignment', '---------',
            'filter_by_condition', '---------',
            'filter_by_value', '---------',
            'filter_action_bar', '---------',
        ];
        tp_options.fillHandle = false;
    }

    this.tp_handSonTable = new Handsontable(container, tp_options);

    this.exportPlugin = this.tp_handSonTable.getPlugin('exportFile');
    this.exportPlugin.exportAsString('csv', {
        exportHiddenRows: true, // default false
        exportHiddenColumns: true, // default false
        columnHeaders: true, // default false
        rowHeaders: true, // default false
        columnDelimiter: ';', // default ','

    });


}


export function editDeleteRender(instance, td, row, col, prop, value, cellProperties) {

    while (td.firstChild) {
        td.removeChild(td.firstChild);
    }
    var self = this;

    let pre_del =  document.createElement('a');
    let pre_editBtn =  document.createElement('a');
    let pre =  document.createElement('span');

    td.appendChild(pre)

    if (this.props.formType != 'inline' && this.state.formGrid !== true) {
        ///EDIT BUTTTON
        pre_editBtn.href = "#edit/" + value;
        pre_editBtn.innerHTML = "<i class=\"material-icons green-color\">&#xE254;</i>&nbsp;";

        if (this.props.permission.u == true || this.props.ifUpdateDisabledCanEditColumns.length >= 1)
            pre.appendChild(pre_editBtn);
    }

    let all_null = true;
    if(this.tp_handSonTable){
        if(this.tp_handSonTable.rootElement){
            let h_datas = this.tp_handSonTable.getDataAtRow(row);



            h_datas.map((h_data)=>{
                if(h_data !== null){
                    all_null =false;
                }
            });
        }

    }


    if(all_null === false){
        // DELETE BUTTON
        pre_del.addEventListener("click", function () {

            self.handleDeleteItem(value)

        });


        pre_del.innerHTML = "<i class=\"material-icons red-color\">&#xE872;</i> ";
        if (this.props.permission.d == true)
            pre.appendChild(pre_del);
    }




    return td;




}


export function getColumnType(column) {

    return this.props.gridHeader[column].type;

}
export function getColumn(index) {

    return this.props.gridHeader[index].column;

}

/* Grid */
export function getColumnIndex(column) {
    //return _.findIndex(this.props.gridHeader, { column: column })
    return this.props.gridHeader.findIndex(x => x.column == column);
}

export function getColumnValdation(column) {
    //return _.findIndex(this.props.gridHeader, { column: column })
    if (this.props.gridHeader[column].validate)
        return this.props.gridHeader[column].validate;
    else
        return ''
}

export function getColumnTranslate(column) {
    //return _.findIndex(this.props.gridHeader, { column: column })
    if (this.props.gridHeader[column] && this.props.gridHeader[column].translate)
        return this.props.gridHeader[column].translate;
    else
        return false
}
export function getValueAtCell(row, calculate_column){
    let colIndex_ = this.getColumnIndex(calculate_column)
    return this.tp_handSonTable.getDataAtCell(row, colIndex_);
} {

}

export function getData(row) {
    return this.tp_handSonTable.getDataAtRow(row);
}

export function validationCaller(validateData, value, callback) {
    if(validateData){
        return validationGrid(validateData, value, callback);
    } else callback(true)

}