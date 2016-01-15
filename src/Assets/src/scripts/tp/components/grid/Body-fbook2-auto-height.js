import React, { Component, PropTypes }  from "react"
import Form from "../form/page_add_edit/Form"
import $ from "jquery"
import floatThead from "floatthead"

import {Table, Column, Cell} from 'fixed-data-table';


export default class Body extends Component {
    constructor(props) {
        super(props);


        this._onColumnResizeEndCallback = this._onColumnResizeEndCallback.bind(this);
    }


    _onColumnResizeEndCallback(newColumnWidth, dataKey) {
        columnWidths[dataKey] = newColumnWidth;
        isColumnResizing = false;
        //   this._onDataChange();
    }

    setRowEdit(editID, focusIndex) {
        if (this.props.formType == 'inline')
            this.props.setRowEdit(editID, focusIndex)
    }

    handleDeleteItem(id) {

        if (!confirm('Delete this record?')) {
            return;
        }
        else
            this.props.handleDeleteItem(id)


    }

    callWindowEdit(id) {
        this.props.callWindowEdit(id)
    }

    changeValues(e) {

        this.props.inlineChangeValues(e)
    }

    componentDidMount() {

    }

    componentWillUnmount() {


    }
    rowGetter(rowIndex) {
        return 80;
    }

    saveInlineForm(id) {

        this.props.saveInlineForm(id)
    }

    componentWillUpdate(nextProps) {
        //if(nextProps.bodyData.length >= 1)
        //    $("#tp-table").floatThead()
    }

    rowHeightGetter(e, e2){

        if(this.props.editID == 0){

            let maxHeight = 40;

            this.props.bodyHeader.map((grid, index) => {
                if(maxHeight <= $(`.solar-row-${index}-${e2}`).height()+3){
                    maxHeight = $(`.solar-row-${index}-${e2}`).height()+3;
                }


            })
            return maxHeight;
        }

        else if(this.props.editID == e.get(e2).get('id')){



            return 100
        }

        else
        {

            let maxHeight = 40;

            this.props.bodyHeader.map((grid, index) => {
                if(maxHeight <= document.getElementsByClassName(`.solar-row-${index}-${e2}`).clientHeight+3){
                    maxHeight = document.getElementsByClassName(`.solar-row-${index}-${e2}`).clientHeight+3;
                }
            })
            return maxHeight;
        }

    }
    onContentHeightChange(contentHeight){
        //console.log(contentHeight);
    }

    render() {
        const { bodyData, bodyHeader, table, formType, editID, formData, formControls, focusIndex,
            handleDeleteItem, saveInlineForm, showInlineForm, removeInlineForm} = this.props;


        const CheckBoxCell = ({rowIndex, data, col, ...props}) => {

            const boxChecked = data.get(rowIndex).get(col) == 1 ? true : false
            return <Cell {...props}>

                <input type="checkbox" checked={boxChecked}  />
            </Cell>
        };

        const TextCell = ({rowIndex, data, col, ...props}) => {
            let cellformControl = [];
            let columnIndex = 0;

            if (this.props.formControls.length >= 1)
                this.props.formControls.map((formControl, colIndex)=> {
                    if (formControl.column == col){
                        cellformControl.push(formControl)
                        columnIndex = colIndex
                    }

                })


            return <Cell {...props} onClick={this.setRowEdit.bind(this, data.get(rowIndex).get('id'), columnIndex)} style={{ height: 'auto !important'}}
                                    className={`solar-row-${columnIndex}-${rowIndex}`}
            >

                {this.props.formType == 'inline' && editID == data.get(rowIndex).get('id') ?
                    <Form formControls={cellformControl}
                          formData={this.props.formData}
                          formType={this.props.formType}
                          formValue={data.get(rowIndex).get(col)}
                          focusIndex={this.props.focusIndex}
                          gridIndex={columnIndex}

                          changeHandler={this.changeValues.bind(this)}
                    />
                    :
                    <span>
                                {data.get(rowIndex).get(col)}
                            </span>
                }
            </Cell>
        }

        const RowNumberCell = ({rowIndex}) => (
            <Cell>
                {rowIndex + 1}
            </Cell>
        );
        const ActionCell = ({rowIndex, data, formType, editID, col}) => (
            <Cell >

                {formType == 'inline' ?
                    editID == data.get(rowIndex).get(col) ?
                        <span>
                            <a className="btn btn-sm btn-success"
                               onClick={this.saveInlineForm.bind(this, data.get(rowIndex).get(col))}>
                                <i className="fa fa-check"></i>
                            </a>
                            &nbsp;
                            <a className="btn btn-sm btn-danger" onClick={this.setRowEdit.bind(this, 0, 0)}>
                                <i className="fa fa-times"></i>
                            </a>
                        </span>
                        :
                        <span>
                            <a className="btn btn-sm" onClick={this.setRowEdit.bind(this, data.get(rowIndex).get(col), 0)}>
                                <i className="fa fa-pencil"></i>
                            </a>
                            &nbsp;
                            <a className="btn btn-sm"
                               onClick={this.handleDeleteItem.bind(this, data.get(rowIndex).get(col))}>
                                <i className="fa fa-trash"></i>
                            </a>
                        </span>
                    : formType == 'window' ?
                    <span>
                        <a className="btn btn-sm" href="javascript:void(0)"
                           onClick={this.callWindowEdit.bind(this, data.get(rowIndex).get(col))}>
                            <i className="fa fa-pencil"></i>
                        </a>
                        &nbsp;
                        <a className="btn btn-sm"
                           onClick={this.handleDeleteItem.bind(this, data.get(rowIndex).get(col))}>
                            <i className="fa fa-trash"></i>
                        </a>
                    </span>
                    :
                    <span>
                        <a className="btn btn-sm" href={`#edit/${data.get(rowIndex).get(col)}`}>
                            <i className="fa fa-pencil"></i>
                        </a>
                        &nbsp;
                        <a className="btn btn-sm"
                           onClick={this.handleDeleteItem.bind(this, data.get(rowIndex).get(col))}>
                            <i className="fa fa-trash"></i>
                        </a>
                    </span>}

            </Cell>
        );

        const gridColumns = bodyHeader.map((grid, index) => {

            let rowCell = null;
            let rowWidth = 100;
            let rowflexGrow = 0;

            if(grid.type == '--text'){
                rowCell = <TextCell data={bodyData} col={grid.column} />
                rowWidth = 600
                rowflexGrow = 1
            } else if(grid.type == '--checkbox'){
                rowCell = <TextCell data={bodyData} col={grid.column} />
                rowWidth = 600
                rowflexGrow = 0
            }



            return <Column key={index}
                           header={<Cell>{grid.title}</Cell>}
                           cell={rowCell}
                           width={rowWidth}
                           flexGrow={rowflexGrow}

            />
        })

        const dataTable = bodyData.size ?
            <Table
                rowHeight={40}
                maxHeight={500}

                width={this.props.gridWidth}
                height={this.props.gridHeight}
                overflowX="auto"
                rowsCount={bodyData.size}
                allowCellsRecycling={true}
                rowHeightGetter={this.rowHeightGetter.bind(this, bodyData)}

                onContentHeightChange={this.onContentHeightChange.bind(this)}
                headerHeight={40}>
                <Column
                    header={<Cell>№</Cell>}
                    cell={<RowNumberCell />}
                    fixed={true}
                    width={50}


                />

                {gridColumns}

                <Column
                    header={<Cell style={{textAlign: 'center'}}><i className="fa fa-ellipsis-h"></i></Cell>}
                    cell={<ActionCell data={bodyData} formType={formType} editID={editID} col="id" />}

                    width={95}



                />

            </Table>
            :
            null

        const inlineAddForm = <tr  >
            <td style={{width: '30px'}}>

            </td>
            {formControls.map((column, columnIndex) => {
                let cellFormControl = [];
                cellFormControl.push(column)
                if (column.column !== 'id')
                    return <td key={columnIndex}>

                        <Form formControls={cellFormControl}
                              formData={formData}
                              formType={formType}
                              formValue={column.value}
                              focusIndex={focusIndex}
                              gridIndex={columnIndex}

                              changeHandler={this.changeValues.bind(this)}
                        />


                    </td>
            })}
            <td style={{width: '87px', padding: '3px'}}>

                            <span>
                                <a className="btn btn-sm btn-success" onClick={this.saveInlineForm.bind(this)}>
                                    <i className="fa fa-check"></i>
                                </a>
                                &nbsp;

                                <a className="btn btn-sm btn-danger" onClick={removeInlineForm}>
                                    <i className="fa fa-times"></i>
                                </a>
                            </span>


            </td>
        </tr>
        return (<div id="gridBody" className="m-a-sm ">
            <div className="white with-3d-shadow">

                <table id="test_table" style={{width:'100%'}}>
                    <thead>
                    <tr>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>John</td>
                        <td>Doe</td>
                        <td>john@example.com</td>
                    </tr>
                    <tr>
                        <td>Mary</td>
                        <td>Moe</td>
                        <td>mary@example.com</td>
                    </tr>
                    <tr>
                        <td>July</td>
                        <td>Dooley</td>
                        <td>july@example.com</td>
                    </tr>
                    </tbody>
                </table>
                {dataTable}


            </div>
        </div>)
    }
}
Body.defaultProps = {
    table: {
        fixedHeader: false,
        stripedRows: true,
        showRowHover: true,
        selectable: true,
        multiSelectable: false,
        enableSelectAll: false,
        deselectOnClickaway: true,
        displayRowCheckbox: false,
        displaySelectAll: false
    },
    formControls: [],
    bodyData: {}
};

Body.propTypes = {
    table: PropTypes.object.isRequired,
    bodyHeader: PropTypes.array.isRequired,
    bodyData: PropTypes.object.isRequired,
};


/*
 <table id="tp-table" className="table table-bordered table-striped table-hover ">
 <thead>
 <tr>
 <th style={{width: '25px'}}><b>№</b></th>
 {gridHeader}
 <th style={{textAlign: 'center'}}><i className="fa fa-ellipsis-h"></i></th>
 </tr>
 </thead>
 <tbody>
 { showInlineForm === true ? inlineAddForm : null}
 { gridData }

 </tbody>
 </table>

 */